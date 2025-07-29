import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';

class AnalyticsService {
  async generateAnalytics(events, timeRange) {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = subDays(new Date(), days);
    
    // Filter events within time range
    const filteredEvents = events.filter(event => 
      new Date(event.start_time) >= startDate
    );

    const previousPeriodEvents = events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate >= subDays(startDate, days) && eventDate < startDate;
    });

    return {
      totalMeetings: filteredEvents.length,
      meetingsChange: this.calculateChange(filteredEvents.length, previousPeriodEvents.length),
      totalHours: this.calculateTotalHours(filteredEvents),
      hoursChange: this.calculateChange(
        this.calculateTotalHours(filteredEvents),
        this.calculateTotalHours(previousPeriodEvents)
      ),
      avgDuration: this.calculateAverageDuration(filteredEvents),
      durationChange: this.calculateChange(
        this.calculateAverageDuration(filteredEvents),
        this.calculateAverageDuration(previousPeriodEvents)
      ),
      productivityScore: this.calculateProductivityScore(filteredEvents),
      productivityChange: '+5%',
      productivityFactors: this.getProductivityFactors(filteredEvents),
      weeklyTrends: this.generateWeeklyTrends(filteredEvents, days),
      dayDistribution: this.getDayDistribution(filteredEvents),
      timeDistribution: this.getTimeDistribution(filteredEvents),
      meetingTypes: this.getMeetingTypes(filteredEvents),
      aiInsights: this.generateAIInsights(filteredEvents),
      detailedStats: this.getDetailedStats(filteredEvents)
    };
  }

  calculateTotalHours(events) {
    return Math.round(
      events.reduce((total, event) => {
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);
        return total + (end - start) / (1000 * 60 * 60);
      }, 0) * 10
    ) / 10;
  }

  calculateAverageDuration(events) {
    if (events.length === 0) return 0;
    const totalMinutes = events.reduce((total, event) => {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      return total + (end - start) / (1000 * 60);
    }, 0);
    return Math.round(totalMinutes / events.length);
  }

  calculateChange(current, previous) {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
  }

  calculateProductivityScore(events) {
    // Mock productivity calculation based on various factors
    let score = 70; // Base score
    
    // Adjust based on meeting frequency
    const avgMeetingsPerDay = events.length / 7;
    if (avgMeetingsPerDay > 6) score -= 10; // Too many meetings
    if (avgMeetingsPerDay < 2) score += 5; // Good balance
    
    // Adjust based on meeting duration
    const avgDuration = this.calculateAverageDuration(events);
    if (avgDuration > 60) score -= 5; // Long meetings
    if (avgDuration >= 30 && avgDuration <= 45) score += 10; // Optimal duration
    
    // Random variation for demo
    score += Math.floor(Math.random() * 20) - 10;
    
    return Math.max(0, Math.min(100, score));
  }

  getProductivityFactors(events) {
    return [
      { name: 'Meeting Frequency', value: 'Optimal', impact: 'positive' },
      { name: 'Avg Duration', value: '42min', impact: 'positive' },
      { name: 'Focus Time', value: '3.2h/day', impact: 'positive' },
      { name: 'Back-to-back', value: '23%', impact: 'negative' }
    ];
  }

  generateWeeklyTrends(events, days) {
    const trends = {
      meetings: [],
      duration: [],
      productivity: []
    };

    // Generate mock weekly trend data
    const weeks = Math.ceil(days / 7);
    for (let i = 0; i < weeks; i++) {
      const weekEvents = Math.floor(Math.random() * 15) + 5;
      const weekDuration = Math.floor(Math.random() * 20) + 10;
      const productivity = Math.floor(Math.random() * 30) + 70;

      trends.meetings.push({
        label: `Week ${i + 1}`,
        value: weekEvents,
        percentage: (weekEvents / 20) * 100
      });

      trends.duration.push({
        label: `Week ${i + 1}`,
        value: `${weekDuration}h`,
        percentage: (weekDuration / 30) * 100
      });

      trends.productivity.push({
        label: `Week ${i + 1}`,
        value: productivity,
        percentage: productivity
      });
    }

    return trends;
  }

  getDayDistribution(events) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const distribution = new Array(7).fill(0);

    events.forEach(event => {
      const day = getDay(new Date(event.start_time));
      distribution[day]++;
    });

    const maxCount = Math.max(...distribution);

    return dayNames.map((day, index) => ({
      label: day.substring(0, 3),
      value: distribution[index],
      percentage: maxCount > 0 ? (distribution[index] / maxCount) * 100 : 0
    }));
  }

  getTimeDistribution(events) {
    const timeSlots = {
      'Morning (6-12)': 0,
      'Afternoon (12-18)': 0,
      'Evening (18-22)': 0,
      'Night (22-6)': 0
    };

    events.forEach(event => {
      const hour = new Date(event.start_time).getHours();
      if (hour >= 6 && hour < 12) timeSlots['Morning (6-12)']++;
      else if (hour >= 12 && hour < 18) timeSlots['Afternoon (12-18)']++;
      else if (hour >= 18 && hour < 22) timeSlots['Evening (18-22)']++;
      else timeSlots['Night (22-6)']++;
    });

    const total = Object.values(timeSlots).reduce((sum, count) => sum + count, 0);
    const maxCount = Math.max(...Object.values(timeSlots));

    return Object.entries(timeSlots).map(([label, count]) => ({
      label,
      value: count,
      percentage: maxCount > 0 ? (count / maxCount) * 100 : 0
    }));
  }

  getMeetingTypes(events) {
    // Mock meeting type classification
    const types = [
      { name: 'Team Meetings', count: Math.floor(events.length * 0.4), percentage: 40 },
      { name: 'Client Calls', count: Math.floor(events.length * 0.3), percentage: 30 },
      { name: '1:1 Meetings', count: Math.floor(events.length * 0.2), percentage: 20 },
      { name: 'Other', count: Math.floor(events.length * 0.1), percentage: 10 }
    ];

    return types;
  }

  generateAIInsights(events) {
    return [
      {
        type: 'recommendation',
        title: 'Optimize Meeting Schedule',
        description: 'Consider clustering meetings on Tuesday and Thursday to create longer focus blocks.',
        impact: 'Save 2-3 hours of focus time per week'
      },
      {
        type: 'insight',
        title: 'Peak Productivity Time',
        description: 'Your most productive meetings occur between 10 AM - 12 PM on Tuesdays.',
        impact: 'Schedule important meetings during this time'
      },
      {
        type: 'recommendation',
        title: 'Meeting Duration',
        description: 'Your 30-minute meetings have 95% completion rate vs 70% for 1-hour meetings.',
        impact: 'Default to shorter meeting durations'
      },
      {
        type: 'insight',
        title: 'Back-to-Back Meetings',
        description: '23% of your meetings are back-to-back, which may impact preparation time.',
        impact: 'Add 5-10 minute buffers between meetings'
      }
    ];
  }

  getDetailedStats(events) {
    return [
      {
        icon: 'FiUsers',
        value: Math.floor(events.length * 2.3),
        label: 'Total Participants',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        trend: '+12%'
      },
      {
        icon: 'FiClock',
        value: `${Math.floor(Math.random() * 30) + 15}min`,
        label: 'Avg Prep Time',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        trend: '-5%'
      },
      {
        icon: 'FiTarget',
        value: '89%',
        label: 'On-time Rate',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        trend: '+3%'
      },
      {
        icon: 'FiTrendingUp',
        value: '4.2/5',
        label: 'Meeting Rating',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        trend: '+0.3'
      }
    ];
  }
}

export const analyticsService = new AnalyticsService();