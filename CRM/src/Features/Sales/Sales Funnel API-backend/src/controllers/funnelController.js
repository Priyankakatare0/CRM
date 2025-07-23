const { getFunnelData } = require("../models/funnelModel");

const fetchFunnelAnalytics = async (req, res) => {
  try {
    const funnelData = await getFunnelData();
    res.json({ success: true, funnel: funnelData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { fetchFunnelAnalytics };
