import { Card } from "react-bootstrap";
import { employees } from "../data/employees";
import { ThreeDots } from "react-bootstrap-icons";
const EmploymentStatus = () => {
  const totalEmployees = employees.length;
  const categories = [
    { label: "Permanent", color: "#ff7a59", key: "Permanent" },
    { label: "Contract", color: "#fff1f0", key: "Contract" },
    { label: "Probation", color: "#bce4ff", key: "Probation" },
    { label: "Internship", color: "#e8f7ff", key: "Intern" },
  ];

  const stats = categories.map((cat) => {
    const count = employees.filter((e) => e.employmentType === cat.key).length;
    const percentage = Math.round((count / totalEmployees) * 100);
    return { ...cat, count, percentage };
  });

  let cumulativePercentage = 0;

  return (
    <Card className="employment-status-card border-0 rounded-4 shadow-sm p-3 ">
      <div className="d-flex justify-content-between align-items-center mb-5 mt-2">
        <h5 className="m-0 fw-500 ">Employment Status</h5>
        <span className="text-muted" style={{ cursor: "pointer" }}>
          <ThreeDots/>
        </span>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 42 42" className="donut-svg">
          {stats.map((stat, index) => {
            const strokeDasharray = `${stat.percentage} ${100 - stat.percentage}`;
            const strokeDashoffset = 100 - cumulativePercentage + 25;
            cumulativePercentage += stat.percentage;

            return (
              <circle
                key={stat.key}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={stat.color}
                strokeWidth="4"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>
        <div className="chart-center-text">
          <div className="total-number">{totalEmployees.toLocaleString()}</div>
          <div className="total-label">Total Employee</div>
        </div>
      </div>

      <hr className="my-4 opacity-25" />

      <div className="legend-list">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="d-flex align-items-center">
              <span
                className="legend-dot"
                style={{ backgroundColor: stat.color }}
              ></span>
              <span className="legend-label ms-2">{stat.label}</span>
              <span className="legend-percent text-muted ms-1">
                ({stat.percentage}%)
              </span>
            </div>
            <div className="legend-count">{stat.count}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmploymentStatus;
