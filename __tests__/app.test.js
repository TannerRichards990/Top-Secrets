const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'john',
  lastName: 'doe',
  email: 'johndoe@test.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};


describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'johndoe@test.com', password: '123456' });
    expect(res.status).toBe(200);
  });

  it('/protected should return a 401 if not authenticated', async () => {
    const response = await request(app).get('/api/v1/users/protected');
    expect(response.status).toBe(401);
  });

  it('users should return 403 if the user is not the admin', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.get('/api/v1/users/protected');
    expect(response.status).toBe(200);
  });

  it('users should return 401 if not signed in', async () => {
    const response = await request(app).delete('/api/v1/users');
    expect(response.status).toBe(401);
  });

  it('/users should sign out an existing users', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.delete('/api/v1/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Signed out successfully',
      success: true,
    });
  });

  it('secrets should return a 401 if user is not authenticated', async () => {
    const response = await request(app).get('/api/v1/secrets');
    expect(response.status).toBe(401);
  });

  it('/users should be able to post a new secret', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const agent = request.agent(app);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'jdobbs@jd.com', password: '123456' });
    const response = await agent.post('/api/v1/secrets').send({
      title: 'Whodis', description: 'I am a secret', });
    expect(response.status).toBe(200);
  });

  it('/secrets should return a list of secrets if user is authenticated', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.get('/api/v1/secrets');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(3);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      created_at: expect.any(String),
    });
  });

  afterAll(() => {
    pool.end();
  });
});
