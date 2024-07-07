/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users E2E test', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('It should create a new user and a default organisation', () => {
    function generateUniqueEmail(baseEmail: string): string {
      const timestamp = Date.now();
      return `${baseEmail}_${timestamp}@example.com`;
    }
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Haboosh',
        lastName: 'Dev',
        email: generateUniqueEmail('test'),
        password: '123456',
      })
      .expect(201);
  });

  it('It should return 422 status if the payload is incorrect', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Haboosh',
        lastName: 'Dev',
        email: 'heba_dev2',
        password: '123456',
      })
      .expect(422);
  });

  it('It should return 422 status if the email already exits', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'Haboosh',
        lastName: 'Dev',
        email: 'heba_dev2@gmail.com',
        password: '123456',
      })
      .expect(422);
  });
});
