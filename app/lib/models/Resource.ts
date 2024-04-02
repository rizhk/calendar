import { prismaClient } from '@/app/lib/db';
import type { Resource as PrismaResource } from '@prisma/client';

export const Resource = {
  async createResource(resourceData: Omit<PrismaResource, 'resourceId'>) {
    const newResource = await prismaClient.resource.create({
      data: resourceData,
    });
    return newResource;
  },

  async updateResource(
    resourceId: number,
    updatedResourceData: Partial<PrismaResource>,
  ) {
    const updatedResource = await prismaClient.resource.update({
      where: { resourceId: resourceId },
      data: updatedResourceData,
    });
    return updatedResource;
  },

  async deleteResource(resourceId: number) {
    const deletedResource = await prismaClient.resource.delete({
      where: { resourceId: resourceId },
    });
    return deletedResource;
  },

  async getResourceById(resourceId: number) {
    const updatedResource = await prismaClient.resource.findUnique({
      where: { resourceId: resourceId },
    });
    return updatedResource;
  },

  async getAllResources(
    paramQuery: any = {},
    columnsToFetch: {},
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    let skipRecords = pageSize * (currentPage - 1);

    const totalRecords = await prismaClient.resource.count();
    const rows = await prismaClient.resource.findMany({
      select: columnsToFetch,
      where: { ...paramQuery },
      orderBy: { resourceId: 'asc' }, // Sorting by the unique identifier
      take: pageSize,
      skip: skipRecords,
    });
    return { rows: rows, totalRecords: totalRecords };
  },
};
