'use server';

import { EventService } from './services';
import { EventType } from '@/app/lib/definitions';

export const createEvent = async (event: Omit<EventType, 'id'>) => {
  const newEvent = await EventService.createEvent(event);
  return newEvent;
};
export const updateEvent = async (
  eventId: number,
  event: Omit<EventType, 'id'>,
) => {
  const newEvent = await EventService.updateEvent(eventId, event);
  return newEvent;
};
export const deleteEvent = async (eventId: number) => {
  const newEvent = await EventService.deleteEvent(eventId);
  return newEvent;
};
