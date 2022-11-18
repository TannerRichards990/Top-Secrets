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

const registerAndLogin = async (useProps = {}) => {
  const password = useProps.password ?? mockUser.password;

  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...useProps });

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

  afterAll(() => {
    pool.end();
  });
});
