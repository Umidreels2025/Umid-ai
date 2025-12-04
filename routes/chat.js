const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const model = require("../ai/model");
const filter = require("../moderation/filter");

const chatFile = path.join(__dirname, "../data/chatHistory.json");

async function getChatHistory() {
  try {
    if (!(await fs.pathExists(chatFile))) await fs.writeJson(chatFile, []);
    return await fs.readJson(chatFile);
  } catch (err) { console.error(err); return []; }
}

router.post("/", async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "UserId va message kerak" });

  let history = await getChatHistory();
  let aiResponse = model.generateResponse(message, history);

  if (filter.isUnsafe(aiResponse)) aiResponse = "Javob bloklandi. Xavfli kontent aniqlangan.";

  aiResponse += "\n\nJavobda xato boʻlishi mumkin, iltimos uni tekshiring, xatoni aniqlasangiz bizga xabar bering!";

  history.push({ userId, message, response: aiResponse, timestamp: new Date().toISOString() });

  const oneMonthAgo = new Date(); oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  history = history.filter(item => new Date(item.timestamp) > oneMonthAgo);

  await fs.writeJson(chatFile, history);
  res.json({ response: aiResponse });
});

module.exports = router;
