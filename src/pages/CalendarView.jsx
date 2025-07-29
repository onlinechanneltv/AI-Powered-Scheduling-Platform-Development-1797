import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCalendar } from '../contexts/CalendarContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { FiPlus, FiFilter, FiDownload } = FiIcons;

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { events, loading } = useCalendar();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    resource: event
  }));

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: '#3b82f6',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectSlot = ({ start, end }) => {
    console.log('Selected slot:', { start, end });
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your schedule and appointments</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={FiFilter} className="w-5 h-5" />
            <span>Filter</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="w-5 h-5" />
            <span>Export</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
            <span>New Event</span>
          </motion.button>
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day', 'agenda']}
        />
      </motion.div>
    </div>
  );
};

export default CalendarView;