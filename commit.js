'use strict';

/**
 * commit.js — Satu command untuk generate, commit, & push
 *
 * Cara pakai (dari folder kos-um):
 *   node commit.js "deskripsi perubahan"
 *
 * Contoh:
 *   node commit.js "Tambah transaksi tepung 9 Jun"
 *   node commit.js "Update absensi minggu 2"
 */

const { execSync } = require('child_process');
const path = require('path');

// Set cwd ke folder tempat script ini berada
const CWD = __dirname;

function run(cmd) {
    console.log('> ' + cmd);
    execSync(cmd, { encoding: 'utf-8', stdio: 'inherit', cwd: CWD });
}

const msg = process.argv[2] || `Update: ${new Date().toLocaleDateString('id-ID')}`;

try {
    // 1. Regenerate index.html dari data.json
    run('node generate.js');

    // 2. Cek ada perubahan
    const status = execSync('git status --porcelain', { encoding: 'utf-8', cwd: CWD });
    if (!status.trim()) {
        console.log('Nothing to commit.');
        process.exit(0);
    }

    // 3. Add semua perubahan
    run('git add -A');

    // 4. Commit dengan pesan
    execSync(`git commit -m "${msg}"`, { encoding: 'utf-8', stdio: 'inherit', cwd: CWD });

    // 5. Pull rebase dulu untuk avoid conflict
    run('git pull origin main --rebase');

    // 6. Push ke GitHub Pages
    run('git push origin main');

    console.log('✅ Done — pushed to GitHub Pages');
} catch (e) {
    console.error('❌ Failed:', e.message);
    process.exit(1);
}
