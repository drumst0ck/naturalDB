// localStorageDBManager.js

const STORAGE_KEY = 'user_databases';

export const localStorageDBManager = {
    saveToDB: (db) => {
        const existingDBs = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        const updatedDBs = [...existingDBs, { ...db, id: Date.now().toString() }];
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDBs));
        return updatedDBs;
    },

    getAllDBs: () => {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    },

    getDBById: (id) => {
        const allDBs = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        return allDBs.find(db => db.id === id);
    },

    deleteDB: (id) => {
        const existingDBs = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        const updatedDBs = existingDBs.filter(db => db.id !== id);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDBs));
        return updatedDBs;
    }
};