import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
// import { basicAuth } from 'hono/basic-auth'

let result = Math.random();

addEventListener('scheduled', event => {
  event.waitUntil(
    handleSchedule(event.scheduledTime)
  )
})

async function handleSchedule(scheduledDate: ScheduledEvent['scheduledTime']) {
  console.log(scheduledDate)
  result = Math.random();
}

export const app = new Hono()
// Builtin middleware
app.use('*', poweredBy())
// Basic Auth
// app.use(
//   '/auth/*',
//   basicAuth({
//     username: 'hono',
//     password: 'acoolproject',
//   })
// )

// Custom middleware
app.use('*', async (c, next) => {
  await next()
  c.header('X-message', 'Hono is a cool project')
})

// Routing
app.get('/data', (c) => {
  return c.json({ data: `Hello world-${result}` })
})

declare const TODO: {get: (key: any)=> Promise<string>};

app.get('/kv', async (c) => {
  // NOTE: Relies on the `TODO` KV binding that maps to the "My Tasks" namespace.
  let value = await TODO.get('test');

  // Return the value, as is, for the Response
  return c.json({ data: value })
})
app.get('/', (c) => c.html('<h1>Hello Hono!</h1>'))
app.get('/auth/*', (c) => c.text('You are authorized'))

// Nested route
const book = app.route('/book')
// Named path parameters
book.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ 'Your book ID is': id })
})
book.post('/', (c) => c.text('Book is created', 201))

// addEventlistener...
app.fire()
