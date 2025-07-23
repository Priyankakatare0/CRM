// const Sales = require('../models/Sales.js');
import {Sales} from "../models/Sales.js";
// Get all sales data
export const getSalesData = async (req, res) => {
  try {
    const salesData = await Sales.find();
    res.json(salesData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};