import { Card } from "react-bootstrap";
import { tasks } from "../data/Task";
import { ThreeDots } from "react-bootstrap-icons";

function Circle({ value }) {
  return (
    <div className="task-circle">
      <div
        className="task-circle-progress"
        style={{ "--value": value }}
      />
      <span>{value}%</span>
    </div>
  );
}

export default function TasksCard() {

  return (
    <Card className="dash-card border-0 shadow-sm rounded-4 h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center  mb-4">
        <h5 className="mt-2 fw-500">Tasks</h5>
        <span className="text-muted" ><ThreeDots/></span>
      </div>

        {tasks.map((t, i) => (
          <div key={i} className="task-item p-3">
            <div>
              <div className="task-title">{t.title}</div>
              <div className="task-sub">
                {t.dept} • {t.date}
              </div>
            </div>
            <Circle value={t.progress} />
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}