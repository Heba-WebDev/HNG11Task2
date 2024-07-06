import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrgAuthGuard } from './guards/org-auth.guard';
import { OrganisationsService } from './organisations.service';
import { CreateOrgDto, AddMemberDto } from './dtos';

type Obj = {
  userId: string;
};

@Controller('')
export class OrganisationsController {
  constructor(private readonly orgsService: OrganisationsService) {}

  @UseGuards(OrgAuthGuard)
  @Post('/api/organisations')
  async create(@Body() orgDto: CreateOrgDto, @Body() userId: Obj) {
    return this.orgsService.create(orgDto, userId);
  }

  @Post('/api/organisations/:orgId/users')
  async addMember(@Param('orgId') orgId: string, @Body() dto: AddMemberDto) {
    return this.orgsService.addMember(orgId, dto.userId);
  }

  @UseGuards(OrgAuthGuard)
  @Get('/api/organisations')
  async getAll(@Body() userId: Obj) {
    return this.orgsService.getAll(userId);
  }

  @UseGuards(OrgAuthGuard)
  @Get('/api/organisations/:orgId')
  async getById(@Param('orgId') id: string, @Body() userId: Obj) {
    return this.orgsService.getById(id, userId);
  }
}
