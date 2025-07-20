const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./utils/mongodb");
const errorHandler = require("./middleware/errorHandler");

const axios = require('axios');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const adminRoutes = require("./routes/admin");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://kellton-task-5w2z.vercel.app'
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/ai/description", async (req, res) => {
  const { summary } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // You can change to 'openai/gpt-3.5-turbo' or others
        messages: [
          {
            role: "user",
            content: `Generate a helpful and clear task description from this summary: "${summary}"`
          }
        ],
        max_tokens: 150
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // required by OpenRouter
          "X-Title": "SmartTaskApp"
        }
      }
    );

    const description = response.data.choices[0].message.content.trim();
    res.json({ description });
  } catch (err) {
    console.error("❌ LLM Error:", err.response?.data || err.message);
    res.status(500).json({ error: "LLM generation failed" });
  }
});


app.get("/", (req, res) => res.send("Smart Task Management API is running..."));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
