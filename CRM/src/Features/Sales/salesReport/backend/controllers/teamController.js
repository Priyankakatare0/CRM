// const TeamPerformance =require('../models/TeamPerformance.js');
import {TeamPerformance} from "../models/TeamPerformance.js";
// Get all team performance data
export const getTeamPerformance = async (req, res) => {
  try {
    const teamData = await TeamPerformance.find();
    res.json(teamData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};