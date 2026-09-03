import api from "./api";

const getScheduleId = (scheduleId) => {
    return scheduleId?.schedule_id || scheduleId?.id || scheduleId;
};

const getMemberId = (memberId) => {
    return memberId?.schedule_member_id || memberId?.id || memberId;
};

const buildCalendarPayload = (payload) => {
    return {
        admin_id: payload.admin_id || null,
        title: payload.title?.trim() || "",
        schedule_type: payload.schedule_type || payload.type || "Events",
        start_datetime: payload.start_datetime || null,
        end_datetime: payload.end_datetime || null,
        time: payload.time || "",
        location: payload.location?.trim() || null,
        notes: payload.notes?.trim() || null,
        is_active: payload.hasOwnProperty('is_active')
            ? payload.is_active
            : true
    };
};

export const calendarService = {
    /*
    |--------------------------------------------------------------------------
    | CALENDAR SCHEDULES CRUD
    |--------------------------------------------------------------------------
    */

    getSchedules: () => api.get("/calendar"),

    createSchedule: (payload) => {
        const jsonPayload = buildCalendarPayload(payload);
        return api.post("/calendar", jsonPayload);
    },

    getUpcomingSchedules: () => api.get("/calendar/upcoming"),

    getSchedulesByDate: (scheduleDate) => {
        return api.get(`/calendar/date/${scheduleDate}`);
    },

    restoreSchedule: (scheduleId) => {
        const id = getScheduleId(scheduleId);
        return api.patch(`/calendar/restore/${id}`);
    },

    getScheduleById: (scheduleId) => {
        const id = getScheduleId(scheduleId);
        return api.get(`/calendar/${id}`);
    },

    updateSchedule: (scheduleId, payload) => {
        const id = getScheduleId(scheduleId);
        const jsonPayload = buildCalendarPayload(payload);
        return api.put(`/calendar/${id}`, jsonPayload);
    },

    deleteSchedule: (scheduleId) => {
        const id = getScheduleId(scheduleId);
        return api.delete(`/calendar/${id}`);
    },

    /*
    |--------------------------------------------------------------------------
    | CALENDAR MEMBERS CRUD
    |--------------------------------------------------------------------------
    */
    getMembers: () => api.get("/calendar-members"),

    createMember: (payload) => {
        return api.post("/calendar-members", {
            schedule_id: payload.schedule_id,
            member_name: payload.member_name,
            member_initials: payload.member_initials,
        });
    },

    deleteMembersBySchedule: (scheduleId) => {
        const id = getScheduleId(scheduleId);
        return api.delete(`/calendar-members/schedule/${id}`);
    },

    getMembersBySchedule: (scheduleId) => {
        const id = getScheduleId(scheduleId);
        return api.get(`/calendar-members/schedule/${id}`);
    },

    getMemberById: (memberId) => {
        const id = getMemberId(memberId);
        return api.get(`/calendar-members/${id}`);
    },

    updateMember: (memberId, payload) => {
        const id = getMemberId(memberId);
        const jsonPayload = {
            member_name: payload.member_name?.trim() || "",
            email: payload.email?.trim() || null
        };
        return api.put(`/calendar-members/${id}`, jsonPayload);
    },

    deleteMember: (memberId) => {
        const id = getMemberId(memberId);
        return api.delete(`/calendar-members/${id}`);
    },
};