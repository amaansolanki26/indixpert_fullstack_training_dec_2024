import { Card, Dropdown } from "react-bootstrap"
import { ArrowUp } from "react-bootstrap-icons"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export const KPIChart = ({data}) => {
  return (
    <Card className="border-0 rounded-4 p-3  shadow-sm">
            <div className="d-flex justify-content-between align-items-center ">
              <h5 className="fw-500 ">Average Team KPI</h5>

              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  className="rounded-3 px-3 text-secondary btn-light"
                >
                  Monthly
                </Dropdown.Toggle>
              </Dropdown>
            </div>
            <div className="mb-2">
              <h2 className="fw-bold mb-0">84.45% </h2>{" "}
              <span className="text-success small">
                <ArrowUp className="text-success" /> 2.04%{" "}
              </span>
              <small className="text-muted ms-2">Last month: 81.09%</small>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="kpiGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#AFE2FF"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#AFE2FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      borderRadius: "10px",
                      border: "none",
                      color: "#fff",
                    }}
                    itemStyle={{
                      color: "#fff",
                    }}
                    labelStyle={{ display: "none" }}
                    formatter={(value) => [`${value}%`]}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ff6b45"
                    strokeWidth={2.5}
                    fill="url(#kpiGradient)"
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: "#000",
                      stroke: "#ff6b45", 
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
  )
}

export default KPIChart