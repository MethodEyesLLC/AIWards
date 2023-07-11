import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import '../css/AwardGenerator.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const agencyData = {
  name: "Awesome Agency",
  campaigns: [
    { title: "Campaign 1", status: "Ongoing" },
    { title: "Campaign 2", status: "Completed" },
  ],
  awards: [
    { title: "Award 1", event: "Event 1", year: "2023" },
    { title: "Award 2", event: "Event 2", year: "2023" },
  ],
  events: [
    { title: 'Award Show 1', start: new Date(2023, 7, 1), end: new Date(2023, 7, 5) },
    { title: 'Award Show 2', start: new Date(2023, 8, 1), end: new Date(2023, 8, 5) },
  ]
};

const HomePage = () => {
  return (
    <div className="app-content">
      <h1 className="title-font">Hello, {agencyData.name}!</h1>
      <h2 className="subtitle-font">Your Campaigns:</h2>
      <ul>
        {agencyData.campaigns.map((campaign, index) => (
          <li key={index}>
            <h3 className="text-font">{campaign.title}</h3>
            <p className="text-font">Status: {campaign.status}</p>
          </li>
        ))}
      </ul>

      <h2 className="subtitle-font">Your Recent Awards:</h2>
      <ul>
        {agencyData.awards.map((award, index) => (
          <li key={index}>
            <h3 className="text-font">{award.title}</h3>
            <p className="text-font">{award.event} - {award.year}</p>
          </li>
        ))}
      </ul>

      <h2 className="subtitle-font">Upcoming Shows:</h2>
      {/* <Calendar
        localizer={localizer}
        events={agencyData.events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      /> */}
    </div>
  );
};

export default HomePage;
