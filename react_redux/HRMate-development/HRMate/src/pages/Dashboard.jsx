import { Col, Container, Row } from "react-bootstrap";
import { dashboardData } from "../data/dashboard";
import { employees } from "../data/employees";
import KPIChart from "../component/KPIChart";
import Attendance_chart from "../component/Attendance_chart";
import Schedule_Calender from "../component/Schedule_Calender";
import TasksCard from "../component/Tasks";
import SatisfactionCard from "../component/Satisfaction_chart";
import { satisfactionData } from "../data/Satisfaction_data";
import EmploymentStatus from "../component/Employee_Status";
import RecentActivity from "../component/Recent_Activity";
import EmployeeOverview from "../component/Employee_Overview";
import Dashboard_Card from "../component/Dashboard_Card";
import { Schedule } from "../data/Schedule_data";

const Dashboard = () => {
  return (
    <Container fluid className="p-4">
      <Dashboard_Card />

      <Row className="g-4">
        <Col lg={9}>
          <Row className="g-4 mb-4">
            <Col lg={7}>
              <KPIChart data={dashboardData.kpi} />
            </Col>
            <Col lg={5}>
              <Attendance_chart data={dashboardData.attendance} />
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={4}>
              <TasksCard />
            </Col>
            <Col lg={4}>
              <SatisfactionCard data={satisfactionData} />
            </Col>
            <Col lg={4}>
              <EmploymentStatus data={employees} />
            </Col>
          </Row>
        </Col>
        <Col lg={3}>
          <Schedule_Calender data={Schedule} />
        </Col>
        <Row className="g-1">
          <Col md={9}>
            <EmployeeOverview />
          </Col>
          <Col md={3}>
            <RecentActivity />
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Dashboard;
