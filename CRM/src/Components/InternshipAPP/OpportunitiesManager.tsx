import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Opportunity {
  id: number;
  title: string;
  description: string;
  location: string;
  salary?: string;
  type?: string;
  experience?: string;
  datePosted?: string;
}

const STORAGE_KEY = "opportunities";
const DELETED_KEY = "deleted_opportunities";

const getOpportunities = (): Opportunity[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(data || "[]");
};

const getDeletedOpportunities = (): Opportunity[] => {
  const data = localStorage.getItem(DELETED_KEY);
  return JSON.parse(data || "[]");
};

const createOpportunity = (opportunity: Omit<Opportunity, "id" | "datePosted">) => {
  const current = getOpportunities();
  const newOpp: Opportunity = {
    ...opportunity,
    id: Date.now(),
    datePosted: new Date().toISOString().split("T")[0],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, newOpp]));
};

const updateOpportunity = (id: number, updatedData: Omit<Opportunity, "id" | "datePosted">) => {
  const current = getOpportunities();
  const updated = current.map((opp) =>
    opp.id === id
      ? {
          ...opp,
          ...updatedData,
          datePosted: new Date().toISOString().split("T")[0],
        }
      : opp
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

const deleteOpportunity = (id: number) => {
  const current = getOpportunities();
  const deleted = current.find((opp) => opp.id === id);
  const remaining = current.filter((opp) => opp.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));

  if (deleted) {
    const deletedData = getDeletedOpportunities();
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedData, deleted]));
  }
};

const restoreOpportunity = (id: number) => {
  const deleted = getDeletedOpportunities();
  const toRestore = deleted.find((opp) => opp.id === id);
  const remaining = deleted.filter((opp) => opp.id !== id);

  if (toRestore) {
    const current = getOpportunities();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, toRestore]));
    localStorage.setItem(DELETED_KEY, JSON.stringify(remaining));
  }
};

const permanentlyDeleteOpportunity = (id: number) => {
  const deleted = getDeletedOpportunities();
  const remaining = deleted.filter((opp) => opp.id !== id);
  localStorage.setItem(DELETED_KEY, JSON.stringify(remaining));
};

const OpportunitiesManager: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [deletedOpportunities, setDeletedOpportunities] = useState<Opportunity[]>([]);
  const [formData, setFormData] = useState<Omit<Opportunity, "id" | "datePosted">>({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "",
    experience: "",
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const loadData = () => {
    const data = getOpportunities();
    if (data.length === 0) {
      const defaultOpportunities: Opportunity[] = [
        {
          id: Date.now(),
          title: "Frontend Developer",
          description: "Build modern UIs using React.js",
          location: "Remote",
          salary: "6-10 LPA",
          type: "Full-Time",
          experience: "2 years",
          datePosted: new Date().toISOString().split("T")[0],
        },
        {
          id: Date.now() + 1,
          title: "UI/UX Designer",
          description: "Design user-friendly interfaces",
          location: "Bangalore",
          salary: "5-8 LPA",
          type: "Contract",
          experience: "1 year",
          datePosted: new Date().toISOString().split("T")[0],
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOpportunities));
      setOpportunities(defaultOpportunities);
    } else {
      setOpportunities(data);
    }
    setDeletedOpportunities(getDeletedOpportunities());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedOpportunity) {
      updateOpportunity(selectedOpportunity.id, formData);
    } else {
      createOpportunity(formData);
    }
    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      type: "",
      experience: "",
    });
    setSelectedOpportunity(null);
    loadData();
  };

  const handleEdit = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setFormData({
      title: opp.title,
      description: opp.description,
      location: opp.location,
      salary: opp.salary || "",
      type: opp.type || "",
      experience: opp.experience || "",
    });
  };

  const handleDelete = (id: number) => {
    deleteOpportunity(id);
    loadData();
  };

  const handleRestore = (id: number) => {
    restoreOpportunity(id);
    loadData();
  };

  const handlePermanentDelete = (id: number) => {
    permanentlyDeleteOpportunity(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "92vw", margin: "auto", fontFamily: "Arial" }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "30px" }}>
        <h2 style={{ width: "100%" }}>{selectedOpportunity ? "Edit" : "Create"} Opportunity</h2>
        <input name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" required style={{ flex: "1 1 45%", padding: "10px" }} />
        <input name="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Location" required style={{ flex: "1 1 45%", padding: "10px" }} />
        <input name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" required style={{ flex: "1 1 100%", padding: "10px" }} />
        <input name="salary" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="Salary (e.g., 6-10 LPA)" style={{ flex: "1 1 30%", padding: "10px" }} />
        <input name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="Job Type (e.g., Full-Time)" style={{ flex: "1 1 30%", padding: "10px" }} />
        <input name="experience" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} placeholder="Experience (e.g., 2 years)" style={{ flex: "1 1 30%", padding: "10px" }} />
        <button type="submit" style={{ width: "100%", padding: "12px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          {selectedOpportunity ? "Update" : "Create"} Opportunity
        </button>
      </form>

      <div>
        <h3>Opportunities</h3>
        {opportunities.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {opportunities.map((opp) => (
              <li key={opp.id} style={{ marginBottom: "15px", border: "1px solid #ccc", padding: "15px", borderRadius: "10px", background: "#f9f9f9" }}>
                <strong>{opp.title}</strong> - {opp.location}
                <br />
                <small>{opp.description}</small>
                <br />
                <small>
                  <strong>Salary:</strong> {opp.salary || "N/A"} | <strong>Type:</strong> {opp.type || "N/A"} | <strong>Experience:</strong> {opp.experience || "N/A"} | <strong>Date:</strong> {opp.datePosted || "N/A"}
                </small>
                <br />
                <button onClick={() => handleEdit(opp)} style={{ marginRight: "10px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(opp.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3>Deleted Opportunities</h3>
        {deletedOpportunities.length === 0 ? (
          <p>None</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {deletedOpportunities.map((opp) => (
              <li key={opp.id} style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px dashed gray", background: "#fff8f8" }}>
                <strong>{opp.title}</strong> - {opp.location}
                <br />
                <small>{opp.description}</small>
                <br />
                <small>
                  <strong>Salary:</strong> {opp.salary || "N/A"} | <strong>Type:</strong> {opp.type || "N/A"} | <strong>Experience:</strong> {opp.experience || "N/A"} | <strong>Date:</strong> {opp.datePosted || "N/A"}
                </small>
                <br />
                <button onClick={() => handleRestore(opp.id)} style={{ marginRight: "10px" }}>
                  Restore
                </button>
                <button onClick={() => handlePermanentDelete(opp.id)} style={{ backgroundColor: "red", color: "white" }}>
                  Delete Permanently
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesManager;
