import React, { useState, useEffect } from "react";

interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
  category: string;
  creditHours: number;
  passingMarks: number;
  totalMarks: number;
  description: string;
  status: "active" | "inactive";
}

interface SubjectModuleProps {
  onBack: () => void;
}

const SubjectModule: React.FC<SubjectModuleProps> = ({ onBack }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    category: "Science",
    creditHours: 3,
    passingMarks: 40,
    totalMarks: 100,
    description: "",
  });

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/subjects");
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      // Map MongoDB _id to id
      const mappedData = data.map((subject: any) => ({
        ...subject,
        id: subject._id,
      }));
      setSubjects(mappedData);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      alert("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "creditHours" || name === "passingMarks" || name === "totalMarks"
          ? parseInt(value)
          : value,
    }));
  };

  const handleAddSubject = () => {
    setEditingId(null);
    setFormData({
      subjectName: "",
      subjectCode: "",
      category: "Science",
      creditHours: 3,
      passingMarks: 40,
      totalMarks: 100,
      description: "",
    });
    setShowForm(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingId(subject.id);
    setFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      category: subject.category,
      creditHours: subject.creditHours,
      passingMarks: subject.passingMarks,
      totalMarks: subject.totalMarks,
      description: subject.description,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subjectName || !formData.subjectCode) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.passingMarks > formData.totalMarks) {
      alert("Passing marks cannot exceed total marks");
      return;
    }

    if (editingId) {
      // Edit existing subject via API
      updateSubject(editingId);
    } else {
      // Add new subject via API
      createSubject();
    }
  };

  const createSubject = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "active" }),
      });
      if (!response.ok) throw new Error("Failed to create subject");
      const newSubject = await response.json();
      setSubjects((prev) => [...prev, { ...newSubject, id: newSubject._id }]);
      resetForm();
    } catch (error) {
      console.error("Error creating subject:", error);
      alert("Failed to create subject");
    }
  };

  const updateSubject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update subject");
      const updatedSubject = await response.json();
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === id ? { ...updatedSubject, id: updatedSubject._id } : s
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating subject:", error);
      alert("Failed to update subject");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      subjectName: "",
      subjectCode: "",
      category: "Science",
      creditHours: 3,
      passingMarks: 40,
      totalMarks: 100,
      description: "",
    });
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteSubject(id);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete subject");
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Failed to delete subject");
    }
  };

  const handleToggleStatus = (id: string) => {
    const subject = subjects.find((s) => s.id === id);
    if (subject) {
      toggleSubjectStatus(id, subject.status);
    }
  };

  const toggleSubjectStatus = async (
    id: string,
    currentStatus: "active" | "inactive"
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to toggle status");
      const updatedSubject = await response.json();
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === id ? { ...updatedSubject, id: updatedSubject._id } : s
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status");
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || subject.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(subjects.map((s) => s.category)));

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-left">
          <button onClick={onBack} className="back-button">
            ← Back
          </button>
          <h2>Subject Management</h2>
        </div>
        <button onClick={handleAddSubject} className="add-btn">
          + Add New Subject
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? "Edit Subject" : "Add New Subject"}</h3>
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
                  <label>Subject Name *</label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Subject Code *</label>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleInputChange}
                    placeholder="e.g., MATH101"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option>Science</option>
                    <option>Commerce</option>
                    <option>Arts</option>
                    <option>Language</option>
                    <option>Physical Education</option>
                    <option>Computer Science</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Credit Hours</label>
                  <input
                    type="number"
                    name="creditHours"
                    value={formData.creditHours}
                    onChange={handleInputChange}
                    placeholder="3"
                    min="1"
                    max="6"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Marks</label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="1"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Passing Marks</label>
                  <input
                    type="number"
                    name="passingMarks"
                    value={formData.passingMarks}
                    onChange={handleInputChange}
                    placeholder="40"
                    min="1"
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
                  placeholder="Enter subject description"
                  className="form-input"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update Subject" : "Add Subject"}
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
            placeholder="Search by subject name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Category</th>
              <th>Credit Hours</th>
              <th>Marks</th>
              <th>Passing</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="enrollment-col">{subject.subjectCode}</td>
                  <td className="name-col">{subject.subjectName}</td>
                  <td>{subject.category}</td>
                  <td className="center-align">{subject.creditHours}</td>
                  <td className="center-align">{subject.totalMarks}</td>
                  <td className="center-align">{subject.passingMarks}</td>
                  <td>
                    <span
                      className={`status-badge status-${subject.status}`}
                    >
                      {subject.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleToggleStatus(subject.id)}
                      className="action-btn toggle-btn"
                      title="Toggle Status"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
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
                <td colSpan={8} className="no-data">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="module-footer">
        <p>Total Subjects: {filteredSubjects.length}</p>
      </div>
    </div>
  );
};

export default SubjectModule;
