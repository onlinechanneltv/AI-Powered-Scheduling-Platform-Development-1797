import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/ui/Button';
import { calendarService } from '../services/calendarService';

const { FiCalendar, FiClock, FiUser, FiMail, FiMessageSquare } = FiIcons;

const BookingPage = () => {
  const { username } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select time, 2: Enter details, 3: Confirmation

  useEffect(() => {
    loadAvailableSlots();
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      // Mock user ID - in real app, get from username
      const slots = await calendarService.getAvailableSlots('user-id', selectedDate, 'event-type-id');
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot);
    setStep(2);
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      
      const eventData = {
        title: `Meeting with ${bookingData.name}`,
        start_time: selectedTime.start,
        end_time: selectedTime.end,
        attendee_email: bookingData.email,
        attendee_name: bookingData.name,
        notes: bookingData.message
      };

      // Mock booking creation
      console.log('Creating booking:', eventData);
      
      setStep(3);
    } catch (error) {
      console.error('Failed to create booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Your meeting has been scheduled successfully. You'll receive a confirmation email shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Meeting Details</h3>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Date:</strong> {format(new Date(selectedTime?.start), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Time:</strong> {format(new Date(selectedTime?.start), 'h:mm a')} - {format(new Date(selectedTime?.end), 'h:mm a')}
            </p>
            <p className="text-sm text-gray-600">
              <strong>With:</strong> {username}
            </p>
          </div>
          
          <Button className="w-full">
            Add to Calendar
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Booking Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
                <p className="text-gray-600">30 Minute Meeting</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">30 minutes</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Video call via Zoom</span>
              </div>
            </div>

            {selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-primary-50 rounded-lg"
              >
                <h3 className="font-semibold text-primary-900 mb-2">Selected Time</h3>
                <p className="text-primary-700">
                  {format(new Date(selectedTime.start), 'MMMM d, yyyy')} at {format(new Date(selectedTime.start), 'h:mm a')}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {step === 1 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Date & Time</h2>
                
                {/* Date Selection */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {getWeekDays().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-3 text-center rounded-lg transition-colors ${
                        format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-xs font-medium">{format(day, 'EEE')}</div>
                      <div className="text-lg font-bold">{format(day, 'd')}</div>
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 mb-3">Available Times</h3>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => handleTimeSelect(slot)}
                          className="p-3 text-center border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                          {format(new Date(slot.start), 'h:mm a')}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No available times for this date
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Your Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiMessageSquare} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        value={bookingData.message}
                        onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Tell us what you'd like to discuss"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleBooking}
                    loading={loading}
                    disabled={!bookingData.name || !bookingData.email}
                    className="flex-1"
                  >
                    Confirm Booking
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;