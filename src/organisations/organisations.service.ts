/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrgDto } from './dtos';

type Obj = {
  userId: string;
};

@Injectable()
export class OrganisationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(obj: Obj) {
    const { userId } = obj;
    const orgs = await this.prismaService.userOrganisation.findMany({
      where: {
        userId,
      },
      select: {
        orgId: false,
        founder: false,
        organisation: {
          select: {
            orgId: true,
            name: true,
            description: true,
          },
        },
      },
    });
    const transformedOrgs = orgs.map((org) => ({
      orgId: org.organisation.orgId,
      name: org.organisation.name,
      description: org.organisation.description || '',
    }));
    return {
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: transformedOrgs,
      },
    };
  }

  async getById(orgId: string, obj: Obj) {
    const { userId } = obj;
    const member = await this.prismaService.userOrganisation.findFirst({
      where: {
        orgId,
        userId,
      },
    });
    if (!member)
      throw new UnauthorizedException({
        status: 'Unauthorized',
        message: 'Unauthorized to perform this action',
        statusCode: 401,
      });
    const org = await this.prismaService.organisation.findFirst({
      where: { orgId },
    });
    return {
      status: 'success',
      message: null,
      data: org,
    };
  }

  async create(orgDto: CreateOrgDto, obj: Obj) {
    const { userId } = obj;
    const org = await this.prismaService.organisation.create({
      data: {
        name: orgDto.name,
        description: orgDto.description,
      },
    });
    const founder = await this.prismaService.userOrganisation.create({
      data: {
        orgId: org.orgId,
        userId: userId,
        founder: true,
      },
    });
    return {
      status: 'success',
      message: 'Organisation created successfully',
      data: org,
    };
  }

  async addMember(orgId: string, userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!user)
      throw new NotFoundException({
        status: 'not found',
        message: 'No user found',
        statusCode: 404,
      });
    const org = await this.prismaService.organisation.findFirst({
      where: {
        orgId,
      },
    });
    if (!org)
      throw new NotFoundException({
        status: 'not found',
        message: 'No organisation found',
        statusCode: 404,
      });
    const memberExists = await this.prismaService.userOrganisation.findFirst({
      where: {
        userId: user.userId,
        orgId: org.orgId,
      },
    });
    if (memberExists)
      throw new BadRequestException({
        status: 'bad request',
        message: 'User is already a member',
        statusCode: 404,
      });
    const member = await this.prismaService.userOrganisation.create({
      data: {
        orgId: org.orgId,
        userId: user.userId,
      },
    });
    return {
      status: 'success',
      message: 'User added to organisation successfully',
    };
  }
}
