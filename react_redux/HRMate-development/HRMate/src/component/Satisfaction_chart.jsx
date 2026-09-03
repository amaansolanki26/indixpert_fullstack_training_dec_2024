import { Card, Row, Col } from 'react-bootstrap';
import { ThreeDots } from 'react-bootstrap-icons';

const StatRow = ({ label, range, value }) => (
  <Row className="align-items-center ">
    <Col xs={5} className="text-start">
      <div className="stat-label">{label}</div>
      <div className="stat-range-text text-muted">{range}</div>
    </Col>
    <Col xs={7} className="position-relative">
      <div className="custom-slider-track">
        <div 
          className="custom-slider-thumb" 
          style={{ left: `calc(${value}% - 14px)` }} 
        ></div>
      </div>
    </Col>
  </Row>
);

const SatisfactionCard = () => {
  const npsScore = 84;
  const labels = [0, 20, 40, 60, 80, 100];

  return (
    <Card className="satisfaction-card border-0 rounded-4 shadow-sm p-2">
      <div className="d-flex justify-content-between align-items-center  mb-4">
        <h5 className="mt-2 fw-500">Employee Satisfaction</h5>
        <span className="text-muted" ><ThreeDots/></span>
      </div>

      <div className="gauge-container ">
        <svg viewBox="0 0 100 60" className="gauge-svg">
          <defs>
            <path id="labelArc" d="M 10 52 A 38 38 0 0 1 88 50" />
          </defs>

          <path
            d="M 18 50 A 32 32 0 0 1 82 50"
            fill="none"
            stroke="#fff1f0"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 18 50 A 32 32 0 0 1 82 50"
            fill="none"
            stroke="#ff7a59"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="100.5"
            strokeDashoffset={100.5 - (100.5 * npsScore) / 100}
          />

          <text className="gauge-arc-labels ">
            {labels.map((val, i) => (
              <textPath 
                key={val} 
                href="#labelArc" 
                startOffset={`${i * 20}%`} 
                textAnchor="middle"
              >
                {val}
              </textPath>
            ))}
          </text>
        </svg>

        <div className="gauge-text">
          <h2 className="mb-0">{npsScore}</h2>
          <p className="nps-label mb-0">NPS Score</p>
          <div className="response-count">50 responses</div>
        </div>
      </div>

      <div className="stats-list">
        <StatRow label="Work Environment" range="70-85" value={82} />
        <StatRow label="Compensation & Benefits" range="60-75" value={68} />
        <StatRow label="Professional Development" range="65-80" value={76} />
        <StatRow label="Work-Life Balance" range="55-70" value={60} />
        <StatRow label="Management & Leadership" range="50-65" value={58} />
      </div>
      
      <Row className="">
        <Col md={5}></Col>
        <Col md={7}>
          <div className="d-flex justify-content-between text-muted scale-footer mb-2">
            <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SatisfactionCard;