import Dexie from 'dexie';

const formindexdb = new Dexie('form');
formindexdb.version(1).stores({
    form: 'id, path, schema'
});

export default formindexdb;
