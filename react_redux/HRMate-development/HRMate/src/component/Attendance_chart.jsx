import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, Dropdown } from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";

export const Attendance_chart = ({ data }) => {
  const chartData = data.map((d) => ({
    date: d.date,
    onTime: d.present - 2,
    late: d.late - 2,
    absent: d.absent,
    gap1: 2,
  }));

  return (
    <Card className="border-0 rounded-4 p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-500 mb-0">Attendance Overview</h5>

        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            size="sm"
            className="rounded-3 px-3 text-secondary"
          ><Calendar/> {" "}
             9 – 15 February
          </Dropdown.Toggle>
        </Dropdown>
      </div>

      <div className="d-flex gap-4 mb-3 small text-muted">
        <div className="d-flex align-items-center gap-4">
          <span
            className="rounded-circle"
            style={{ width: 8, height: 8, background: "#B9E6FF" }}
          />
          On-Time
        </div>
        <div className="d-flex align-items-center gap-2">
          <span
            className="rounded-circle"
            style={{ width: 8, height: 8, background: "#FF6B4A" }}
          />
          Late
        </div>
        <div className="d-flex align-items-center gap-2">
          <span
            className="rounded-circle"
            style={{ width: 8, height: 8, background: "#FFE7DF" }}
          />
          Absent
        </div>
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap={20} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 , fill: "#9ca3af"}}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 , fill: "#9ca3af" }}
            />

            <Tooltip formatter={(v) => `${v}%`}  cursor={{ fill: '#f0f0f0', opacity: 0.5 }} />

            <Bar
              dataKey="onTime"
              stackId="a"
              fill="#B9E6FF"
              radius={[6, 6, 6, 6]}
            />
            <Bar dataKey="gap1" stackId="a" fill="transparent" tooltipType="none"/>
            <Bar
              dataKey="late"
              stackId="a"
              fill="#FF6B4A"
              radius={[6, 6, 6, 6]}
            />
            <Bar dataKey="gap1" stackId="a" fill="transparent" tooltipType="none"/>
            <Bar
              dataKey="absent"
              stackId="a"
              fill="#FFE7DF"
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Attendance_chart;
