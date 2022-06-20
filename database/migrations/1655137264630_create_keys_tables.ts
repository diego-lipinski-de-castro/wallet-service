import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'keys'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table
        .integer('wallet_id')
        .unsigned()
        .references('wallets.id')
        .onDelete('CASCADE')

      table.string('reference').unique();
      table.string('key');
      table.text('base64')
      table.text('payload')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
