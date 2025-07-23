// const mongoose = require('mongoose');
import mongoose from "mongoose";
const teamPerformanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dealsClosed: { type: Number, required: true },
  revenueGenerated: { type: Number, required: true },
  region: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const TeamPerformance = mongoose.model('TeamPerformance', teamPerformanceSchema);