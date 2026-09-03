import { Card } from 'react-bootstrap';

const activities = [
  { user: "Angela Brown", action: "uploaded revised remote work policy", time: "02:15 PM" },
  { user: "HR Team", action: "completed new employee onboarding", time: "09:30 AM" },
  { user: "Andrew Lee", action: "scheduled performance review", time: "11:00 AM" },
  { user: "Finance Department", action: "processed monthly payroll", time: "08:00 AM" },
  { user: "Jessica Morales", action: "approved Bob White's leave request", time: "03:30 PM" },
];

const RecentActivity = () => {
  return (
    <Card className="activity-card border-0 shadow-sm p-3 rounded-4 mt-3 ms-3">
      <div className="d-flex justify-content-between align-items-center ">
        <span className="card-title">Recent Activity</span>
        <span className="text-muted small" style={{ cursor: 'pointer' }}>•••</span>
      </div>

      <div className="timeline-container">
        <div className="section-header small text-muted mb-2">Today</div>
        
        {activities.map((item, index) => (
          <div className="timeline-item m-1" key={index}>
            <div className="timeline-dot-wrapper">
              <div className="timeline-dot"></div>
              {index !== activities.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div className="activity-text">
                <span className="user-name">{item.user} </span>
                <span className="action-text text-muted">{item.action}</span>
              </div>
              <div className="activity-time text-muted small">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;