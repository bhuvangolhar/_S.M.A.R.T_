import React, { useState, useEffect } from "react";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  employeeId: string;
  subject: string;
  qualification: string;
  dateOfBirth: string;
  address: string;
  status: "active" | "inactive";
}

interface TeacherModuleProps {
  onBack: () => void;
}

const TeacherModule: React.FC<TeacherModuleProps> = ({ onBack }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    employeeId: "",
    subject: "Mathematics",
    qualification: "",
    dateOfBirth: "",
    address: "",
  });

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/teachers");
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      // Map MongoDB _id to id
      const mappedData = data.map((teacher: any) => ({
        ...teacher,
        id: teacher._id,
      }));
      setTeachers(mappedData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTeacher = () => {
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      employeeId: "",
      subject: "Mathematics",
      qualification: "",
      dateOfBirth: "",
      address: "",
    });
    setShowForm(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      mobileNo: teacher.mobileNo,
      employeeId: teacher.employeeId,
      subject: teacher.subject,
      qualification: teacher.qualification,
      dateOfBirth: teacher.dateOfBirth,
      address: teacher.address,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.employeeId
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      // Edit existing teacher via API
      updateTeacher(editingId);
    } else {
      // Add new teacher via API
      createTeacher();
    }
  };

  const createTeacher = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "active" }),
      });
      if (!response.ok) throw new Error("Failed to create teacher");
      const newTeacher = await response.json();
      setTeachers((prev) => [
        ...prev,
        { ...newTeacher, id: newTeacher._id },
      ]);
      resetForm();
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert("Failed to create teacher");
    }
  };

  const updateTeacher = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update teacher");
      const updatedTeacher = await response.json();
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...updatedTeacher, id: updatedTeacher._id } : t
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      employeeId: "",
      subject: "Mathematics",
      qualification: "",
      dateOfBirth: "",
      address: "",
    });
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      deleteTeacher(id);
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete teacher");
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher");
    }
  };

  const handleToggleStatus = (id: string) => {
    const teacher = teachers.find((t) => t.id === id);
    if (teacher) {
      toggleTeacherStatus(id, teacher.status);
    }
  };

  const toggleTeacherStatus = async (
    id: string,
    currentStatus: "active" | "inactive"
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to toggle status");
      const updatedTeacher = await response.json();
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === id ? { ...updatedTeacher, id: updatedTeacher._id } : t
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      filterSubject === "all" || teacher.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(teachers.map((t) => t.subject)));

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Teacher Management</h2>
        </div>
        <button onClick={handleAddTeacher} className="add-btn">
          + Add New Teacher
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? "Edit Teacher" : "Add New Teacher"}</h3>
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
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="e.g., EMP001"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Geography</option>
                    <option>Computer Science</option>
                    <option>Physical Education</option>
                    <option>Arts</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Mobile No</label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., M.Sc, B.Ed"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update Teacher" : "Add Teacher"}
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
            placeholder="Search by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Teacher Name</th>
              <th>Subject</th>
              <th>Qualification</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="enrollment-col">{teacher.employeeId}</td>
                  <td className="name-col">
                    {teacher.firstName} {teacher.lastName}
                  </td>
                  <td>{teacher.subject}</td>
                  <td>{teacher.qualification}</td>
                  <td className="email-col">{teacher.email}</td>
                  <td>
                    <span
                      className={`status-badge status-${teacher.status}`}
                    >
                      {teacher.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button
                      onClick={() => handleEditTeacher(teacher)}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleStatus(teacher.id)}
                      className="action-btn toggle-btn"
                      title="Toggle Status"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.id)}
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
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="module-footer">
        <p>Total Teachers: {filteredTeachers.length}</p>
      </div>
    </div>
  );
};

export default TeacherModule;
