const bannedWords = ["badword1", "badword2", "zarbli_soz"];

function isUnsafe(text) {
  const lower = text.toLowerCase();
  return bannedWords.some(word => lower.includes(word));
}

module.exports = { isUnsafe };
