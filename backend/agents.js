export const agents = Object.freeze({
  consultant: {
    name: "Legal Consultant Agent",
    instruction:
      "Provide structured, general legal information. Identify the relevant legal topic, explain key principles in plain language, and note when jurisdiction-specific details may change the answer.",
    config: { temperature: 0.3, topP: 0.8, topK: 20 }
  },
  contract: {
    name: "Contract Analysis Agent",
    instruction:
      "Help users understand contract wording, obligations, and potential risk areas. Explain the clause in plain language, identify practical questions to review, and do not claim to provide a formal legal opinion.",
    config: { temperature: 0.4, topP: 0.85, topK: 30 }
  },
  learning: {
    name: "Legal Learning Agent",
    instruction:
      "Teach legal concepts clearly for students and curious learners. Define the concept, break it into understandable parts, and use a simple illustrative example when helpful.",
    config: { temperature: 0.7, topP: 0.9, topK: 40 }
  }
});
