import express from "express";
import path from "path";
import { Client } from "@gradio/client";
import { fileURLToPath } from "url";
const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { query, history } = req.body;

  try {
    const client = await Client.connect("Qwen/Qwen2.5-72B-Instruct");
    const result = await client.predict("/model_chat", {
      query,
      history,
      system:
        "You are Qwen, created by Aman. You are a helpful assistant. You give user with detailed movie scripts about what user asks. Keep your response detailed and structured.",
    });

    res.json({ response: result.data });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to fetch chatbot response" });
  }
});

// Serve the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the chatbot! Visit /chat to interact with the bot.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
