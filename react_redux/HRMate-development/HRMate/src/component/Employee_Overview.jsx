import { useState } from "react";
import { Table, Form, Card, InputGroup } from "react-bootstrap";
import { employees } from "../data/employees";
import { Search } from "react-bootstrap-icons";

const EmployeeOverview = () => {
  const [deptFilter, setDeptFilter] = useState("All Department");

  const filteredEmployees =
    deptFilter === "All Department"
      ? employees
      : employees.filter((emp) => emp.department === deptFilter);

  const departments = [
    "All Department",
    ...new Set(employees.map((e) => e.department)),
  ];

  return (
    <Card className="border-0 shadow-sm p-4 rounded-4 pb-5 pt-4 mt-3 ms-2 me-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <h5 className="m-0 fw-normal">Employees</h5>
          <span className="text-muted small">({filteredEmployees.length})</span>
        </div>
        <div className="d-flex gap-3">
          <Form>
            <InputGroup className="rounded-3 overflow-hidden border ">
              <InputGroup.Text className="bg-white">
                <Search className="text-secondary" />
              </InputGroup.Text>

              <Form.Control
                type="search"
                placeholder="Search employee, job, etc"
              />
            </InputGroup>
          </Form>
          <Form.Select
            className="filter-select text-secondary bg-dark"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
      <div className="table-scroll ">
        <Table responsive hover className="employee-table p-3 ">
          <thead>
            <tr className="text-muted ">
              <th className="fw-normal">Name</th>
              <th className="fw-normal">Email</th>
              <th className="fw-normal">Job Title</th>
              <th className="fw-normal">Level</th>
              <th className="fw-normal">Department</th>
              <th className="fw-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="align-middle ">
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-dot"></div>
                    {emp.fullName}
                  </div>
                </td>
                <td className=" small">{emp.email}</td>
                <td className=" small">{emp.role}</td>
                <td className=" small">
                    {emp.level}
                </td>
                <td className="small">{emp.department}</td>
                <td>
                  <span
                    className={`status-pill ${emp.attendance.toLowerCase()}`}
                  >
                    {emp.attendance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default EmployeeOverview;
