import Ajax1 from "./Ajax1";



const LABELS = {
  intent: "Looking to",
  propertyType: "Property type",
  budget: "Budget",
  location: "Location",
  possession: "Possession",
  moveIn: "Move-in",
  callTime: "Preferred call time",
  selectedProject: "Interested in",
};

const buildMessage = (lead) => {
  const lines = [];

  Object.keys(LABELS).forEach((key) => {
    const value = lead[key];
    if (value) lines.push(`${LABELS[key]}: ${value}`);
  });

  // Surface a clear handle on where the lead came from.
  lines.unshift("Source: AI Website Chatbot");

  return lines.join("\n");
};

const buildProjectName = (lead) => {
  if (lead.selectedProject) return lead.selectedProject;

  switch (lead.intent) {
    case "Buy a property":
      return "AI Chatbot - Buy Enquiry";
    case "Rent / PG":
      return "AI Chatbot - Rent Enquiry";
    case "Talk to an agent":
      return "AI Chatbot - Callback Request";
    default:
      return "AI Chatbot Lead";
  }
};

/**
 * @param {Object} lead   accumulated chatbot answers
 * @returns {Promise<boolean>} true when the backend accepted the lead
 */
export async function submitChatbotLead(lead = {}) {
  // The full chat transcript (history) is sent as `message`. Fall back to the
  // structured summary if no history was captured.
  const history = (lead.history || "").trim();
  const message = history || buildMessage(lead);

  const payload = {
    name: (lead.name || "").trim(),
    phoneNumber: (lead.phone || "").trim(),
    email: (lead.email || "").trim(),
    projectName: buildProjectName(lead),
    message,
  };

  try {
    const response = await Ajax1({
      method: "POST",
      url: "/enquiry/project",
      data: payload,
      token: false,
    });

    return response?.data?.status === "success";
  } catch (error) {
    console.error("[Chatbot] lead submission failed:", error);
    return false;
  }
}

export default submitChatbotLead;
