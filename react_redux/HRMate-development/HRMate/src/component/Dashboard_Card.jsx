import { useSelector } from 'react-redux';
import { employees } from '../data/employees';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { EmojiSmile, People, PersonDashFill, ThreeDots } from 'react-bootstrap-icons';

const Dashboard_Card = () => {
    const { user } = useSelector((state) => state.auth);
  const totalEmployees = employees.length;
  return (
    <Row className="mb-4 g-1 mx-0">
            <Col md={9} className="bg-success  rounded-4 ">
           <Row className="align-items-center p-4">
            <Col md={4}>
              <p className="text-muted small text-nowrap mb-4 ">
                Tuesday, February 10, 2026
              </p>
              <br />
              <h4 className="fw-semibold text-nowrap text-truncate pt-4 ">
                Hello, {user?.fullName?.split(" ")[0]}! 👋
              </h4>
              <p className="text-muted small text-nowrap ">
                Track and manage your team progress here
              </p>
            </Col>

            <Col md={8}>
              <Row className="justify-content-end ">
                <Col md={3} className="flex-grow-1">
                  <Card className="p-3  border-0 rounded-4 position-relative overflow-hidden">
                    <svg
                      className="position-absolute top-50 end-0 translate-middle-y"
                      width="145"
                      height="85"
                      viewBox="0 0 175 65"
                      fill="none"
                      style={{ pointerEvents: "none" }}
                    >
                      <path
                        d="
                        M104 18
                        A25 25 0 0 1 98 67
                        L98 18
                        Z
                      "
                        fill="#AFE2FF"
                        opacity="0.18"
                      />

                      <path
                        d="
                        M124 8
                        A28 28 0 0 1 129 77
                        L129 8
                        Z
                      "
                        fill="#AFE2FF"
                        opacity="0.26"
                      />
                    </svg>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="bg-primary box d-flex align-items-center justify-content-center">
                        <People className="text-light" size={18} />
                      </div>
                      <ThreeDots
                        className="text-secondary cursor-pointer"
                        size={18}
                      />
                    </div>
                    <Row className="mt-4">
                      <h3 className="fw-semibold">{totalEmployees}</h3>
                      <small className="text-muted">Total Employees</small>
                    </Row>
                  </Card>
                </Col>
                <Col md={3} className="flex-grow-1">
                  <Card className="p-3 border-0 rounded-4 position-relative overflow-hidden">
                    <svg
                      className="position-absolute top-50 end-0 translate-middle-y"
                      width="145"
                      height="85"
                      viewBox="0 0 175 65"
                      fill="none"
                      style={{ pointerEvents: "none" }}
                    >
                      <path
                        d="
                        M104 18
                        A25 25 0 0 1 98 67
                        L98 18
                        Z
                      "
                        fill="#AFE2FF"
                        opacity="0.18"
                      />

                      <path
                        d="
                        M124 8
                        A28 28 0 0 1 129 77
                        L129 8
                        Z
                      "
                        fill="#AFE2FF"
                        opacity="0.26"
                      />
                    </svg>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="bg-primary box d-flex align-items-center justify-content-center">
                        <PersonDashFill className="text-light" size={18} />
                      </div>
                      <ThreeDots
                        className="text-secondary cursor-pointer"
                        size={18}
                      />
                    </div>
                    <Row className="mt-4">
                      <h3 className="fw-semibold">32%</h3>
                      <small className="text-muted">Turnover Rate</small>
                    </Row>
                  </Card>
                </Col>

                <Col md={3} className="flex-grow-1">
                  <Card className="p-3 border-0 rounded-4 position-relative overflow-hidden">
                    <svg
                      className="position-absolute top-50 end-0 translate-middle-y"
                      width="145"
                      height="85"
                      viewBox="0 0 175 65"
                      fill="none"
                      style={{ pointerEvents: "none" }}
                    >
                      <path
                        d="
                          M104 18
                          A25 25 0 0 1 98 67
                          L98 18
                          Z
                        "
                        fill="#AFE2FF"
                        opacity="0.18"
                      />

                      <path
                        d="
                          M124 8
                          A28 28 0 0 1 129 77
                          L129 8
                          Z
                        "
                        fill="#AFE2FF"
                        opacity="0.26"
                      />
                    </svg>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="bg-primary box d-flex align-items-center justify-content-center">
                        <EmojiSmile className="text-light" size={18} />
                      </div>
                      <ThreeDots
                        className="text-secondary cursor-pointer"
                        size={18}
                      />
                    </div>
                    <Row className="mt-4">
                      <h3 className="fw-semibold">78%</h3>
                      <small className="text-muted">Happiness Rate</small>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={3} className="rounded-4 ">
          <Row className="h-100 rounded-4 overflow-hidden">
            <Col md={1}></Col>
            <Col md={2} className="bg-success rounded-start-4"></Col>
            <Col md={9} className="bg-warning p-2 ">
              <p className="fw-semibold fs-5 mb-3">Unlock New Features!</p>
              <p className="text-muted small mb-4">
                Dive into our advanced analytics and customizable
                reports—designed to streamline your HR tasks.
              </p>
              <Button className="btn-primary text-white rounded-3 mt-4 px-4 py-2">
                Upgrade Now
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    
  )
}

export default Dashboard_Card