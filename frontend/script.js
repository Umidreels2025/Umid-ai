const chatWindow = document.getElementById("chatWindow");
const userMessage = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const suggestionsDiv = document.getElementById("suggestions");

const userId = "user123";
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
renderChat();

sendBtn.addEventListener("click", async () => {
    const message = userMessage.value.trim();
    if (!message) return;

    addMessageToChat("user", message);
    userMessage.value = "";

    const response = await sendMessageToServer(message);
    displayAIResponse(response);
});

newChatBtn.addEventListener("click", () => {
    chatHistory = [];
    localStorage.removeItem("chatHistory");
    chatWindow.innerHTML = "";
    suggestionsDiv.innerHTML = "";
});

function renderChat() {
    chatWindow.innerHTML = "";
    chatHistory.forEach(item => addMessageToChat(item.sender, item.message, false));
}

function addMessageToChat(sender, message, save = true) {
    const div = document.createElement("div");
    div.className = sender === "user" ? "user-msg" : "ai-msg";
    div.innerText = message;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    if (save) {
        chatHistory.push({ sender, message });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
}

async function sendMessageToServer(message) {
    try {
        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, message })
        });
        const data = await res.json();
        return data.response;
    } catch (err) {
        console.error(err);
        return "Server bilan bog‘lanishda xatolik yuz berdi.";
    }
}

// AI javobini ko‘rsatish va inline tavsiyalarni yaratish
function displayAIResponse(response) {
    // Tavsiyalarini ajratish (agar AI model javobida tavsiya bo‘lsa)
    const parts = response.split("||"); // Tavsiyalarni "||" bilan ajratib qaytarish mumkin
    const mainResponse = parts[0];
    const suggestions = parts.slice(1);

    addMessageToChat("ai", mainResponse);

    suggestionsDiv.innerHTML = "";
    suggestions.forEach(sugg => {
        const btn = document.createElement("button");
        btn.innerText = sugg;
        btn.addEventListener("click", async () => {
            addMessageToChat("user", sugg);
            const res = await sendMessageToServer(sugg);
            displayAIResponse(res);
        });
        suggestionsDiv.appendChild(btn);
    });
  }
