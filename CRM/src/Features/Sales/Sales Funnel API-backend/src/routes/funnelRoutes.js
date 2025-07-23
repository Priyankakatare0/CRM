const express = require("express");
const { fetchFunnelAnalytics } = require("../controllers/funnelController");

const router = express.Router();

router.get("/analytics/funnel", fetchFunnelAnalytics);

module.exports = router;
