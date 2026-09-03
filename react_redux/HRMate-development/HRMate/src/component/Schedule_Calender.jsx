import { useState } from 'react';
import Calendar from 'react-calendar';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import { Schedule } from '../data/Schedule_data';

const Schedule_Calender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 1, 10));

  return (
    <Container className="bg-white p-4 rounded-4 shadow-sm mx-auto schedule-panel" style={{ maxWidth: '400px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 ">Schedule</h5>
        <Button variant="link" className="text-secondary text-decoration-none p-0 small">See All</Button>
      </div>

      <div className="custom-calendar-container mb-4">
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate}
          locale='en-US'
          prev2Label={null}
          next2Label={null}
          formatShortWeekday={(locale, date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
        />
      </div>

      <hr className="opacity-25" />

      <h6 className="mb-4">
        {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
      </h6>
      
      {Schedule.map((item, index) => (
        <Row key={index} className="schedule-row g-0 align-items-start mb-4 p-1">
          <Col xs={4} className="time-column text-muted small">
            {item.time}
          </Col>
          <Col xs={8} className="content-column ps-3 border-start border-light border-2">
            <div className="event-title mb-1" >
              {item.title}
            </div>
            <Badge className={`exact-badge badge badge-${item.type}`} bg='none'>
              {item.dept}
            </Badge>
          </Col>
        </Row>
      ))}
    </Container> 
  );
};

export default Schedule_Calender;