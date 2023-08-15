const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')

test('sanity', () => {
  expect(true).toBe(true)
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
  it('[3] responds with correct login message and a token', async () => {
    request(server).post('/api/auth/register').send({ username: "greg", password: "gregory"})
    const res = await request(server).post('/api/auth/login').send({ username: "greg", password: "gregory" })
    expect(res.body.message).toMatch("welcome, greg")
    expect(res.body.token).toBe
  }, 750)
  it('[4] responds with correct error message when missing username', async () => {
    request(server).post('/api/auth/register').send({ username: "greg", password: "gregory"})
    const res = await request(server).post('/api/auth/login').send({ username: "", password: "gregory" })
    expect(res.body.message).toMatch("username and password required")
  }, 750)
})
describe('[GET] /api/jokes', () => {
  it('[5] request without a token recieve the proper response', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toMatch("token required")
  }, 750)
  it('[6] request with a token are allowed through', async () => {
    request(server).post('/api/auth/register').send({ username: "greg", password: "gregory"})
    let res = await request(server).post('/api/auth/login').send({ username: "greg", password: "gregory" })
    res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
    expect(res.body[0]).toMatchObject({"id": "0189hNRf2g", "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."});
    expect(res.body[1]).toMatchObject({"id": "08EQZ8EQukb", "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."})
    expect(res.body[2]).toMatchObject({"id": "08xHQCdx5Ed", "joke": "Why didn’t the skeleton cross the road? Because he had no guts."})
  }, 750)
})
