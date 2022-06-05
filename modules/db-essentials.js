const db = require('./db-init');

const createNewTable = (tableName) => {

    if (tableName === 'users') {
        db.schema.hasTable(tableName).then(function (exists) {
            if (!exists) {
                return db.schema.createTable(tableName, function (table) {
                    table.string('email', 100).notNullable().primary();
                    table.string('password', 100).notNullable();
                    table.string('company_name').notNullable();
                });
            }
        });
    } else if (tableName === 'machines') {
        db.schema.hasTable(tableName).then(function (exists) {
            if (!exists) {
                return db.schema.createTable(tableName, function (table) {
                    table.string('host', 100).notNullable().primary();
                    table.string('typeOfInstance', 100).notNullable();
                    table.string('region', 100).notNullable();
                    table.string('companyName').notNullable();
                    // table.integer('companyId').references('company_id').inTable('users').onDelete('CASCADE').index();
                });
            }
        });
    }
}

const isPrimaryKeyExist = async (tableName, primaryKey, value) => {

    try {
        const res = await (db(tableName).where(primaryKey, value));
        return res.length !== 0;

    } catch (err) {
        throw err;
    }
}

const addNewRecordToTable = async (tableName, valuesToInsert) => {

    db.schema.hasTable(tableName).then(function (exists) {
        if (exists) {
            return db(tableName).insert(valuesToInsert)
        }
    });
}

module.exports = {
    createNewTable,
    isPrimaryKeyExist,
    addNewRecordToTable,
}