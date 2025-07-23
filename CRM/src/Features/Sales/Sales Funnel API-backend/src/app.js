const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const funnelRoutes = require("./routes/funnelRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", funnelRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
