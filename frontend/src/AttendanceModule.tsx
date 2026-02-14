import React, { useState } from "react";

interface StudentAttendance {
  id: string;
  studentName: string;
  enrollmentNo: string;
  className: string;
  date: string;
  status: "present" | "absent" | "leave";
}

interface StaffAttendance {
  id: string;
  staffName: string;
  employeeId: string;
  role: string;
  date: string;
  status: "present" | "absent" | "leave" | "on-duty";
}

interface AttendanceModuleProps {
  onBack: () => void;
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<"student" | "staff">("student");

  // Student Attendance States
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([
    {
      id: "1",
      studentName: "Aarav Kumar",
      enrollmentNo: "STU001",
      className: "10-A",
      date: "2026-02-15",
      status: "present",
    },
    {
      id: "2",
      studentName: "Priya Sharma",
      enrollmentNo: "STU002",
      className: "10-A",
      date: "2026-02-15",
      status: "present",
    },
    {
      id: "3",
      studentName: "Rohan Singh",
      enrollmentNo: "STU003",
      className: "10-B",
      date: "2026-02-15",
      status: "absent",
    },
  ]);

  // Staff Attendance States
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([
    {
      id: "s1",
      staffName: "Raj Patel",
      employeeId: "EMP001",
      role: "Mathematics Teacher",
      date: "2026-02-15",
      status: "present",
    },
    {
      id: "s2",
      staffName: "Ananya Sharma",
      employeeId: "EMP002",
      role: "English Teacher",
      date: "2026-02-15",
      status: "present",
    },
    {
      id: "s3",
      staffName: "Vikram Gupta",
      employeeId: "EMP003",
      role: "Principal",
      date: "2026-02-15",
      status: "on-duty",
    },
  ]);

  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [studentFilterClass, setStudentFilterClass] = useState("all");
  const [studentFilterDate, setStudentFilterDate] = useState("");

  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [staffFilterRole, setStaffFilterRole] = useState("all");
  const [staffFilterDate, setStaffFilterDate] = useState("");

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);

  const [studentFormData, setStudentFormData] = useState({
    studentName: "",
    enrollmentNo: "",
    className: "10-A",
    date: new Date().toISOString().split("T")[0],
    status: "present" as const,
  });

  const [staffFormData, setStaffFormData] = useState({
    staffName: "",
    employeeId: "",
    role: "Teacher",
    date: new Date().toISOString().split("T")[0],
    status: "present" as const,
  });

  // Student Attendance Handlers
  const handleAddStudentAttendance = () => {
    if (
      !studentFormData.studentName ||
      !studentFormData.enrollmentNo ||
      !studentFormData.date
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newAttendance: StudentAttendance = {
      id: Date.now().toString(),
      ...studentFormData,
    };

    setStudentAttendance((prev) => [...prev, newAttendance]);
    setShowStudentForm(false);
    setStudentFormData({
      studentName: "",
      enrollmentNo: "",
      className: "10-A",
      date: new Date().toISOString().split("T")[0],
      status: "present",
    });
  };

  const handleUpdateStudentStatus = (
    id: string,
    newStatus: "present" | "absent" | "leave"
  ) => {
    setStudentAttendance((prev) =>
      prev.map((att) => (att.id === id ? { ...att, status: newStatus } : att))
    );
  };

  const handleDeleteStudentAttendance = (id: string) => {
    if (window.confirm("Delete this attendance record?")) {
      setStudentAttendance((prev) => prev.filter((att) => att.id !== id));
    }
  };

  const filteredStudentAttendance = studentAttendance.filter((record) => {
    const matchesSearch =
      record.studentName
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      record.enrollmentNo
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase());

    const matchesClass =
      studentFilterClass === "all" || record.className === studentFilterClass;

    const matchesDate = !studentFilterDate || record.date === studentFilterDate;

    return matchesSearch && matchesClass && matchesDate;
  });

  // Staff Attendance Handlers
  const handleAddStaffAttendance = () => {
    if (
      !staffFormData.staffName ||
      !staffFormData.employeeId ||
      !staffFormData.date
    ) {
      alert("Please fill all required fields");
      return;
    }

    const newAttendance: StaffAttendance = {
      id: "s" + Date.now().toString(),
      ...staffFormData,
    };

    setStaffAttendance((prev) => [...prev, newAttendance]);
    setShowStaffForm(false);
    setStaffFormData({
      staffName: "",
      employeeId: "",
      role: "Teacher",
      date: new Date().toISOString().split("T")[0],
      status: "present",
    });
  };

  const handleUpdateStaffStatus = (
    id: string,
    newStatus: "present" | "absent" | "leave" | "on-duty"
  ) => {
    setStaffAttendance((prev) =>
      prev.map((att) => (att.id === id ? { ...att, status: newStatus } : att))
    );
  };

  const handleDeleteStaffAttendance = (id: string) => {
    if (window.confirm("Delete this attendance record?")) {
      setStaffAttendance((prev) => prev.filter((att) => att.id !== id));
    }
  };

  const filteredStaffAttendance = staffAttendance.filter((record) => {
    const matchesSearch =
      record.staffName.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
      record.employeeId
        .toLowerCase()
        .includes(staffSearchTerm.toLowerCase());

    const matchesRole =
      staffFilterRole === "all" || record.role === staffFilterRole;

    const matchesDate = !staffFilterDate || record.date === staffFilterDate;

    return matchesSearch && matchesRole && matchesDate;
  });

  const studentClasses = Array.from(
    new Set(studentAttendance.map((s) => s.className))
  );
  const staffRoles = Array.from(
    new Set(staffAttendance.map((s) => s.role))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "#10b981";
      case "absent":
        return "#ef4444";
      case "leave":
        return "#f59e0b";
      case "on-duty":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Attendance Management</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="attendance-tabs">
        <button
          className={`tab-button ${activeTab === "student" ? "active" : ""}`}
          onClick={() => setActiveTab("student")}
        >
          👥 Student Attendance
        </button>
        <button
          className={`tab-button ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => setActiveTab("staff")}
        >
          👨‍💼 Staff Attendance
        </button>
      </div>

      {/* Student Attendance Tab */}
      {activeTab === "student" && (
        <div className="tab-content">
          <div className="module-controls">
            <button
              onClick={() => setShowStudentForm(true)}
              className="add-btn"
              style={{ marginBottom: "15px" }}
            >
              + Mark Student Attendance
            </button>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search by student name or enrollment..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={studentFilterClass}
                onChange={(e) => setStudentFilterClass(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Classes</option>
                {studentClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={studentFilterDate}
                onChange={(e) => setStudentFilterDate(e.target.value)}
                className="filter-select"
              />
            </div>
          </div>

          {showStudentForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Mark Student Attendance</h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowStudentForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddStudentAttendance();
                }} className="student-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Student Name *</label>
                      <input
                        type="text"
                        value={studentFormData.studentName}
                        onChange={(e) =>
                          setStudentFormData({
                            ...studentFormData,
                            studentName: e.target.value,
                          })
                        }
                        placeholder="Enter student name"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Enrollment No *</label>
                      <input
                        type="text"
                        value={studentFormData.enrollmentNo}
                        onChange={(e) =>
                          setStudentFormData({
                            ...studentFormData,
                            enrollmentNo: e.target.value,
                          })
                        }
                        placeholder="e.g., STU001"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Class</label>
                      <select
                        value={studentFormData.className}
                        onChange={(e) =>
                          setStudentFormData({
                            ...studentFormData,
                            className: e.target.value,
                          })
                        }
                        className="form-input"
                      >
                        <option>10-A</option>
                        <option>10-B</option>
                        <option>11-A</option>
                        <option>11-B</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={studentFormData.date}
                        onChange={(e) =>
                          setStudentFormData({
                            ...studentFormData,
                            date: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={studentFormData.status}
                      onChange={(e) =>
                        setStudentFormData({
                          ...studentFormData,
                          status: e.target.value as "present" | "absent" | "leave",
                        })
                      }
                      className="form-input"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="leave">Leave</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="submit-btn">
                      Mark Attendance
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowStudentForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Enrollment</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudentAttendance.length > 0 ? (
                  filteredStudentAttendance.map((record) => (
                    <tr key={record.id}>
                      <td className="enrollment-col">{record.enrollmentNo}</td>
                      <td className="name-col">{record.studentName}</td>
                      <td>{record.className}</td>
                      <td>{record.date}</td>
                      <td>
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() =>
                              handleUpdateStudentStatus(record.id, "present")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "present"
                                  ? "#10b981"
                                  : "#e5e7eb",
                              color:
                                record.status === "present"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStudentStatus(record.id, "absent")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "absent"
                                  ? "#ef4444"
                                  : "#e5e7eb",
                              color:
                                record.status === "absent"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            ✗ Absent
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStudentStatus(record.id, "leave")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "leave"
                                  ? "#f59e0b"
                                  : "#e5e7eb",
                              color:
                                record.status === "leave"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            🏖️ Leave
                          </button>
                        </div>
                      </td>
                      <td className="actions-col">
                        <button
                          onClick={() =>
                            handleDeleteStudentAttendance(record.id)
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
                    <td colSpan={6} className="no-data">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="module-footer">
            <p>Total Records: {filteredStudentAttendance.length}</p>
          </div>
        </div>
      )}

      {/* Staff Attendance Tab */}
      {activeTab === "staff" && (
        <div className="tab-content">
          <div className="module-controls">
            <button
              onClick={() => setShowStaffForm(true)}
              className="add-btn"
              style={{ marginBottom: "15px" }}
            >
              + Mark Staff Attendance
            </button>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search by staff name or employee ID..."
                value={staffSearchTerm}
                onChange={(e) => setStaffSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={staffFilterRole}
                onChange={(e) => setStaffFilterRole(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                {staffRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={staffFilterDate}
                onChange={(e) => setStaffFilterDate(e.target.value)}
                className="filter-select"
              />
            </div>
          </div>

          {showStaffForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Mark Staff Attendance</h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowStaffForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddStaffAttendance();
                }} className="student-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Staff Name *</label>
                      <input
                        type="text"
                        value={staffFormData.staffName}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            staffName: e.target.value,
                          })
                        }
                        placeholder="Enter staff name"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Employee ID *</label>
                      <input
                        type="text"
                        value={staffFormData.employeeId}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            employeeId: e.target.value,
                          })
                        }
                        placeholder="e.g., EMP001"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Role</label>
                      <select
                        value={staffFormData.role}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            role: e.target.value,
                          })
                        }
                        className="form-input"
                      >
                        <option>Teacher</option>
                        <option>Principal</option>
                        <option>Vice Principal</option>
                        <option>Admin Staff</option>
                        <option>Support Staff</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        value={staffFormData.date}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            date: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={staffFormData.status}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          status: e.target.value as "present" | "absent" | "leave" | "on-duty",
                        })
                      }
                      className="form-input"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="leave">Leave</option>
                      <option value="on-duty">On Duty</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="submit-btn">
                      Mark Attendance
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowStaffForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Staff Name</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffAttendance.length > 0 ? (
                  filteredStaffAttendance.map((record) => (
                    <tr key={record.id}>
                      <td className="enrollment-col">{record.employeeId}</td>
                      <td className="name-col">{record.staffName}</td>
                      <td>{record.role}</td>
                      <td>{record.date}</td>
                      <td>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          <button
                            onClick={() =>
                              handleUpdateStaffStatus(record.id, "present")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "present"
                                  ? "#10b981"
                                  : "#e5e7eb",
                              color:
                                record.status === "present"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStaffStatus(record.id, "absent")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "absent"
                                  ? "#ef4444"
                                  : "#e5e7eb",
                              color:
                                record.status === "absent"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            ✗ Absent
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStaffStatus(record.id, "leave")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "leave"
                                  ? "#f59e0b"
                                  : "#e5e7eb",
                              color:
                                record.status === "leave"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            🏖️ Leave
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStaffStatus(record.id, "on-duty")
                            }
                            style={{
                              padding: "4px 8px",
                              backgroundColor:
                                record.status === "on-duty"
                                  ? "#3b82f6"
                                  : "#e5e7eb",
                              color:
                                record.status === "on-duty"
                                  ? "white"
                                  : "#6b7280",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            💼 On Duty
                          </button>
                        </div>
                      </td>
                      <td className="actions-col">
                        <button
                          onClick={() =>
                            handleDeleteStaffAttendance(record.id)
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
                    <td colSpan={6} className="no-data">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="module-footer">
            <p>Total Records: {filteredStaffAttendance.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
