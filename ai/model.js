const fs = require("fs");
const path = require("path");
const fineTuneDataPath = path.join(__dirname, "fineTuneData.json");

let fineTuneData = [];
if (fs.existsSync(fineTuneDataPath)) {
  fineTuneData = JSON.parse(fs.readFileSync(fineTuneDataPath, "utf8"));
}

function getSuggestions(trigger) {
  const suggestions = [];
  if (trigger.includes("html")) suggestions.push("CSS haqida ko‘proq bilishni xohlaysizmi?");
  if (trigger.includes("js") || trigger.includes("javascript")) suggestions.push("Funksiyalar va looplar haqida tushuntirish kerakmi?");
  if (trigger.includes("python")) suggestions.push("Python misollarini ko‘rishni xohlaysizmi?");
  return suggestions;
}

function generateResponse(userMessage, history = []) {
  const lower = userMessage.toLowerCase();
  let mainResponse = "";
  let suggestions = [];

  for (let item of fineTuneData) {
    if (lower.includes(item.trigger.toLowerCase())) {
      mainResponse = item.response;
      suggestions = item.suggestions || [];
      break;
    }
  }

  if (!mainResponse) {
    if (lower.includes("salom")) mainResponse = "Salom! Qalaysiz?";
    else if (lower.includes("html")) mainResponse = "HTML haqida savol berishingiz mumkin.";
    else if (lower.includes("js") || lower.includes("javascript")) mainResponse = "JavaScript haqida savol berishingiz mumkin.";
    else mainResponse = "Savolingiz uchun rahmat! Men hozir javob tayyorlayapman...";
    suggestions = getSuggestions(lower);
  }

  if (suggestions.length > 0) mainResponse += "||" + suggestions.join("||");

  return mainResponse;
}

module.exports = { generateResponse };
