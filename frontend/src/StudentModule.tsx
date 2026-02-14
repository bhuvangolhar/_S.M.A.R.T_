import React, { useState, useEffect } from "react";

interface Student {
  _id?: string;
  id?: string;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch students from backend on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students");
        const data = await response.json();
        console.log("✅ Fetched students:", data);
        setStudents(
          data.map((student: any) => ({
            ...student,
            id: student._id,
            status: student.status || "active",
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

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
    setEditingId(student._id || student.id);
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      if (editingId) {
        // Edit existing student
        const response = await fetch(`http://localhost:5000/api/students/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status: "active",
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error updating student");
        }
        const updatedStudent = await response.json();
        setStudents((prev) =>
          prev.map((s) =>
            s._id === editingId || s.id === editingId
              ? { ...updatedStudent, id: updatedStudent._id }
              : s
          )
        );
      } else {
        // Add new student
        const response = await fetch("http://localhost:5000/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status: "active",
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error creating student");
        }
        const newStudent = await response.json();
        setStudents((prev) => [...prev, { ...newStudent, id: newStudent._id }]);
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
    } catch (error) {
      console.error("❌ Error submitting student:", error);
      alert(`Error saving student: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`http://localhost:5000/api/students/${id}`, {
          method: "DELETE",
        });
        setStudents((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      } catch (error) {
        console.error("❌ Error deleting student:", error);
        alert("Error deleting student");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const student = students.find((s) => s._id === id || s.id === id);
      if (!student) return;
      
      const newStatus = student.status === "active" ? "inactive" : "active";
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...student, status: newStatus }),
      });
      const updatedStudent = await response.json();
      setStudents((prev) =>
        prev.map((s) =>
          s._id === id || s.id === id
            ? { ...updatedStudent, id: updatedStudent._id }
            : s
        )
      );
    } catch (error) {
      console.error("❌ Error toggling status:", error);
    }
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
                <tr key={student._id || student.id}>
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
                      onClick={() =>
                        handleToggleStatus(student._id || student.id || "")
                      }
                      className="action-btn toggle-btn"
                      title="Toggle Status"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteStudent(student._id || student.id || "")
                      }
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
                  {loading ? "Loading students..." : "No students found"}
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
