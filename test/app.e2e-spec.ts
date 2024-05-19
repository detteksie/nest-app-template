import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';

import { AppModule } from '|/app.module';
import { LoginResponse } from '|/modules/auth/dto/login.dto';
import { setupApp } from '|/setup-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication({ rawBody: true, cors: true });
    setupApp(app);
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/hello (GET)', () => {
    return supertest(app.getHttpServer()).get('/hello').expect(200).expect('Hello World!');
  });

  it('/bye (GET)', async () => {
    const resp = await supertest(app.getHttpServer()).get('/bye');
    expect(resp.status).toBe(200);
    expect(resp.text).toBe('Bye World!');
  });

  it('/login (POST)', async () => {
    const resp = await supertest(app.getHttpServer())
      .post('/login')
      .send({ userSession: 'detteksie', password: 'asdf1234' });

    expect(resp.status).toBe(200);

    const body: LoginResponse = resp.body;
    expect(body).toHaveProperty('tokenType');
    expect(body.tokenType).toEqual('Bearer');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });
});
