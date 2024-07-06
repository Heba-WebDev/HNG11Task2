export const prismaMock = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  organisation: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
  userOrganisation: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
};
