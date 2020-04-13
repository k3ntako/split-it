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
  return db.createTable('transaction_people', {
    transaction_id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      foreignKey: {
        name: 'transaction_id_fk',
        table: 'transactions',
        rules: {
          onDelete: 'CASCADE',
        },
        mapping: 'id',
      },
    },
    user_id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      foreignKey: {
        name: 'user_id_fk',
        table: 'transactions',
        rules: {
          onDelete: 'CASCADE',
        },
        mapping: 'id',
      },
    },
    amount_owed: { type: 'decimal', notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable('transaction_people');
};

exports._meta = {
  version: 1,
};
