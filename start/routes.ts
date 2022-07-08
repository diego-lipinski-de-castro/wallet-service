/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})

Route.post('webhooks', 'WebhooksController.index')

Route.post('wallets', 'WalletsController.store')
Route.get('wallets/:id', 'WalletsController.show')
Route.get('wallets/:id/balance', 'WalletsController.balance')
Route.get('wallets/:id/qrcode', 'WalletsController.qrcode')
Route.get('wallets/:id/transactions', 'WalletsController.transactions')
Route.post('wallets/transfer', 'WalletsController.transfer')

Route.post('customers', 'CustomersController.store')
Route.get('customers/:id', 'CustomersController.show')
Route.post('customers/:id/cards', 'CardsController.store')
Route.get('customers/:id/cards', 'CardsController.show')

Route.post('payments', 'PaymentsController.store')
Route.get('payments/:id/qrcode', 'PaymentsController.qrcode')
