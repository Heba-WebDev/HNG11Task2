/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { orgMock, prismaMock, userDtoMock, userMock } from '../../test/index';
import { validate } from 'class-validator';
import { UnprocessableEntityException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { JwtAdapter } from '../config/jwt';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user registration', () => {
    beforeEach(async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123456',
        phone: '',
      };
      const errors = await validate(user);
      expect(errors).toHaveLength(0);
    });

    it('It Should Fail If Required Fields Are Missing', async () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '',
        phone: '',
      };
      const ofImportDto = plainToInstance(RegisterUserDto, user);
      const errors = await validate(ofImportDto);
      expect(errors).toHaveLength(1);
    });

    it('It Should Register User Successfully with Default Organisation', async () => {
      prismaMock.user.create.mockResolvedValue(userMock);
      prismaMock.organisation.create.mockResolvedValue(orgMock);
      const user = await service.register(userDtoMock);
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
      expect(user.message).toEqual('Registration successful');
      expect(user.data.accessToken).toBeDefined();
    });

    it('It Should Fail if there’s Duplicate Email or UserID:', async () => {
      prismaMock.user.findFirst.mockResolvedValue(userMock);
      await expect(service.register(userMock)).rejects.toThrow(
        new UnprocessableEntityException({
          status: 'Bad request',
          message: 'Registration unsuccessful',
          statusCode: 400,
        }),
      );
    });
  });

  describe('user login', () => {
    beforeEach(async () => {
      const user = {
        email: 'john@example.com',
        password: '123456',
      };
      const errors = await validate(user);
      expect(errors).toHaveLength(0);
    });

    it('It Should Fail If Required Fields Are Missing', async () => {
      const user = {
        email: 'john',
        password: '123456',
      };
      const ofImportDto = plainToInstance(LoginUserDto, user);
      const errors = await validate(ofImportDto);
      expect(errors).toHaveLength(1);
    });

    it('It Should Log the user in successfully', async () => {
      const loginDto = {
        email: userDtoMock.email,
        password: userDtoMock.password,
      };
      prismaMock.user.findFirst.mockResolvedValue(userMock);
      const user = await service.login(loginDto);
      expect(user.message).toEqual('Login successful');
      expect(user.data.accessToken).toBeDefined();
    });
  });

  describe('Token generation', () => {
    it('It should ensure token expires at the correct time and correct user details is found in token', async () => {
      const payload = { userId: '123' };
      const duration = '1h';
      const token = await JwtAdapter.generateToken(payload, duration);
      const decodedToken: any = await JwtAdapter.validateToken(token);

      expect(typeof decodedToken.iat).toBe('number');
      expect(typeof decodedToken.exp).toBe('number');
      expect(decodedToken.exp * 1000).toBeGreaterThan(Date.now());
    });
  });
});
