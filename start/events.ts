import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'

/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

Event.onError((event, error, eventData) => {
  console.log(event)
  console.log(eventData)
  console.log(error)
})

Event.on('db:query', (query) => {
  if (Application.inProduction) {
    Logger.debug(query.sql)
  } else {
    Database.prettyPrint(query)
  }
})

Event.on('proxies:request', async (data) => {
  await Database.insertQuery().table('proxies').insert(data)
})

Event.on('proxies:response', async (data) => {
  await Database.insertQuery().table('proxies').insert(data)
})

Event.on('proxies:request:error', async (data) => {
  await Database.insertQuery().table('errors').insert(data)
})

Event.on('proxies:response:error', async (data) => {
  await Database.insertQuery().table('errors').insert(data)
})

Event.on('controllers:error', async (data) => {
  await Database.insertQuery().table('errors').insert(data)
})
