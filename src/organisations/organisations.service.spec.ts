import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationsService } from './organisations.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../test';

describe('OrganisationsService', () => {
  let service: OrganisationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganisationsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrganisationsService>(OrganisationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('organisations', () => {
    it('It should ensures users can’t see data from organisations they don’t have access to', async () => {
      const userId = '08cdced2';
      const mockOrgs = [
        { orgId: 'org1', name: 'Org 1', description: 'Description' },
      ];
      prismaMock.userOrganisation.findMany.mockResolvedValue(mockOrgs);
      const result = await service.getAll({ userId });
      expect(result.status).toBe('success');
      expect(result.data).toEqual(mockOrgs);
    });
  });
});
