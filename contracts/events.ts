import { DateTime } from 'luxon'

/**
 * Contract source: https://git.io/JfefG
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:Adonis/Core/Event' {
  /*
  |--------------------------------------------------------------------------
  | Define typed events
  |--------------------------------------------------------------------------
  |
  | You can define types for events inside the following interface and
  | AdonisJS will make sure that all listeners and emit calls adheres
  | to the defined types.
  |
  | For example:
  |
  | interface EventsList {
  |   'new:user': UserModel
  | }
  |
  | Now calling `Event.emit('new:user')` will statically ensure that passed value is
  | an instance of the the UserModel only.
  |
  */
  interface EventsList {
    'proxies:request': {
      type?: string,
      method?: string,
      url?: string,
      body?: any,
      headers?: any,
      status?: number|null,
      created_at: DateTime,
    },
    'proxies:response': {
      type?: string,
      method?: string,
      url?: string,
      body?: any,
      headers?: any,
      status?: number|null,
      created_at: DateTime,
    },
    'proxies:request:error': {
      tag: string,
      info: any,
      created_at: DateTime,
    },
    'proxies:response:error': {
      tag: string,
      info: any,
      created_at: DateTime,
    },
  }
}
