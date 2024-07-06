import { Module } from '@nestjs/common';
import { OrganisationsService } from './organisations.service';
import { OrganisationsController } from './organisations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [OrganisationsService, PrismaService],
  controllers: [OrganisationsController],
})
export class OrganisationsModule {}
