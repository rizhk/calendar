import { prismaClient } from '@/app/lib/db';
import type { Event as PrismaEvent } from '@prisma/client';

export const Event = {
  async createEvent(eventData: Omit<PrismaEvent, 'id'>) {
    const newEvent = await prismaClient.event.create({
      data: eventData,
    });
    return newEvent;
  },

  async updateEvent(eventId: number, updatedEventData: Partial<PrismaEvent>) {
    const updatedEvent = await prismaClient.event.update({
      where: { id: eventId },
      data: updatedEventData,
    });
    return updatedEvent;
  },

  async deleteEvent(eventId: number) {
    const deletedEvent = await prismaClient.event.delete({
      where: { id: eventId },
    });
    return deletedEvent;
  },

  async getEventById(eventId: number) {
    const updatedEvent = await prismaClient.event.findUnique({
      where: { id: eventId },
    });
    return updatedEvent;
  },

  async getAllEvents(
    paramQuery: any = {},
    columnsToFetch: {},
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    let skipRecords = pageSize * (currentPage - 1);

    const totalRecords = await prismaClient.event.count();
    const rows = await prismaClient.event.findMany({
      select: columnsToFetch,
      where: { ...paramQuery },
      orderBy: { id: 'asc' }, // Sorting by the unique identifier
      take: pageSize,
      skip: skipRecords,
    });
    console.log(rows);
    return { rows: rows, totalRecords: totalRecords };
  },
};
