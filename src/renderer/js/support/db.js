import Dexie from 'dexie';

// Create the database
const db = new Dexie('astro');

// Create the tables
db.version(1).stores({
  recent: '++id, title, &path, updated_at',
  bookmarks: '++id, title, path, updated_at',
  settings: '++id, &comic_id, brightness, contrast, flipped, updated_at',
});

// insertReplace method
db.Table.prototype.insertReplace = function(data) {
  Object.keys(data).forEach(key => {
    const indexes = this.schema.idxByName;
    const table = this.name;

    if (!indexes[key] || !indexes[key].unique) {
      return;
    }

    db.transaction('rw', db[table], async () => {
      const params = {};
      params[key] = data[key];

      const row = await db[table].get(params);

      if (row) {
        data.id = row.id;
      }

      await db[table].put(data);
    });
  });
};

export default db;
