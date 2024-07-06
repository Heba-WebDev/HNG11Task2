import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { OrganisationsModule } from './organisations/organisations.module';

@Module({
  imports: [UsersModule, OrganisationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
