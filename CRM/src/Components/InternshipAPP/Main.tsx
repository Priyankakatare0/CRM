import React, { useState } from "react";
import LeadSearchFilter from "./LeadSearchFilter";
import PipeLine from "./PipeLine";

const Main: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<"lead" | "pipeline">("lead");

  const styles: { [key: string]: React.CSSProperties } = {
    navbar: {
      display: "flex",
      gap: "20px",
      padding: "10px",
      borderBottom: "2px solid black",
    },
    link: {
      textDecoration: "none",
      color: "black",
      fontSize: "18px",
      fontWeight: "bold",
    },
    activeLink: {
      textDecoration: "none",
      color: "red",
      fontSize: "18px",
      fontWeight: "bold",
    },
  };

  return (
    <div>
      <nav style={styles.navbar}>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveComponent("lead");
          }}
          style={activeComponent === "lead" ? styles.activeLink : styles.link}
        >
          Lead Search Filter
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveComponent("pipeline");
          }}
          style={activeComponent === "pipeline" ? styles.activeLink : styles.link}
        >
          Pipeline
        </a>
      </nav>

      <div style={{ padding: "20px" }}>
        {activeComponent === "lead" && <LeadSearchFilter />}
        {activeComponent === "pipeline" && <PipeLine />}
      </div>
    </div>
  );
};

export default Main;
