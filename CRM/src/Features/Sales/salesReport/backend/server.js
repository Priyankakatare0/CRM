import  express from 'express';
import  mongoose from 'mongoose';
import  cors from 'cors'
import  dotenv from 'dotenv'
import  salesRoutes from './routes/salesRoutes.js'
import  teamRoutes from './routes/teamRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/team', teamRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));