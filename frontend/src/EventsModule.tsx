import React, { useState, useEffect } from "react";

interface Event {
  id: string;
  eventName: string;
  date: string;
  category: "holiday" | "school-event" | "exam" | "meeting" | "other";
  description: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

interface EventsModuleProps {
  onBack: () => void;
}

const EventsModule: React.FC<EventsModuleProps> = ({ onBack }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    eventName: "",
    date: new Date().toISOString().split("T")[0],
    category: "school-event" as const,
    description: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      // Map MongoDB _id to id
      const mappedData = data.map((event: any) => ({
        ...event,
        id: event._id,
      }));
      setEvents(mappedData);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEvent = () => {
    setEditingId(null);
    setFormData({
      eventName: "",
      date: new Date().toISOString().split("T")[0],
      category: "school-event",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
    });
    setShowForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      eventName: event.eventName,
      date: event.date,
      category: event.category,
      description: event.description,
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      location: event.location || "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventName || !formData.date) {
      alert("Please fill required fields");
      return;
    }

    if (editingId) {
      // Edit existing event via API
      updateEvent(editingId);
    } else {
      // Add new event via API
      createEvent();
    }
  };

  const createEvent = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create event");
      const newEvent = await response.json();
      setEvents((prev) => [...prev, { ...newEvent, id: newEvent._id }]);
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const updateEvent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update event");
      const updatedEvent = await response.json();
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === id ? { ...updatedEvent, id: updatedEvent._id } : evt
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      eventName: "",
      date: new Date().toISOString().split("T")[0],
      category: "school-event",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Delete this event?")) {
      deleteEvent(id);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "holiday":
        return "#10b981";
      case "school-event":
        return "#8b5cf6";
      case "exam":
        return "#ef4444";
      case "meeting":
        return "#3b82f6";
      case "other":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      holiday: "Holiday",
      "school-event": "School Event",
      exam: "Exam",
      meeting: "Meeting",
      other: "Other",
    };
    return labels[category] || category;
  };

  // Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return events.filter((evt) => evt.date === date);
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Events & Holidays</h2>
        </div>
        <button onClick={handleAddEvent} className="add-btn">
          + Add Event
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? "Edit Event" : "Add New Event"}</h3>
              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="e.g., Annual Sports Day"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="holiday">Holiday</option>
                    <option value="school-event">School Event</option>
                    <option value="exam">Exam</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., School Ground"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  className="form-input"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update Event" : "Add Event"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="events-view-controls">
        <div className="view-mode-toggle">
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            📋 List View
          </button>
          <button
            className={`view-btn ${viewMode === "calendar" ? "active" : ""}`}
            onClick={() => setViewMode("calendar")}
          >
            📅 Calendar View
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="list-view">
          <div className="module-controls">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="holiday">Holiday</option>
              <option value="school-event">School Event</option>
              <option value="exam">Exam</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="events-list">
            {filteredEvents.length > 0 ? (
              filteredEvents
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-card-left">
                      <div
                        className="event-category-indicator"
                        style={{
                          backgroundColor: getCategoryColor(event.category),
                        }}
                      />
                    </div>
                    <div className="event-card-content">
                      <div className="event-header">
                        <h3>{event.eventName}</h3>
                        <span
                          className="event-category-badge"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        >
                          {getCategoryLabel(event.category)}
                        </span>
                      </div>
                      <div className="event-details">
                        <div className="detail">
                          <span className="detail-icon">📅</span>
                          <span className="detail-value">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        {event.startTime && event.endTime && (
                          <div className="detail">
                            <span className="detail-icon">⏰</span>
                            <span className="detail-value">
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className="detail">
                            <span className="detail-icon">📍</span>
                            <span className="detail-value">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="event-description">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="event-card-actions">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="action-btn edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="action-btn delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-events">No events found</div>
            )}
          </div>
        </div>
      )}

      {viewMode === "calendar" && (
        <div className="calendar-view">
          <div className="calendar-controls">
            <button
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              className="month-nav-btn"
            >
              ←
            </button>
            <h3 className="calendar-title">{monthName}</h3>
            <button
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              className="month-nav-btn"
            >
              →
            </button>
          </div>

          <div className="calendar-container">
            <div className="calendar-weekdays">
              <div className="weekday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
            </div>

            <div className="calendar-days">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="calendar-day empty" />
                  );
                }

                const dateStr = `${selectedYear}-${String(
                  selectedMonth + 1
                ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = getEventsForDate(dateStr);

                return (
                  <div
                    key={day}
                    className={`calendar-day ${
                      dayEvents.length > 0 ? "has-events" : ""
                    }`}
                  >
                    <div className="day-number">{day}</div>
                    {dayEvents.length > 0 && (
                      <div className="day-events">
                        {dayEvents.slice(0, 2).map((evt) => (
                          <div
                            key={evt.id}
                            className="day-event"
                            style={{
                              backgroundColor: getCategoryColor(evt.category),
                            }}
                            title={evt.eventName}
                          >
                            {evt.eventName.substring(0, 8)}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="day-event-more">
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="module-footer">
        <p>Total Events: {filteredEvents.length}</p>
      </div>
    </div>
  );
};

export default EventsModule;
