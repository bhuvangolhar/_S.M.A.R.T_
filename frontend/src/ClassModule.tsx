import React, { useState } from "react";

interface Class {
  id: string;
  className: string;
  classTeacher: string;
  section: string;
  roomNumber: string;
  totalStudents: number;
  startTime: string;
  endTime: string;
  capacity: number;
  description: string;
  status: "active" | "inactive";
}

interface ClassModuleProps {
  onBack: () => void;
}

const ClassModule: React.FC<ClassModuleProps> = ({ onBack }) => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      className: "Class 10-A",
      classTeacher: "Raj Patel",
      section: "A",
      roomNumber: "101",
      totalStudents: 45,
      startTime: "08:00",
      endTime: "01:00",
      capacity: 50,
      description: "Science Stream",
      status: "active",
    },
    {
      id: "2",
      className: "Class 10-B",
      classTeacher: "Ananya Sharma",
      section: "B",
      roomNumber: "102",
      totalStudents: 42,
      startTime: "08:00",
      endTime: "01:00",
      capacity: 50,
      description: "Commercial Stream",
      status: "active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [formData, setFormData] = useState({
    className: "",
    classTeacher: "",
    section: "",
    roomNumber: "",
    totalStudents: 0,
    startTime: "08:00",
    endTime: "01:00",
    capacity: 50,
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalStudents" || name === "capacity" ? parseInt(value) : value,
    }));
  };

  const handleAddClass = () => {
    setEditingId(null);
    setFormData({
      className: "",
      classTeacher: "",
      section: "",
      roomNumber: "",
      totalStudents: 0,
      startTime: "08:00",
      endTime: "01:00",
      capacity: 50,
      description: "",
    });
    setShowForm(true);
  };

  const handleEditClass = (cls: Class) => {
    setEditingId(cls.id);
    setFormData({
      className: cls.className,
      classTeacher: cls.classTeacher,
      section: cls.section,
      roomNumber: cls.roomNumber,
      totalStudents: cls.totalStudents,
      startTime: cls.startTime,
      endTime: cls.endTime,
      capacity: cls.capacity,
      description: cls.description,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.className ||
      !formData.classTeacher ||
      !formData.roomNumber
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.totalStudents > formData.capacity) {
      alert("Total students cannot exceed class capacity");
      return;
    }

    if (editingId) {
      // Edit existing class
      setClasses((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                className: formData.className,
                classTeacher: formData.classTeacher,
                section: formData.section,
                roomNumber: formData.roomNumber,
                totalStudents: formData.totalStudents,
                startTime: formData.startTime,
                endTime: formData.endTime,
                capacity: formData.capacity,
                description: formData.description,
              }
            : c
        )
      );
    } else {
      // Add new class
      const newClass: Class = {
        id: Date.now().toString(),
        className: formData.className,
        classTeacher: formData.classTeacher,
        section: formData.section,
        roomNumber: formData.roomNumber,
        totalStudents: formData.totalStudents,
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: formData.capacity,
        description: formData.description,
        status: "active",
      };
      setClasses((prev) => [...prev, newClass]);
    }

    setShowForm(false);
    setFormData({
      className: "",
      classTeacher: "",
      section: "",
      roomNumber: "",
      totalStudents: 0,
      startTime: "08:00",
      endTime: "01:00",
      capacity: 50,
      description: "",
    });
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c
      )
    );
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || cls.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Class Management</h2>
        </div>
        <button onClick={handleAddClass} className="add-btn">
          + Add New Class
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? "Edit Class" : "Add New Class"}</h3>
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
                  <label>Class Name *</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="e.g., Class 10-A"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g., A, B, C"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Class Teacher *</label>
                  <input
                    type="text"
                    name="classTeacher"
                    value={formData.classTeacher}
                    onChange={handleInputChange}
                    placeholder="Enter teacher name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 101, 102"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Students</label>
                  <input
                    type="number"
                    name="totalStudents"
                    value={formData.totalStudents}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Class Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="1"
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
                  placeholder="Enter class description"
                  className="form-input"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update Class" : "Add Class"}
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

      <div className="module-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by class name, teacher or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Teacher</th>
              <th>Room</th>
              <th>Students</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <tr key={cls.id}>
                  <td className="enrollment-col">{cls.className}</td>
                  <td className="name-col">{cls.classTeacher}</td>
                  <td>{cls.roomNumber}</td>
                  <td>
                    <span className="student-count">
                      {cls.totalStudents}/{cls.capacity}
                    </span>
                  </td>
                  <td className="email-col">{`${cls.startTime} - ${cls.endTime}`}</td>
                  <td>
                    <span
                      className={`status-badge status-${cls.status}`}
                    >
                      {cls.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button
                      onClick={() => handleEditClass(cls)}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cls.id)}
                      className="action-btn toggle-btn"
                      title="Toggle Status"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-data">
                  No classes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="module-footer">
        <p>Total Classes: {filteredClasses.length}</p>
      </div>
    </div>
  );
};

export default ClassModule;
