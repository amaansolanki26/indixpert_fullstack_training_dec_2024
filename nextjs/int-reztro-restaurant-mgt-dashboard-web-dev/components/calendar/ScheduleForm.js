"use client";

import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function ScheduleForm({ initialData, onSubmit, buttonText }) {

  const defaultDate = initialData?.start_datetime
    ? initialData.start_datetime.split("T")[0]
    : (initialData?.date || "");

  const defaultStartTime = initialData?.start_datetime && initialData.start_datetime.includes("T")
    ? initialData.start_datetime.split("T")[1].substring(0, 5)
    : (initialData?.startTime || "");

  const defaultEndTime = initialData?.end_datetime && initialData.end_datetime.includes("T")
    ? initialData.end_datetime.split("T")[1].substring(0, 5)
    : (initialData?.endTime || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.schedule_type || initialData?.type || "",
      date: defaultDate,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      location: initialData?.location || "",
      team: Array.isArray(initialData?.team)
        ? initialData.team.join(", ")
        : (initialData?.team || ""),
      members: Array.isArray(initialData?.members)
        ? initialData.members.join(", ")
        : (initialData?.members || ""),
      extraMembers: initialData?.extraMembers || 0,
      notes: initialData?.notes || "",
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="schedule-form-card">
      <Row className="g-4">
        <Col lg={8}>
          <div className="form-section">
            <h5>Schedule Information</h5>

            <Form.Group className="mb-3">
              <Form.Label>Schedule Title</Form.Label>
              <Form.Control
                placeholder="Weekly Team Check-In"
                isInvalid={!!errors.title}
                {...register("title", {
                  required: "Schedule title is required",
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                })}
              />

              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Schedule Type</Form.Label>
                  <Form.Select
                    isInvalid={!!errors.type}
                    {...register("type", {
                      required: "Schedule type is required",
                    })}
                  >
                    <option value="">Select Type</option>
                    <option value="Meetings">Meetings</option>
                    <option value="Menu Updates">Menu Updates</option>
                    <option value="Inventory Checks">Inventory Checks</option>
                    <option value="Events">Events</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    isInvalid={!!errors.date}
                    {...register("date", {
                      required: "Date is required",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    isInvalid={!!errors.startTime}
                    {...register("startTime", {
                      required: "Start time is required",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startTime?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    isInvalid={!!errors.endTime}
                    {...register("endTime", {
                      required: "End time is required",
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endTime?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                placeholder="Kitchen"
                isInvalid={!!errors.location}
                {...register("location", {
                  required: "Location is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message:
                      "Name cannot contain numbers or special characters",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write schedule notes"
                isInvalid={!!errors.notes}
                {...register("notes", {
                  required: "Notes are required",
                  minLength: {
                    value: 10,
                    message: "Notes must be at least 10 characters",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.notes?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </Col>

        <Col lg={4}>
          <div className="form-section">
            <h5>Team Details</h5>

            <Form.Group className="mb-3">
              <Form.Label>Team</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Head Chef, Sous Chef, Menu Team"
                isInvalid={!!errors.team}
                {...register("team", {
                  required: "Team is required",
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message:
                      "Name cannot contain numbers or special characters",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.team?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Members</Form.Label>
              <Form.Control
                placeholder="Leave blank if no members (Example: AB, CD, EF)"
                isInvalid={!!errors.members}
                {...register("members", {
                  pattern: {
                    value: /^[a-zA-Z\s,]*$/,
                    message:
                      "Only letters, spaces, and commas (,) are allowed",
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.members?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Extra Members</Form.Label>
              <Form.Control
                type="number"
                placeholder="2"
                isInvalid={!!errors.extraMembers}
                {...register("extraMembers", {
                  min: { value: 0, message: "Minimum value is 0" },
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.extraMembers?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100 schedule-submit-btn">
              {buttonText}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}