const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reportDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Report Schema
const reportSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  sharedWith: [String]
});

const Report = mongoose.model('Report', reportSchema);

// Admin check middleware (simplified - in real app use proper auth)
const isAdmin = (req, res, next) => {
  // In a real app, verify JWT or session
  if (req.headers['x-admin'] === 'true') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};

// Routes
app.post('/api/reports', isAdmin, async (req, res) => {
  try {
    const { title, content, createdBy } = req.body;
    const report = new Report({ title, content, createdBy });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports', isAdmin, async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/:id', isAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reports/:id/share', isAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    
    if (!report.sharedWith.includes(email)) {
      report.sharedWith.push(email);
      await report.save();
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});