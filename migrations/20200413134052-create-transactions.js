'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('transactions', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', notNull: true },
    cost: { type: 'int', notNull: true },
    date: { type: 'date', notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable('transactions');
};

exports._meta = {
  version: 1,
};
