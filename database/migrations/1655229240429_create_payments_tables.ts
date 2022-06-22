import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable()

      table
        .integer('customer_id')
        .unsigned()
        .references('customers.id')
        .onDelete('CASCADE')

      table.string('reference').unique().notNullable()
      table.integer('value')

      table.enum('status', [
        'PENDING',
        'CONFIRMED',
        'RECEIVED',
        'RECEIVED_IN_CASH',
        'OVERDUE',
        'REFUND_REQUESTED',
        'REFUNDED',
        'CHARGEBACK_REQUESTED',
        'CHARGEBACK_DISPUTE',
        'AWAITING_CHARGEBACK_REVERSAL',
        'DUNNING_REQUESTED',
        'DUNNING_RECEIVED',
        'AWAITING_RISK_ANALYSIS'
      ])
      
      table.text('description').nullable()

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
