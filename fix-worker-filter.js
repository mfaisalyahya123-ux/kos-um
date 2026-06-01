const fs = require('fs');
let content = fs.readFileSync('generate.js', 'utf8');

// Find and replace the worker filtering logic
// We need to add end_date check for each worker type

// For Mandor
const mandorOld = `        // Mandor
        if (data.workers.mandor && data.workers.mandor.length > 0) {
            data.workers.mandor.forEach(worker => {
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

const mandorNew = `        // Mandor
        if (data.workers.mandor && data.workers.mandor.length > 0) {
            data.workers.mandor.forEach(worker => {
                // Skip if worker ended before this week
                if (worker.end_date && new Date(worker.end_date) < new Date(monday)) return;
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

content = content.replace(mandorOld, mandorNew);

// For Tukang
const tukangOld = `        // Tukang
        if (data.workers.tukang && data.workers.tukang.length > 0) {
            data.workers.tukang.forEach(worker => {
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

const tukangNew = `        // Tukang
        if (data.workers.tukang && data.workers.tukang.length > 0) {
            data.workers.tukang.forEach(worker => {
                // Skip if worker ended before this week
                if (worker.end_date && new Date(worker.end_date) < new Date(monday)) return;
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

content = content.replace(tukangOld, tukangNew);

// For Tukang Baru
const tukangBaruOld = `        // Tukang Baru
        if (data.workers.tukang_baru && data.workers.tukang_baru.length > 0) {
            data.workers.tukang_baru.forEach(worker => {
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

const tukangBaruNew = `        // Tukang Baru
        if (data.workers.tukang_baru && data.workers.tukang_baru.length > 0) {
            data.workers.tukang_baru.forEach(worker => {
                // Skip if worker ended before this week
                if (worker.end_date && new Date(worker.end_date) < new Date(monday)) return;
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

content = content.replace(tukangBaruOld, tukangBaruNew);

// For Kuli
const kuliOld = `        // Kuli
        if (data.workers.kuli && data.workers.kuli.length > 0) {
            data.workers.kuli.forEach(worker => {
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

const kuliNew = `        // Kuli
        if (data.workers.kuli && data.workers.kuli.length > 0) {
            data.workers.kuli.forEach(worker => {
                // Skip if worker ended before this week
                if (worker.end_date && new Date(worker.end_date) < new Date(monday)) return;
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {`;

content = content.replace(kuliOld, kuliNew);

fs.writeFileSync('generate.js', content);
console.log('✅ generate.js updated with end_date filtering!');
