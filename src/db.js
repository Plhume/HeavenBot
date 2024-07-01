const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

// Chemin vers le fichier de la base de données SQLite
const dbPath = './messages.db';

// Fonction pour ouvrir la base de données SQLite
async function openDatabase() {
    try {
        // Ouvrir la base de données SQLite
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Créer la table si elle n'existe pas déjà
        await db.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                userId TEXT PRIMARY KEY,
                messageCount INTEGER
            )
        `);

        return db;
    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la base de données SQLite :', error);
    }
}

async function setMessages(userId, messageCount) {
    const db = await openDatabase();
    await db.run(`
        INSERT INTO messages (userId, messageCount)
        VALUES (?, ?)
        ON CONFLICT(userId) DO UPDATE SET messageCount = ?
    `, [userId, messageCount, messageCount]);
}

async function removeUser(userId) {
    const db = await openDatabase();
    await db.run('DELETE FROM messages WHERE userId = ?', [userId]);
}

module.exports = { openDatabase, setMessages, removeUser };