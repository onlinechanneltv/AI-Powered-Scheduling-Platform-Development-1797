import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { calendarService } from '../services/calendarService';

const CalendarContext = createContext({});

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [availabilitySettings, setAvailabilitySettings] = useState({
    workingHours: {
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
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadEvents();
      loadAvailabilitySettings();
      loadEventTypes();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const events = await calendarService.getEvents(user.id);
      setEvents(events);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailabilitySettings = async () => {
    try {
      const settings = await calendarService.getAvailabilitySettings(user.id);
      if (settings) {
        setAvailabilitySettings(settings);
      }
    } catch (error) {
      console.error('Failed to load availability settings:', error);
    }
  };

  const loadEventTypes = async () => {
    try {
      const types = await calendarService.getEventTypes(user.id);
      setEventTypes(types);
    } catch (error) {
      console.error('Failed to load event types:', error);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = await calendarService.createEvent(user.id, eventData);
      setEvents(prev => [...prev, newEvent]);
      return { success: true, event: newEvent };
    } catch (error) {
      return { success: false, error };
    }
  };

  const updateEvent = async (eventId, updates) => {
    try {
      const updatedEvent = await calendarService.updateEvent(eventId, updates);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      return { success: true, event: updatedEvent };
    } catch (error) {
      return { success: false, error };
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await calendarService.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const updateAvailabilitySettings = async (newSettings) => {
    try {
      await calendarService.updateAvailabilitySettings(user.id, newSettings);
      setAvailabilitySettings(newSettings);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const createEventType = async (eventTypeData) => {
    try {
      const newEventType = await calendarService.createEventType(user.id, eventTypeData);
      setEventTypes(prev => [...prev, newEventType]);
      return { success: true, eventType: newEventType };
    } catch (error) {
      return { success: false, error };
    }
  };

  const getAvailableSlots = async (date, eventTypeId) => {
    try {
      return await calendarService.getAvailableSlots(user.id, date, eventTypeId);
    } catch (error) {
      console.error('Failed to get available slots:', error);
      return [];
    }
  };

  const value = {
    events,
    availabilitySettings,
    eventTypes,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    updateAvailabilitySettings,
    createEventType,
    getAvailableSlots,
    loadEvents
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};