const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { execSync } = require('child_process');

// Bot token
const token = '8870396881:AAHZwCW8W8PM0WeAdFs728ZO0gU1n29ed6E';

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

console.log('🦞 Pembangunan_UM Bot is running...');

// Helper: Read data.json
function readData() {
  const raw = fs.readFileSync('./data.json', 'utf8');
  return JSON.parse(raw);
}

// Helper: Write data.json
function writeData(data) {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf8');
}

// Helper: Generate HTML
function generateHTML() {
  execSync('node generate.js', { stdio: 'inherit' });
}

// Helper: Git commit & push
function gitPush(message) {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
}

// Command: /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `I'm here! 🦞

Saya bot monitoring project Kos UM 2 Lantai.

Kirim transaksi dengan format natural:
- "Beli semen 10 sak 500rb"
- "Upah kuli 3 orang"
- "Senin: Cor lantai 1"

Atau gunakan command:
/status - Lihat ringkasan project
/help - Bantuan`);
});

// Command: /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `📋 Cara Pakai:

1. Kirim transaksi natural:
   "Beli paku 5kg 50rb"
   "Upah tukang 1 orang"
   
2. Deskripsi pekerjaan:
   "Senin: Menebang pohon mangga"
   
3. Command:
   /status - Ringkasan project
   /help - Bantuan ini`);
});

// Command: /status
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  const data = readData();
  
  const total = data.transactions.reduce((sum, t) => sum + t.total, 0);
  const count = data.transactions.length;
  
  bot.sendMessage(chatId, `📊 Status Project Kos UM

💰 Total Pengeluaran: Rp ${total.toLocaleString('id-ID')}
📝 Total Transaksi: ${count}

🌐 Website: https://mfaisalyahya123-ux.github.io/kos-um/`);
});

// Helper: Parse natural language input
function parseTransaction(text) {
  const today = new Date().toISOString().split('T')[0];
  
  // Pattern: "Beli [item] [qty] [unit] [price] (dari [source])"
  const buyPattern = /beli\s+([\w\s]+?)\s+(\d+)\s*([\w]+)?\s+(\d+[krb]+)/i;
  const match = text.match(buyPattern);
  
  if (match) {
    const description = match[1].trim();
    const quantity = parseInt(match[2]);
    const unit = match[3] || 'item';
    const priceStr = match[4].toLowerCase();
    
    // Parse price (support: 500rb, 50k, 5000)
    let price = 0;
    if (priceStr.includes('rb')) {
      price = parseInt(priceStr.replace('rb', '')) * 1000;
    } else if (priceStr.includes('k')) {
      price = parseInt(priceStr.replace('k', '')) * 1000;
    } else {
      price = parseInt(priceStr);
    }
    
    // Detect funding source
    const sourceMatch = text.match(/dari\s+([\w\s]+)/i);
    const funding_source = sourceMatch ? sourceMatch[1].trim() : 'Uang Ayah';
    
    // Auto-detect category
    let category = 'Material';
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('upah') || lowerDesc.includes('kuli') || lowerDesc.includes('tukang') || lowerDesc.includes('mandor')) {
      category = 'Upah';
    } else if (lowerDesc.includes('roti') || lowerDesc.includes('kopi') || lowerDesc.includes('rokok') || lowerDesc.includes('galon') || lowerDesc.includes('es')) {
      category = 'Jajan & Minuman';
    } else if (lowerDesc.includes('linggis') || lowerDesc.includes('pacul') || lowerDesc.includes('scaffolding') || lowerDesc.includes('mixer')) {
      category = 'Alat';
    } else if (lowerDesc.includes('beton') || lowerDesc.includes('besi') || lowerDesc.includes('rangka')) {
      category = 'Struktur Bangunan';
    }
    
    return {
      date: today,
      category,
      description,
      quantity,
      unit,
      price_per_unit: Math.round(price / quantity),
      total: price,
      notes: '',
      funding_source
    };
  }
  
  return null;
}

// Handle text messages (transactions)
bot.on('message', async (msg) => {
  // Skip commands
  if (msg.text && msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Try to parse transaction
  const transaction = parseTransaction(text);
  
  if (transaction) {
    try {
      // Read current data
      const data = readData();
      
      // Generate new ID
      const newId = Math.max(...data.transactions.map(t => t.id)) + 1;
      transaction.id = newId;
      
      // Add transaction
      data.transactions.push(transaction);
      
      // Write back
      writeData(data);
      
      // Generate HTML
      generateHTML();
      
      // Git commit & push
      const commitMsg = `Add: ${transaction.description} Rp ${transaction.total.toLocaleString('id-ID')}`;
      gitPush(commitMsg);
      
      // Reply success
      bot.sendMessage(chatId, `✅ Transaksi tercatat!

📝 ${transaction.description}
💰 Rp ${transaction.total.toLocaleString('id-ID')}
📦 ${transaction.quantity} ${transaction.unit}
📂 ${transaction.category}
💵 ${transaction.funding_source}
📅 ${transaction.date}

🌐 https://mfaisalyahya123-ux.github.io/kos-um/`);
    } catch (error) {
      console.error('Error adding transaction:', error);
      bot.sendMessage(chatId, `❌ Gagal menambahkan transaksi: ${error.message}`);
    }
  } else {
    // Could not parse
    bot.sendMessage(chatId, `Maaf, saya belum bisa memahami format ini.

Contoh format yang bisa:
- "Beli semen 10 sak 500rb"
- "Beli paku 5kg 50rb dari ayah"
- "Beli es batu 5rb"

Atau gunakan /help untuk bantuan.`);
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
