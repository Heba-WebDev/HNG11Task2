/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { bcryptAdapter } from '../config';
import { JwtAdapter } from '../config/jwt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(userDto: RegisterUserDto) {
    const { firstName, lastName, email, password, phone } = userDto;
    const emailExists = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (emailExists)
      throw new UnprocessableEntityException({
        status: 'Bad request',
        message: 'Registration unsuccessful',
        statusCode: 422,
      });
    const hashedPassword = bcryptAdapter.hash(password);
    const user = await this.prismaService.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: await hashedPassword,
        phone,
      },
    });
    const org = await this.prismaService.organisation.create({
      data: {
        name: `${firstName}'s Organisation`,
      },
    });
    const member = await this.createFounder(user.userId, org.orgId);
    const token = await JwtAdapter.generateToken({ userId: user.userId });
    return {
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName,
          lastName,
          email,
          phone,
        },
      },
    };
  }

  async login(userDto: LoginUserDto) {
    const { email, password } = userDto;
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user)
      throw new UnauthorizedException({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    const passwordMatch = bcryptAdapter.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    const token = await JwtAdapter.generateToken({ userId: user.userId });
    return {
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    };
  }

  async get(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { userId: id },
    });
    return {
      status: 'success',
      message: null,
      data: user,
    };
  }

  async userExists(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { userId: id },
    });
    if (!user) throw new BadRequestException({});
    return user ? true : false;
  }

  async viewAuth(userId: string, id: string) {
    const user2 = await this.prismaService.userOrganisation.findMany({
      where: {
        userId: id,
      },
      select: {
        organisation: {
          select: { orgId: true },
        },
      },
    });
    const user1 = await this.prismaService.userOrganisation.findMany({
      where: {
        userId: userId,
      },
      select: {
        organisation: {
          select: { orgId: true },
        },
      },
    });
    const orgIds1 = user1.map((user) => user.organisation.orgId);
    const orgIds2 = user2.map((user) => user.organisation.orgId);
    const allOrgIds = [...orgIds1, ...orgIds2];
    const orgIdSet = new Set(allOrgIds);
    if (allOrgIds.length > orgIdSet.size) {
      return true;
    }
    return false;
  }

  async createOrg(firstName: string) {
    const org = await this.prismaService.organisation.create({
      data: {
        name: `${firstName}'s Organisation`,
      },
    });
    return org;
  }

  async createFounder(userId: string, orgId: string) {
    const member = await this.prismaService.userOrganisation.create({
      data: {
        userId: userId,
        orgId: orgId,
        founder: true,
      },
    });
  }
}
