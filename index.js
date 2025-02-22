const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8080;

require("dotenv").config(); // Load environment variables

// Connect to local MongoDB database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to local MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Define Mongoose schema
const BetaAccessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: { type: String, default: "" },
  role: { type: String },
});

const BetaAccess = mongoose.model("beta_access", BetaAccessSchema);

// Route to handle beta access form submission
app.post("/beta-access", async (req, res) => {
  try {
    const { name, email, linkedin, role } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and Email are required fields.",
      });
    }

    // Save to MongoDB
    const newRequest = new BetaAccess({
      name,
      email,
      linkedin,
      role,
    });
    await newRequest.save();

    res
      .status(201)
      .json({ message: "Beta access request submitted successfully." });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
