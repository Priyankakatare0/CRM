import React, { useEffect, useState } from "react";

type Lead = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
};

type LeadStage = "Prospect" | "Qualified" | "Converted";

type LeadsState = {
  [key in LeadStage]: Lead[];
};

const initialLeads: LeadsState = {
  Prospect: [],
  Qualified: [],
  Converted: [],
};

const App: React.FC = () => {
  const [leads, setLeads] = useState<LeadsState>(initialLeads);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        const products: Lead[] = data.products;

        setLeads({
          Prospect: products.slice(0, 5),
          Qualified: [],
          Converted: [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const moveLead = (leadId: number, fromStage: LeadStage, toStage: LeadStage) => {
    const fromList = leads[fromStage];
    const toList = leads[toStage];

    const leadToMove = fromList.find((lead) => lead.id === leadId);

    if (leadToMove) {
      const updatedFromList = fromList.filter((lead) => lead.id !== leadId);
      const updatedToList = [...toList, leadToMove];

      setLeads((prevLeads) => ({
        ...prevLeads,
        [fromStage]: updatedFromList,
        [toStage]: updatedToList,
      }));
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.pipelineContainer}>
      <h1 style={styles.heading}>Lead Pipeline</h1>
      <div style={styles.pipeline}>
        {Object.keys(leads).map((stage) => (
          <div key={stage} style={styles.pipelineColumn}>
            <h2 style={styles.stageTitle}>{stage}</h2>
            <div style={styles.leadList}>
              {leads[stage as LeadStage].map((lead) => (
                <div key={lead.id} style={styles.leadCard}>
                  <h3 style={styles.leadTitle}>{lead.title}</h3>
                  <p><strong>Description:</strong> {lead.description}</p>
                  <p><strong>Price:</strong> ${lead.price}</p>
                  <p><strong>Category:</strong> {lead.category}</p>

                  {stage !== "Converted" && (
                    <button
                      style={styles.button}
                      onClick={() =>
                        moveLead(
                          lead.id,
                          stage as LeadStage,
                          stage === "Prospect" ? "Qualified" : "Converted"
                        )
                      }
                    >
                      Move to {stage === "Prospect" ? "Qualified" : "Converted"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pipelineContainer: {
    width: "92vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "20px",
  },
  pipeline: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
    padding: "20px",
  },
  pipelineColumn: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  stageTitle: {
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "15px",
    color: "#333",
  },
  leadList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  leadCard: {
    backgroundColor: "#fafafa",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
  },
  leadTitle: {
    fontSize: "18px",
    marginBottom: "8px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  loading: {
    textAlign: "center",
    fontSize: "24px",
    marginTop: "20px",
  },
};

export default App;
