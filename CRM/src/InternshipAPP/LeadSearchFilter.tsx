import { useState, useEffect, ChangeEvent } from "react";

type User = {
  id: number;
  name: string;
  stage: "Prospect" | "Negotiation";
  priority: "High" | "Low";
};

export default function LeadSearchFilter() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [stage, setStage] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        const userData: User[] = data.users.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          stage: user.gender === "male" ? "Prospect" : "Negotiation",
          priority: user.age > 30 ? "High" : "Low",
        }));
        setUsers(userData);
      });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (search === "" || user.name.toLowerCase().includes(search.toLowerCase())) &&
      (stage === "all" || user.stage === stage) &&
      (priority === "all" || user.priority === priority)
  );

  return (
    <div
      style={{
        width: "92vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          style={{
            width: "95%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "16px",
            marginBottom: "16px",
          }}
        />

        {/* Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <select
            value={stage}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStage(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
              backgroundColor: "white",
            }}
          >
            <option value="all">All Stages</option>
            <option value="Prospect">Prospect</option>
            <option value="Negotiation">Negotiation</option>
          </select>
          <select
            value={priority}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value)}
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
              backgroundColor: "white",
            }}
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* User Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            width: "100%",
          }}
        >
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>{user.name}</h2>
              <p>Stage: {user.stage}</p>
              <p>Priority: {user.priority}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
