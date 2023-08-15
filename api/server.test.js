const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')

test('sanity', () => {
  expect(true).toBe(false)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  it('[1] responds with the correct username, and id', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: "greg", password: "gregory"})
    expect(res.body.id).toBe(1)
    expect(res.body.username).toMatch("greg")
  }, 750)
  it('[2] responds with correct message if username is omitted', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: "", password: "gregory"})
    expect(res.body.message).toMatch("username and password required")
  }, 750)
})
describe('[POST] /api/auth/login', () => {
  it('[1]', () => {

  }, 750)
  it('[2]', () => {

  }, 750)
})
describe('[GET] /api/jokes', () => {
  it('[1]', () => {

  }, 750)
  it('[2]', () => {

  }, 750)
})
