"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ScheduleForm from "@/components/calendar/ScheduleForm";
import { calendarService } from "@/services/calendarService";
import "@/styles/calendar/addSchedule.scss";
import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";

const formatTime = (time) => {
  return new Date(`2035-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function AddSchedulePage() {
  const router = useRouter();

  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const token = localStorage.getItem("idToken");

      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));

      const adminRes = await adminService.getAdminByEmail(
        payload.email
      );

      setAdminId(adminRes.data.admin_id);

    } catch (error) {
      console.error("ADMIN ERROR =", error);
    }
  };

  const handleAddSchedule = async (data) => {
    try {

      const startDateTimeStr = `${data.date}T${data.startTime}:00`;
      const endDateTimeStr = `${data.date}T${data.endTime}:00`;

      const finalData = {
        admin_id: adminId,
        title: data.title,
        schedule_type: data.type,
        start_datetime: startDateTimeStr,
        end_datetime: endDateTimeStr,
        time: `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`,
        location: data.location,
        notes: data.notes,
        is_active: true,

        team: data.team ? data.team.split(",").map((item) => item.trim()).filter(Boolean) : [],
        members: data.members
          ? data.members.split(",").map((item) => (item.trim() ? item.trim() : " "))
          : [],
        extraMembers: Number(data.extraMembers) || 0,
      };

      const response = await calendarService.createSchedule(finalData);

      const scheduleId = response.data.schedule_id;

      if (data.members) {

        const members = data.members
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean);

        for (const member of members) {

          await calendarService.createMember({
            schedule_id: scheduleId,
            member_name: member,
            member_initials: member
              .split(" ")
              .map((x) => x[0])
              .join("")
              .substring(0, 2)
              .toUpperCase(),
          });

        }
      }

      toast.success("Schedule added successfully!");

      setTimeout(() => {
        router.push("/calendar");
      }, 1200);
    } catch (error) {
      console.error("Failed to add backend schedule:", error);
      toast.error("Failed to add schedule. Please try again.");
    }
  };

  return (
    <div className="calendar-action-page">
      <ScheduleForm buttonText="Add Schedule" onSubmit={handleAddSchedule} />
    </div>
  );
}