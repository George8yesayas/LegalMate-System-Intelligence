import { fileURLToPath } from "node:url";
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { agents } from "./agents.js";
import { systemInstruction } from "./config.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const publicDirectory = fileURLToPath(new URL("../public", import.meta.url));
const maxMessageLength = 4000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(publicDirectory));

app.get("/api/health", (_req, res) => {
  res.json({ status: "success", service: "LegalMate System Intelligence" });
});

app.post("/api/chat", async (req, res) => {
  const { message, mode = "consultant" } = req.body ?? {};

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Silakan masukkan pertanyaan Anda."
    });
  }

  if (message.trim().length > maxMessageLength) {
    return res.status(400).json({
      status: "error",
      message: `Pertanyaan maksimal ${maxMessageLength} karakter.`
    });
  }

  if (typeof mode !== "string" || !Object.hasOwn(agents, mode)) {
    return res.status(400).json({
      status: "error",
      message: "Silakan pilih Agent Assistant yang valid."
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      status: "error",
      message: "System Intelligence belum dikonfigurasi. Tambahkan GEMINI_API_KEY ke konfigurasi backend."
    });
  }

  const agent = agents[mode];

  try {
    const systemIntelligence = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await systemIntelligence.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: message.trim() }] }],
      config: {
        temperature: agent.config.temperature,
        topP: agent.config.topP,
        topK: agent.config.topK,
        systemInstruction: `${systemInstruction}

Active Agent:
${agent.name}

Agent Purpose:
${agent.instruction}`
      }
    });

    if (typeof response.text !== "string" || response.text.trim().length === 0) {
      console.error(`Gemini returned an empty response for ${agent.name}.`);
      return res.status(502).json({
        status: "error",
        message: "Agent Assistant belum dapat menyiapkan respons. Silakan coba lagi."
      });
    }

    return res.json({
      agent: agent.name,
      status: "success",
      reply: response.text.trim()
    });
  } catch (error) {
    console.error("Gemini request failed:", error);
    return res.status(502).json({
      status: "error",
      message: "Agent Assistant belum dapat menyelesaikan permintaan Anda. Silakan coba kembali beberapa saat lagi."
    });
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint API tidak ditemukan."
  });
});

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "error",
      message: "Isi permintaan harus berupa JSON yang valid."
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      status: "error",
      message: "Ukuran isi permintaan terlalu besar."
    });
  }

  console.error("Request handling failed:", error);
  return res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
  });
});

app.listen(port, () => {
  console.log(`LegalMate System Intelligence is running at http://localhost:${port}`);
});
