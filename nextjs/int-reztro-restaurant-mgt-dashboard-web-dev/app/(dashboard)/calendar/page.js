"use client";

import { useMemo, useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { Card, Col, Dropdown, Row, Spinner } from "react-bootstrap";
import { X, ChevronDown, CalendarWeek, Clock, GeoAlt } from "react-bootstrap-icons";
import { calendarService } from "@/services/calendarService";
import Link from "next/link";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar/calendar.scss";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const getEventClass = (type) => {
  if (type === "Meetings") return "meeting";
  if (type === "Menu Updates") return "menu";
  if (type === "Inventory Checks") return "check";
  return "event";
};

export default function CalendarPage() {
  const [calendarSchedules, setCalendarSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarView, setCalendarView] = useState("month");
  const [dropdownYear, setDropdownYear] = useState(activeDate.getFullYear());

  useEffect(() => {
    const fetchSchedulesAndMembers = async () => {
      try {
        setLoading(true);
        const response = await calendarService.getSchedules();
        const schedulesRaw = Array.isArray(response.data) ? response.data : response || [];

        const fullSchedulesData = await Promise.all(
          schedulesRaw.map(async (schedule) => {
            const scheduleId = schedule.schedule_id || schedule.id;

            if (scheduleId && !schedule.members && !schedule.team && !schedule.schedule_members) {
              try {
                const membersRes = await calendarService.getMembersBySchedule(scheduleId);
                const membersData = Array.isArray(membersRes.data) ? membersRes.data : membersRes || [];
                return { ...schedule, fetched_members: membersData };
              } catch (err) {
                console.error(`Failed to load members for schedule ${scheduleId}:`, err);
                return { ...schedule, fetched_members: [] };
              }
            }
            return schedule;
          })
        );

        setCalendarSchedules(fullSchedulesData);
      } catch (error) {
        console.error("Failed to load backend schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesAndMembers();
  }, []);

  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    label: new Date(dropdownYear, index, 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }),
    date: new Date(dropdownYear, index, 1),
  }));

  const events = useMemo(() => {
    return calendarSchedules.map((item) => {
      const startDate = item.start_datetime ? new Date(item.start_datetime) : new Date();
      const endDate = item.end_datetime ? new Date(item.end_datetime) : startDate;

      const finalMembers = item.members || item.team || item.schedule_members || item.fetched_members || [];

      return {
        ...item,
        title: item.title || "No Title",
        type: item.schedule_type || "Events",
        start: startDate,
        end: endDate,
        date: item.start_datetime ? format(startDate, "yyyy-MM-dd") : "",
        time: item.start_datetime && item.end_datetime
          ? `${format(startDate, "h:mm aaa")} - ${format(endDate, "h:mm aaa")}`
          : "N/A",
        computedMembers: finalMembers
      };
    });
  }, [calendarSchedules]);

  const eventCounts = useMemo(() => {
    return calendarSchedules.reduce((acc, item) => {
      const type = item.schedule_type || "Events";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, [calendarSchedules]);

  const viewRangeTitle = useMemo(() => {
    if (calendarView === "day") {
      return format(activeDate, "dd MMM yyyy");
    }

    if (calendarView === "week") {
      const weekStart = startOfWeek(activeDate, { weekStartsOn: 0 });
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      return `${format(weekStart, "dd MMM")} - ${format(weekEnd, "dd MMM yyyy")}`;
    }

    return "";
  }, [activeDate, calendarView]);

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedDateLabel = selectedDate ? format(selectedDate, "MMM d, yyyy") : "";

  const selectedEvents = events.filter(
    (item) => item.date === selectedDateKey,
  );

  return (
    <div className="calendar-page">
      <Row className="g-3">
        <Col xs={12} md={selectedDate ? 8 : 12} xl={selectedDate ? 9 : 12}>
          <Card className="calendar-card border-0">
            <Card.Body>
              <div className="calendar-top d-flex align-items-center justify-content-between flex-wrap gap-3">
                <Dropdown className="calendar-month-dropdown">
                  <Dropdown.Toggle className="calendar-month-toggle">
                    <span className="month-text">
                      {activeDate.toLocaleString("en-US", { month: "long" })}
                    </span>

                    <span className="year-text">
                      {activeDate.getFullYear()}
                    </span>

                    <ChevronDown size={14} className="month-down-icon" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="calendar-month-menu">
                    <div className="calendar-year-switch">
                      <button
                        type="button"
                        onClick={() => setDropdownYear(dropdownYear - 1)}
                      >
                        ‹
                      </button>

                      <strong>{dropdownYear}</strong>

                      <button
                        type="button"
                        onClick={() => setDropdownYear(dropdownYear + 1)}
                      >
                        ›
                      </button>
                    </div>

                    {monthOptions.map((item, index) => (
                      <Dropdown.Item
                        key={`${item.label}-${index}`}
                        active={
                          activeDate.getMonth() === item.date.getMonth() &&
                          activeDate.getFullYear() === item.date.getFullYear()
                        }
                        onClick={() => {
                          setActiveDate(item.date);
                          setSelectedDate(null);
                        }}
                      >
                        {item.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <div className="calendar-actions d-flex align-items-center gap-2">
                  <div className="view-tabs gap-2">
                    <button
                      type="button"
                      className={calendarView === "day" ? "active" : ""}
                      onClick={() => setCalendarView("day")}
                    >
                      Day
                    </button>

                    <button
                      type="button"
                      className={calendarView === "week" ? "active" : ""}
                      onClick={() => setCalendarView("week")}
                    >
                      Week
                    </button>

                    <button
                      type="button"
                      className={calendarView === "month" ? "active" : ""}
                      onClick={() => setCalendarView("month")}
                    >
                      Month
                    </button>
                  </div>

                  <Link
                    href="/calendar/add-schedule"
                    className="add-schedule-btn text-decoration-none d-inline-flex align-items-center justify-content-center"
                  >
                    <span className="add-text">Add Schedule</span>
                    <span className="add-icon">+</span>
                  </Link>
                </div>
              </div>

              <div className="calendar-scroll-area">
                <div className="calendar-scroll-inner">
                  {calendarView !== "month" && (
                    <div className="calendar-view-nav">
                      <button
                        type="button"
                        onClick={() => {
                          const newDate = new Date(activeDate);
                          if (calendarView === "day") newDate.setDate(newDate.getDate() - 1);
                          if (calendarView === "week") newDate.setDate(newDate.getDate() - 7);
                          setActiveDate(newDate);
                          setSelectedDate(null);
                        }}
                      >
                        {calendarView === "day" ? "Prev Day" : "Prev Week"}
                      </button>

                      <strong>{viewRangeTitle}</strong>

                      <button
                        type="button"
                        onClick={() => {
                          const newDate = new Date(activeDate);
                          if (calendarView === "day") newDate.setDate(newDate.getDate() + 1);
                          if (calendarView === "week") newDate.setDate(newDate.getDate() + 7);
                          setActiveDate(newDate);
                          setSelectedDate(null);
                        }}
                      >
                        {calendarView === "day" ? "Next Day" : "Next Week"}
                      </button>
                    </div>
                  )}

                  {/* Dynamic calculations applied to labels directly */}
                  <div className="calendar-legends">
                    <span className="meeting">
                      Meetings <b>({eventCounts["Meetings"] || 0})</b>
                    </span>

                    <span className="menu">
                      Menu Updates <b>({eventCounts["Menu Updates"] || 0})</b>
                    </span>

                    <span className="check">
                      Inventory Checks <b>({eventCounts["Inventory Checks"] || 0})</b>
                    </span>

                    <span className="event">
                      Events <b>({eventCounts["Events"] || 0})</b>
                    </span>
                  </div>

                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <Calendar
                      localizer={localizer}
                      events={events}
                      date={activeDate}
                      view={calendarView}
                      views={["day", "week", "month"]}
                      toolbar={false}
                      startAccessor="start"
                      endAccessor="end"
                      selectable="ignoreEvents"
                      step={60}
                      timeslots={1}
                      formats={{
                        dateFormat: "d",
                        dayFormat: "d",
                        weekdayFormat: "EEE",
                        timeGutterFormat: "h:mm aaa",
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                          `${localizer.format(start, "h:mm aaa", culture)} - ${localizer.format(
                            end,
                            "h:mm aaa",
                            culture
                          )}`,
                      }}
                      onNavigate={(date) => setActiveDate(date)}
                      onView={(view) => setCalendarView(view)}
                      onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
                      onSelectEvent={(event) => setSelectedDate(event.start)}
                      className="big-calendar"
                      eventPropGetter={(event) => ({
                        className: `calendar-event ${getEventClass(event.type)}`,
                      })}
                      components={{
                        event: ({ event }) => (
                          <div>
                            <strong>{event.title}</strong>
                            <small>{event.time}</small>

                            <div className="event-users">
                              {(event.computedMembers || []).slice(0, 3).map((member, index) => (
                                <i key={`${event.schedule_id || index}-member-${index}`}>
                                  {member?.member_initials}
                                </i>
                              ))}

                              {event.computedMembers.length > 3 && (
                                <em>+{event.computedMembers.length - 3} others</em>
                              )}
                            </div>
                          </div>
                        ),
                      }}
                    />
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {selectedDate && (
          <Col xs={12} md={4} xl={3} className="d-none d-md-block">
            <Card className="schedule-card border-0">
              <Card.Body>
                <div className="schedule-head d-flex align-items-center justify-content-between">
                  <h5>Schedule Details</h5>

                  <button
                    type="button"
                    className="schedule-close"
                    onClick={() => setSelectedDate(null)}
                  >
                    <X size={18} />
                  </button>
                </div>

                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event, index) => (
                    <div className="schedule-item" key={event.schedule_id || index}>
                      <div className="d-flex align-items-center justify-content-between">
                        <span>Schedule {index + 1}</span>
                        <span>...</span>
                      </div>

                      <h6>{event.title}</h6>
                      <label className={getEventClass(event.type)}>
                        {event.type}
                      </label>

                      <p><span><CalendarWeek className="me-1" /></span> {format(event.start, "MMM d, yyyy")}</p>
                      <p><span><Clock className="me-1" /></span> {event.time}</p>
                      <p><span><GeoAlt className="me-1" /></span> {event.location || "N/A"}</p>

                      <small>Team</small>

                      <div className="schedule-team">
                        {(event.computedMembers || []).slice(0, 2).map((member, idx) => (
                          <span key={`${event.schedule_id || index}-team-${idx}`} className="team-chip">
                            {member?.member_initials ? <i>{member.member_initials}</i> : <i>{member?.member_name?.slice(0, 2).toUpperCase() || "M"}</i>}
                            {member?.member_name || member}
                          </span>
                        ))}

                        {event.computedMembers.length > 2 && (
                          <span className="team-chip team-chip-more">
                            {event.computedMembers.slice(2, 5).map((_, idx) => (
                              <i key={`${event.schedule_id || index}-dot-${idx}`} />
                            ))}

                            <b>+{event.computedMembers.length - 2}</b>
                            <span>
                              {typeof event.computedMembers[2] === "object"
                                ? event.computedMembers[2]?.member_name
                                : event.computedMembers[2]}
                            </span>
                          </span>
                        )}
                      </div>

                      <small>Notes</small>
                      <p className="notes">{event.notes || "No notes available."}</p>
                    </div>
                  ))
                ) : (
                  <div className="schedule-empty">
                    No schedule found for {selectedDateLabel} date.
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {selectedDate && (
          <div className="calendar-mobile-drawer d-md-none">
            <div
              className="calendar-mobile-backdrop"
              onClick={() => setSelectedDate(null)}
            />

            <div className="calendar-mobile-panel">
              <div className="schedule-head d-flex align-items-center justify-content-between">
                <h5>Schedule Details</h5>

                <button
                  type="button"
                  className="schedule-close"
                  onClick={() => setSelectedDate(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, index) => (
                  <div className="schedule-item" key={event.schedule_id || index}>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>Schedule {index + 1}</span>
                      <span>...</span>
                    </div>

                    <h6>{event.title}</h6>
                    <label className={getEventClass(event.type)}>
                      {event.type}
                    </label>

                    <p><span><CalendarWeek className="me-1" /></span> {format(event.start, "MMM d, yyyy")}</p>
                    <p><span><Clock className="me-1" /></span> {event.time}</p>
                    <p><span><GeoAlt className="me-1" /></span> {event.location || "N/A"}</p>

                    <small>Team</small>

                    <div className="schedule-team">
                      {(event.computedMembers || []).slice(0, 2).map((member, idx) => (
                        <span
                          key={`${event.schedule_id || index}-${idx}`}
                          className="team-chip"
                        >
                          {member?.member_initials ? <i>{member.member_initials}</i> : <i>{member?.member_name?.slice(0, 2).toUpperCase() || "M"}</i>}
                          {member?.member_name || member}
                        </span>
                      ))}

                      {event.computedMembers.length > 2 && (
                        <span className="team-chip">
                          {event.computedMembers.slice(2, 5).map((_, idx) => (
                            <i key={`${event.schedule_id || index}-dot-${idx}`} />
                          ))}

                          <b>+{event.computedMembers.length - 2}</b>
                          {typeof event.computedMembers[2] === "object"
                            ? event.computedMembers[2]?.member_name
                            : event.computedMembers[2]}
                        </span>
                      )}
                    </div>

                    <small>Notes</small>
                    <p className="notes">{event.notes || "No notes available."}</p>
                  </div>
                ))
              ) : (
                <div className="schedule-empty">
                  No schedule found for this date.
                </div>
              )}
            </div>
          </div>
        )}
      </Row>
    </div>
  );
}