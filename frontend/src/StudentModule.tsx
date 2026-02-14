import React, { useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  enrollmentNo: string;
  class: string;
  dateOfBirth: string;
  address: string;
  status: "active" | "inactive";
}

interface StudentModuleProps {
  onBack: () => void;
}

const StudentModule: React.FC<StudentModuleProps> = ({ onBack }) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      firstName: "Arjun",
      lastName: "Kumar",
      email: "arjun@example.com",
      mobileNo: "9876543210",
      enrollmentNo: "ENR001",
      class: "10-A",
      dateOfBirth: "2009-05-15",
      address: "123 Main Street",
      status: "active",
    },
    {
      id: "2",
      firstName: "Priya",
      lastName: "Singh",
      email: "priya@example.com",
      mobileNo: "9876543211",
      enrollmentNo: "ENR002",
      class: "10-B",
      dateOfBirth: "2009-07-20",
      address: "456 Park Avenue",
      status: "active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    enrollmentNo: "",
    class: "10-A",
    dateOfBirth: "",
    address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = () => {
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      enrollmentNo: "",
      class: "10-A",
      dateOfBirth: "",
      address: "",
    });
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      mobileNo: student.mobileNo,
      enrollmentNo: student.enrollmentNo,
      class: student.class,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.enrollmentNo
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (editingId) {
      // Edit existing student
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobileNo: formData.mobileNo,
                enrollmentNo: formData.enrollmentNo,
                class: formData.class,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
              }
            : s
        )
      );
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNo: formData.mobileNo,
        enrollmentNo: formData.enrollmentNo,
        class: formData.class,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        status: "active",
      };
      setStudents((prev) => [...prev, newStudent]);
    }

    setShowForm(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      enrollmentNo: "",
      class: "10-A",
      dateOfBirth: "",
      address: "",
    });
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    );
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      filterClass === "all" || student.class === filterClass;

    return matchesSearch && matchesClass;
  });

  const classes = Array.from(new Set(students.map((s) => s.class)));

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Student Management</h2>
        </div>
        <button onClick={handleAddStudent} className="add-btn">
          + Add New Student
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>
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
                  <label>Enrollment No *</label>
                  <input
                    type="text"
                    name="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={handleInputChange}
                    placeholder="e.g., ENR001"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option>10-A</option>
                    <option>10-B</option>
                    <option>10-C</option>
                    <option>11-A</option>
                    <option>11-B</option>
                    <option>12-A</option>
                    <option>12-B</option>
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
                  {editingId ? "Update Student" : "Add Student"}
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
            placeholder="Search by name or enrollment no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Enrollment No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="enrollment-col">{student.enrollmentNo}</td>
                  <td className="name-col">
                    {student.firstName} {student.lastName}
                  </td>
                  <td>{student.class}</td>
                  <td className="email-col">{student.email}</td>
                  <td>{student.mobileNo}</td>
                  <td>
                    <span
                      className={`status-badge status-${student.status}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleStatus(student.id)}
                      className="action-btn toggle-btn"
                      title="Toggle Status"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
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
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="module-footer">
        <p>Total Students: {filteredStudents.length}</p>
      </div>
    </div>
  );
};

export default StudentModule;
