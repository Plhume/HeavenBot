const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const dbPath = './voice.db';

async function openVoiceDatabase() {
    try {
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS voice (
                userId TEXT PRIMARY KEY,
                time UNSIGNED INT
            )
        `);

        return db;
    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la base de données SQLite :', error);
    }
}

async function setVoiceTime(userId, time) {
    const db = await openVoiceDatabase();
    await db.run(`
        INSERT INTO voice (userId, time)
        VALUES (?, ?)
        ON CONFLICT(userId) DO UPDATE SET time = ?
    `, [userId, time]);
}

async function removeVoiceTime(userId) {
    const db = await openVoiceDatabase();
    await db.run('DELETE FROM voice WHERE userId = ?', [userId]);
}

module.exports = { openVoiceDatabase, setVoiceTime, removeVoiceTime };