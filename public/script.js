const agents = {
  consultant: {
    name: "Agent Konsultan Hukum",
    config: { temperature: 0.3, topP: 0.8, topK: 20 },
    suggestions: [
      "Apa yang dimaksud dengan wanprestasi?",
      "Apa saja syarat sahnya perjanjian di Indonesia?",
      "Bagaimana proses penyelesaian sengketa melalui mediasi?"
    ]
  },
  contract: {
    name: "Agent Analisis Kontrak",
    config: { temperature: 0.4, topP: 0.85, topK: 30 },
    suggestions: [
      "Apa risiko dari klausul penalti dalam kontrak?",
      "Apa yang perlu diperhatikan dalam klausul pengakhiran kontrak?",
      "Jelaskan klausul ganti rugi dan hal yang perlu ditinjau."
    ]
  },
  learning: {
    name: "Agent Pembelajaran Hukum",
    config: { temperature: 0.7, topP: 0.9, topK: 40 },
    suggestions: [
      "Jelaskan asas praduga tak bersalah dengan contoh sederhana.",
      "Apa perbedaan hukum perdata dan hukum pidana?",
      "Bagaimana hierarki peraturan perundang-undangan di Indonesia?"
    ]
  }
};

const welcomeMessage =
  "Halo, saya LegalMate System Intelligence. Saya siap membantu Anda memahami informasi hukum dengan penjelasan yang terstruktur dan mudah dipahami. Pilih Agent Assistant sesuai kebutuhan, lalu ajukan pertanyaan Anda. Saya memberikan informasi umum, bukan keputusan atau nasihat hukum profesional.";
const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const sendButton = document.getElementById("send-button");
const characterCount = document.getElementById("character-count");
const suggestionContainer = document.getElementById("suggestions");
const agentButtons = [...document.querySelectorAll(".agent-card")];
const topbarAgent = document.getElementById("topbar-agent");
const activeAgentName = document.getElementById("active-agent-name");
const configurationValues = {
  temperature: document.getElementById("config-temperature"),
  topP: document.getElementById("config-top-p"),
  topK: document.getElementById("config-top-k")
};

let activeMode = "consultant";
let isProcessing = false;

function currentTime() {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

function scrollToLatest() {
  chat.scrollTop = chat.scrollHeight;
}

function addMessage({ role, text, agentName, error = false, loading = false }) {
  const isUser = role === "user";
  const row = document.createElement("article");
  row.className = `message-row ${isUser ? "user-row" : "agent-row"}${error ? " is-error" : ""}`;

  if (loading) {
    row.dataset.loading = "true";
  }

  if (!isUser) {
    const avatar = document.createElement("span");
    avatar.className = "message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "LM";
    row.append(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";

  const meta = document.createElement("div");
  meta.className = "message-meta";
  const label = document.createElement("strong");
  label.textContent = isUser ? "Anda" : agentName || "Agent Assistant";
  const timestamp = document.createElement("time");
  timestamp.dateTime = new Date().toISOString();
  timestamp.textContent = currentTime();
  meta.append(label, timestamp);

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  if (loading) {
    const indicator = document.createElement("span");
    indicator.className = "typing-indicator";
    indicator.textContent = "Agent Assistant sedang memproses";
    const dots = document.createElement("span");
    dots.className = "typing-dots";
    dots.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 3; index += 1) {
      dots.append(document.createElement("span"));
    }
    indicator.append(dots);
    bubble.append(indicator);
  } else {
    bubble.textContent = text;
  }

  content.append(meta, bubble);
  row.append(content);
  chat.append(row);
  scrollToLatest();
  return row;
}

function updateAgent(mode) {
  activeMode = mode;
  const agent = agents[mode];

  for (const button of agentButtons) {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  topbarAgent.textContent = agent.name;
  activeAgentName.textContent = agent.name;
  configurationValues.temperature.textContent = agent.config.temperature.toFixed(1);
  configurationValues.topP.textContent = String(agent.config.topP);
  configurationValues.topK.textContent = String(agent.config.topK);
  const selectedAgentIcon = agentButtons
    .find((button) => button.dataset.mode === mode)
    .querySelector("svg");
  document.getElementById("active-agent-icon").replaceChildren(selectedAgentIcon.cloneNode(true));
  renderSuggestions(agent.suggestions);
}

function renderSuggestions(suggestions) {
  suggestionContainer.querySelectorAll(".suggestion-chip").forEach((chip) => chip.remove());

  for (const suggestion of suggestions) {
    const button = document.createElement("button");
    button.className = "suggestion-chip";
    button.type = "button";
    button.textContent = suggestion;
    button.disabled = isProcessing;
    suggestionContainer.append(button);
  }
}

function setProcessing(processing) {
  isProcessing = processing;
  input.disabled = processing;
  sendButton.disabled = processing || input.value.trim().length === 0;
  chat.setAttribute("aria-busy", String(processing));

  for (const button of agentButtons) {
    button.disabled = processing;
  }
  suggestionContainer.querySelectorAll(".suggestion-chip").forEach((button) => {
    button.disabled = processing;
  });
}

function updateComposer() {
  const length = input.value.length;
  characterCount.textContent = `${length} / 4000`;
  sendButton.disabled = isProcessing || input.value.trim().length === 0;
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message || isProcessing) {
    return;
  }

  addMessage({ role: "user", text: message });
  input.value = "";
  updateComposer();
  setProcessing(true);
  const loadingMessage = addMessage({ role: "agent", loading: true });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, mode: activeMode })
    });
    const data = await response.json();

    loadingMessage.remove();
    if (!response.ok || data.status !== "success" || typeof data.reply !== "string") {
      const messageText =
        typeof data.message === "string"
          ? data.message
          : "Permintaan belum dapat diproses. Silakan coba lagi.";
      addMessage({ role: "agent", agentName: "Agent Assistant", text: messageText, error: true });
      return;
    }

    addMessage({
      role: "agent",
      agentName: agents[activeMode].name,
      text: data.reply
    });
  } catch {
    loadingMessage.remove();
    addMessage({
      role: "agent",
      agentName: "Agent Assistant",
      text: "Tidak dapat terhubung ke System Intelligence saat ini. Periksa koneksi Anda, lalu coba lagi.",
      error: true
    });
  } finally {
    setProcessing(false);
    updateComposer();
    input.focus();
  }
}

agentButtons.forEach((button) => {
  button.addEventListener("click", () => updateAgent(button.dataset.mode));
});

suggestionContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".suggestion-chip");
  if (!button || isProcessing) {
    return;
  }
  input.value = button.textContent;
  updateComposer();
  input.focus();
});

input.addEventListener("input", updateComposer);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

addMessage({ role: "agent", agentName: "Agent Assistant", text: welcomeMessage });
updateAgent(activeMode);
updateComposer();
