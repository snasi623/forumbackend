import sqlite3 from 'sqlite3';
import md5 from 'md5';
import schema from './models/schema.js';

const DBSOURCE = "db.sqlite3"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }

    console.log('Connected to the SQLite database.')

    for (let s in schema) {
        db.run(schema[s], (err) => { if (err) { console.error(err) } });
    }
});

export default db;

