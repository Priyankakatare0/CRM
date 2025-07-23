// const express = require('express');
import express from "express";
import  { getTeamPerformance } from '../controllers/teamController.js';

const router = express.Router();
router.get('/', getTeamPerformance);

export default router;