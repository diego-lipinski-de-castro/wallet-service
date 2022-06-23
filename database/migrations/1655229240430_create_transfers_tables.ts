import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transfers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable()

      table.string('reference').unique().notNullable()
      table.integer('value')

      table.enum('status', [
        'DONE',
        'PENDING',
        'CANCELLED',
      ])

      table
        .integer('from_id')
        .unsigned()
        .references('wallets.id')
        .onDelete('CASCADE')

      table
        .integer('to_id')
        .unsigned()
        .references('wallets.id')
        .onDelete('CASCADE')

      table.date('requested_at').nullable();
      table.date('effective_at').nullable();
      table.date('scheduled_at').nullable();

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
