import { calendarSchedules } from "@/data/CalendarData";

const STORAGE_KEY = "calendar_schedules";

export const getCalendarSchedules = () => {
  if (typeof window === "undefined") return calendarSchedules;

  const savedSchedules = localStorage.getItem(STORAGE_KEY);

  if (!savedSchedules) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calendarSchedules));
    return calendarSchedules;
  }

  return JSON.parse(savedSchedules);
};

export const addCalendarSchedule = (data) => {
  const schedules = getCalendarSchedules();

  const newSchedule = {
    ...data,
    id: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...schedules, newSchedule]));

  return newSchedule;
};