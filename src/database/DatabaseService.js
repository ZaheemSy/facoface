import { Database } from 'react-native-nitro-sqlite';

const DB_NAME = 'fasoface.db';

let db = null;

const DatabaseService = {
  initialize() {
    db = Database.open({ name: DB_NAME });

    db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        deviceType TEXT NOT NULL DEFAULT '',
        deviceName TEXT NOT NULL DEFAULT '',
        adminPin TEXT NOT NULL DEFAULT '1234'
      )
    `);

    db.execute(`
      CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        embedding TEXT NOT NULL DEFAULT '[]',
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    db.execute(`
      CREATE TABLE IF NOT EXISTS recognition_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personId INTEGER,
        personName TEXT NOT NULL DEFAULT 'Unknown',
        confidence REAL NOT NULL DEFAULT 0.0,
        recognized INTEGER NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    const row = db.execute('SELECT COUNT(*) as count FROM settings').rows[0];
    if (row.count === 0) {
      db.execute(
        "INSERT INTO settings (deviceType, deviceName, adminPin) VALUES ('', '', '1234')",
      );
    }

    return db;
  },

  getDb() {
    if (!db) {
      this.initialize();
    }
    return db;
  },

  // Settings
  getSettings() {
    return db.execute('SELECT * FROM settings WHERE id = 1').rows[0];
  },

  saveSettings(settings) {
    db.execute(
      'UPDATE settings SET deviceType = ?, deviceName = ?, adminPin = ? WHERE id = 1',
      [settings.deviceType, settings.deviceName, settings.adminPin],
    );
  },

  // Persons
  getPersons() {
    return db.execute('SELECT * FROM persons ORDER BY name ASC').rows;
  },

  getPersonById(id) {
    return db.execute('SELECT * FROM persons WHERE id = ?', [id]).rows[0];
  },

  savePerson(name, embedding) {
    return db.execute(
      'INSERT INTO persons (name, embedding) VALUES (?, ?)',
      [name, JSON.stringify(embedding)],
    );
  },

  updatePerson(id, name) {
    db.execute(
      "UPDATE persons SET name = ?, updatedAt = datetime('now') WHERE id = ?",
      [name, id],
    );
  },

  updatePersonEmbedding(id, embedding) {
    db.execute(
      "UPDATE persons SET embedding = ?, updatedAt = datetime('now') WHERE id = ?",
      [JSON.stringify(embedding), id],
    );
  },

  deletePerson(id) {
    db.execute('DELETE FROM persons WHERE id = ?', [id]);
  },

  searchPersons(query) {
    return db
      .execute('SELECT * FROM persons WHERE name LIKE ? ORDER BY name ASC', [
        `%${query}%`,
      ])
      .rows;
  },

  // Logs
  getLogs(limit = 50) {
    return db
      .execute(
        'SELECT * FROM recognition_logs ORDER BY createdAt DESC LIMIT ?',
        [limit],
      )
      .rows;
  },

  saveLog(personId, personName, confidence, recognized) {
    db.execute(
      'INSERT INTO recognition_logs (personId, personName, confidence, recognized) VALUES (?, ?, ?, ?)',
      [personId, personName, confidence, recognized ? 1 : 0],
    );
  },
};

export default DatabaseService;
