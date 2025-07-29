class AIService {
  async generateEventSuggestions(userPreferences, pastEvents) {
    // Mock AI suggestions for demo
    return {
      suggestions: [
        'Schedule focus time blocks between 10 AM - 12 PM for better productivity',
        'Consider clustering similar meetings together',
        'Add 15-minute buffers between meetings'
      ],
      recommendations: [
        {
          type: 'time_block',
          title: 'Deep Work Session',
          start: '10:00',
          end: '12:00',
          reason: 'Based on your productivity patterns'
        }
      ]
    };
  }

  async optimizeSchedule(events, preferences) {
    console.log('Optimizing schedule for events:', events.length);
    return {
      optimizedEvents: events,
      suggestions: ['Consider moving meetings to cluster them together']
    };
  }

  async generateMeetingInsights(eventData) {
    return {
      insights: [
        'You have 15% more meetings this week than last week',
        'Average meeting duration is 45 minutes',
        'Most productive time appears to be Tuesday mornings'
      ],
      recommendations: [
        'Block time for deep work on Tuesday mornings',
        'Consider shorter default meeting durations',
        'Add buffer time between back-to-back meetings'
      ]
    };
  }

  async generateEventTitle(context) {
    return `Meeting about ${context}`;
  }

  async suggestMeetingAgenda(eventTitle, duration, participants) {
    return `
Agenda for ${eventTitle} (${duration} minutes):

1. Welcome & Introductions (5 min)
2. Main Discussion (${duration - 15} min)
3. Next Steps & Wrap-up (10 min)

Participants: ${participants.join(', ')}
    `.trim();
  }
}

export const aiService = new AIService();