const pool = require("../config/db");

const getFunnelData = async () => {
  const funnelStages = ["Leads", "Contacted", "Qualified", "Proposal Sent", "Won"];
  const funnelData = {};

  const connection = await pool.getConnection();
  try {
    for (let stage of funnelStages) {
      const [rows] = await connection.query(
        "SELECT COUNT(*) AS count FROM sales_funnel WHERE stage = ?",
        [stage]
      );
      funnelData[stage] = rows[0].count;
    }
    return funnelData;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { getFunnelData };
