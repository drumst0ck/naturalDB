const STORAGE_KEY = "user_databases";

export const localStorageDBManager = {
  saveToDB: (db) => {
    const existingDBs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updatedDBs = [...existingDBs, { ...db, id: Date.now().toString() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDBs));
    return updatedDBs;
  },

  getAllDBs: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  },

  getDBById: (id) => {
    const allDBs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return allDBs.find((db) => db.id === id);
  },

  deleteDB: (id) => {
    const existingDBs = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updatedDBs = existingDBs.filter((db) => db.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDBs));
    return updatedDBs;
  },
};
