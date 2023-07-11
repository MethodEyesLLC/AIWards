import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment Object
const localizer = momentLocalizer(moment);

const agencyData = {
  events: [
    { title: 'Award Show 1', start: new Date(2023, 7, 1), end: new Date(2023, 7, 5) },
    { title: 'Award Show 2', start: new Date(2023, 8, 1), end: new Date(2023, 8, 5) },
  ]
};

const CalendarPage = () => {
  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={agencyData.events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '80vh', width: '80%' }}
      />
    </div>
  );
};

export default CalendarPage;
