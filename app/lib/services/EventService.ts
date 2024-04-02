// Remove the import statement for Event and Resource
import { Event } from '@/app/lib/models';
import type { Event as PrismaEvent } from '@prisma/client';

export const EventService = {
  async createEvent(eventData: Omit<PrismaEvent, 'id'>) {
    const newEvent = await Event.createEvent(eventData);
    return newEvent;
  },

  async updateEvent(eventId: number, updatedEventData: Partial<PrismaEvent>) {
    const updatedEvent = await Event.updateEvent(eventId, updatedEventData);
    return updatedEvent;
  },

  async deleteEvent(eventId: number) {
    const deletedEvent = await Event.deleteEvent(eventId);
    return deletedEvent;
  },

  async getEventById(eventId: number) {
    const updatedEvent = await Event.getEventById(eventId);
    return updatedEvent;
  },

  async getAllEvents(
    paramQuery: any = {},
    columnsToFetch: {},
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    return await Event.getAllEvents(
      paramQuery,
      columnsToFetch,
      pageSize,
      currentPage,
    );
  },
};
