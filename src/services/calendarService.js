import { supabase } from '../lib/supabase';
import { format, addMinutes, isWithinInterval, parseISO } from 'date-fns';

class CalendarService {
  async getEvents(userId, startDate, endDate) {
    try {
      // Mock events for demo
      const mockEvents = [
        {
          id: 'event-1',
          title: 'Team Meeting',
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
          user_id: userId
        },
        {
          id: 'event-2',
          title: 'Client Call',
          start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
          user_id: userId
        },
        {
          id: 'event-3',
          title: 'Product Demo',
          start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
          user_id: userId
        }
      ];

      return mockEvents;
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  }

  async createEvent(userId, eventData) {
    try {
      const newEvent = {
        id: `event-${Date.now()}`,
        user_id: userId,
        ...eventData,
        created_at: new Date().toISOString()
      };

      console.log('Creating event:', newEvent);
      return newEvent;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  async updateEvent(eventId, updates) {
    try {
      const updatedEvent = {
        id: eventId,
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('Updating event:', updatedEvent);
      return updatedEvent;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      console.log('Deleting event:', eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  async getAvailabilitySettings(userId) {
    return {
      working_hours: {
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '09:00', end: '17:00', enabled: false },
        sunday: { start: '09:00', end: '17:00', enabled: false }
      },
      timezone: 'UTC',
      bufferTime: 15,
      maxEventsPerDay: 10
    };
  }

  async updateAvailabilitySettings(userId, settings) {
    try {
      console.log('Updating availability settings:', settings);
    } catch (error) {
      console.error('Failed to update availability settings:', error);
      throw error;
    }
  }

  async getEventTypes(userId) {
    return [
      {
        id: 'type-1',
        name: '30 Minute Meeting',
        duration: 30,
        user_id: userId
      },
      {
        id: 'type-2',
        name: '1 Hour Consultation',
        duration: 60,
        user_id: userId
      }
    ];
  }

  async createEventType(userId, eventTypeData) {
    try {
      const newEventType = {
        id: `type-${Date.now()}`,
        user_id: userId,
        ...eventTypeData,
        created_at: new Date().toISOString()
      };

      console.log('Creating event type:', newEventType);
      return newEventType;
    } catch (error) {
      console.error('Failed to create event type:', error);
      throw error;
    }
  }

  async getAvailableSlots(userId, date, eventTypeId, duration = 30) {
    try {
      // Mock available slots
      const slots = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
          const slotDate = new Date(date);
          slotDate.setHours(hour, minute, 0, 0);
          
          const endDate = new Date(slotDate);
          endDate.setMinutes(endDate.getMinutes() + duration);
          
          slots.push({
            start: slotDate.toISOString(),
            end: endDate.toISOString(),
            available: true
          });
        }
      }

      return slots.slice(0, 20); // Return first 20 slots for demo
    } catch (error) {
      console.error('Failed to get available slots:', error);
      return [];
    }
  }

  async handleEventCreation(event) {
    try {
      const meetingLink = await this.createMeetingLink(event);
      console.log('Event created with meeting link:', meetingLink);
    } catch (error) {
      console.error('Failed to handle event creation:', error);
    }
  }

  async createMeetingLink(event) {
    return `https://meet.example.com/room/${event.id}`;
  }

  async sendEventNotifications(event) {
    console.log('Sending notifications for event:', event.title);
  }

  async syncWithExternalCalendar(userId, calendarProvider, credentials) {
    console.log(`Syncing with ${calendarProvider} for user ${userId}`);
  }
}

export const calendarService = new CalendarService();