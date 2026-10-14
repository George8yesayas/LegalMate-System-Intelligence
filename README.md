# ⚖️ LegalMate System Intelligence

### Intelligent Legal Assistance System Powered by Gemini Technology

[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=111111)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Technology-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/gemini-api)
[![MIT License](https://img.shields.io/badge/License-MIT-D4AF37)](./LICENSE)

**LegalMate System Intelligence** is a Gemini-powered legal information and learning system built around a multi-agent architecture. Users can choose a specialized Agent Assistant for general legal consultation, contract analysis, or learning legal concepts, then ask questions in natural language. System Intelligence returns structured explanations to help users understand a topic and decide what to explore next.

The project demonstrates how Gemini Technology can support approachable legal education and information discovery without replacing a qualified legal professional.

## Project Overview

Legal rules and contracts can be difficult to understand because of dense terminology, unfamiliar concepts, and the context needed to interpret legal information. LegalMate offers a focused place to start: users select an Agent Assistant, submit a question, and receive an explanation tailored to that purpose.

The backend combines shared System Instructions with the selected agent's specialist guidance and Gemini model parameters. Responses are in Indonesian by default and explain uncertainty and limitations. The application is an educational and informational tool, not a source of final legal decisions.

## Features

- **Multi-agent architecture:** Three Agent Assistants focused on distinct legal tasks.
- **Gemini Technology integration:** Uses `gemini-2.5-flash` through Google's `@google/genai` SDK.
- **System Instructions:** Shared guidance for professional, structured answers and clear legal limitations.
- **Specialist model parameters:** Each agent has its own `temperature`, `topP`, and `topK` settings.
- **Premium legal dashboard:** Responsive interface with active-agent status, visible parameters, suggested questions, timestamps, and processing feedback.
- **Validated API:** Checks incoming questions and agent modes, returns structured error responses, and keeps the Gemini credential on the server.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Backend | Node.js, Express.js |
| Intelligence engine | Gemini Technology (`gemini-2.5-flash`, `@google/genai`) |
| Environment configuration | dotenv |

No frontend framework or build step is required.

## System Architecture

![LegalMate System Intelligence architecture diagram](screenshots/architecture.png)

The Express backend serves the browser interface and handles `POST /api/chat`. It validates the request, selects the appropriate Agent Assistant configuration, builds the Gemini request using shared and agent-specific instructions, then returns the response to the interface.

## Agent Assistant Explanation

| Agent Assistant | Purpose | Temperature | Top P | Top K | Response characteristics |
| --- | --- | ---: | ---: | ---: | --- |
| **Agent Konsultan Hukum** | General legal information assistance. | 0.3 | 0.8 | 20 | Precise, structured explanations of general principles, with attention to jurisdiction and context. |
| **Agent Analisis Kontrak** | Contract clause understanding and risk explanation. | 0.4 | 0.85 | 30 | Plain-language explanations of clauses, obligations, and potential risks to review. |
| **Agent Pembelajaran Hukum** | Legal learning and concept explanation. | 0.7 | 0.9 | 40 | Accessible teaching that breaks concepts into key ideas and examples when helpful. |

Agent-specific instructions and parameter values are defined in `backend/agents.js`. Shared identity, language, tone, and legal limitations are defined in `backend/config.js`.

## Installation Guide

### Requirements

- Git
- Node.js 20 or later and npm
- A Gemini API key for live Agent Assistant responses

### Clone and install

```bash
git clone https://github.com/George8yesayas/LegalMate-System-Intelligence.git
cd LegalMate-System-Intelligence/backend
npm install
```

## Environment Configuration

Create a local `backend/.env` from the example file:

**PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Set your local values in `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Never commit or share the real `.env` file. It is excluded by `.gitignore`. The template `backend/.env.example` is safe to keep in the repository.

## Usage Guide

From the `backend/` directory, start the application:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000), choose an Agent Assistant, and enter a legal question. Suggested questions are available for each agent. The service health endpoint is [http://localhost:3000/api/health](http://localhost:3000/api/health). Stop the server with `Ctrl+C`.

### Screenshots

The architecture diagram is available at [`screenshots/architecture.png`](screenshots/architecture.png). To complete the interface gallery, run the system with a valid key, wait for an Agent Assistant response, and replace each screenshot placeholder with the captured image:

| Screenshot | Description |
| --- | --- |
| Landing Page — `screenshots/landing-page.png` | Initial dashboard and welcome message |
| Agent Konsultan Hukum — `screenshots/consultant-agent.png` | General legal information conversation |
| Agent Analisis Kontrak — `screenshots/contract-agent.png` | Contract clause or risk explanation |
| Agent Pembelajaran Hukum — `screenshots/learning-agent.png` | Legal concept learning conversation |
| Architecture Diagram — `screenshots/architecture.png` | System component flow and Gemini integration |

See [`screenshots/README.md`](screenshots/README.md) for capture guidance. Use sample content only; do not include API keys, personal information, or confidential contract text.

## Legal Disclaimer

LegalMate System Intelligence provides general legal information and educational assistance only. It does not provide a final legal decision or formal legal opinion and does not replace professional legal consultation. Laws and procedures vary by jurisdiction and context. Consult a qualified legal professional about a specific matter.

## Creator

### Creator Profile

**Developed by:**<br>
George Yesayas, S.Com., S.H.

**Role:**<br>
System Intelligence Developer

**Project:**<br>
AI & Legal Technology Project<br>
Hacktiv8 Final Submission

## License

This project is distributed under the [MIT License](LICENSE). Copyright © 2026 George Yesayas, S.Kom., S.H.
