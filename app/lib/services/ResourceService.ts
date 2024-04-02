// Remove the import statement for Resource and Resource
import { Resource } from '@/app/lib/models';
import type { Resource as PrismaResource } from '@prisma/client';

export const ResourceService = {
  async createResource(resourceData: Omit<PrismaResource, 'resourceId'>) {
    const newResource = await Resource.createResource(resourceData);
    return newResource;
  },

  async updateResource(
    resourceId: number,
    updatedResourceData: Partial<PrismaResource>,
  ) {
    const updatedResource = await Resource.updateResource(
      resourceId,
      updatedResourceData,
    );
    return updatedResource;
  },

  async deleteResource(resourceId: number) {
    const deletedResource = await Resource.deleteResource(resourceId);
    return deletedResource;
  },

  async getResourceById(resourceId: number) {
    const updatedResource = await Resource.getResourceById(resourceId);
    return updatedResource;
  },

  async getAllResources(
    paramQuery: any = {},
    columnsToFetch: {},
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    return await Resource.getAllResources(
      paramQuery,
      columnsToFetch,
      pageSize,
      currentPage,
    );
  },
};
