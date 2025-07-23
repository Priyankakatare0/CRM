// const mongoose = require('mongoose');
import mongoose from "mongoose";
const salesSchema = new mongoose.Schema({
  product: { type: String, required: true },
  revenue: { type: Number, required: true },
  region: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const Sales = mongoose.model('Sales', salesSchema);