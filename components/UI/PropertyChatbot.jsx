import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { submitChatbotLead } from "../helper/chatbotLead";
import {
  fetchChatbotProperties,
  fetchLocalities,
  fetchSuggestions,
  fetchPropertiesByLocality,
  BUDGET_OPTIONS,
} from "../helper/chatbotInventory";

/* ============================================================
   AI PROPERTY CHATBOT  —  Inframantra
   Short guided flow:
   greeting -> Buy/Rent (budget -> location -> live results)
            -> Talk to an agent (shows expert number)
   Lead capture: name -> phone -> email -> preferred time -> backend.
   ============================================================ */

const COMPANY = "Inframantra";
const AGENT_PHONE = "+91 86 9800 9900";
const AGENT_PHONE_TEL = "918698009900";

// ---- helpers -------------------------------------------------
const isValidName = (v) => /^[a-zA-Z][a-zA-Z\s.]{1,}$/.test((v || "").trim());

// Accept phone numbers with or without a country code, and with common
// separators like spaces, dashes and parentheses.
// e.g. "9876543210", "+91 98765 43210", "919876543210",
//      "+1 4155551234"
const isValidPhone = (v) => {
  const s = (v || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (/^[6-9]\d{9}$/.test(s)) return true; // 10-digit Indian mobile, no code
  if (/^91[6-9]\d{9}$/.test(s)) return true; // Indian mobile with 91 code
  return /^\d{10,15}$/.test(s); // generic international (E.164: up to 15 digits)
};

// Normalize for storage: keep a leading "+" only when a country code is given.
const normalizePhone = (v) => {
  const hasPlus = /^\s*\+/.test(v || "");
  const digits = (v || "").replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
};

const isValidEmail = (v) => /^\S+@\S+\.\S+$/.test((v || "").trim());

let _id = 0;
const nextId = () => ++_id;

// How many property cards to reveal per "Show more options" page.
const PAGE_SIZE = 3;

// localStorage keys for persisting the conversation.
const LS_HISTORY = "chatbot_history"; // readable transcript (sent as message)
const LS_MESSAGES = "chatbot_messages"; // raw messages (JSON)

// Build a readable transcript of the whole conversation.
function buildTranscript(msgs) {
  return (msgs || [])
    .map((m) => {
      if (m.type === "cards") {
        const names = (m.cards || [])
          .map((c) => `${c.name}${c.price ? ` (${c.price})` : ""}`)
          .join("; ");
        return `Bot: [Shared listings] ${names}`;
      }
      if (m.type === "agent") {
        return `Bot: ${m.text || ""} (shared expert phone number)`;
      }
      return `${m.from === "user" ? "User" : "Bot"}: ${m.text || ""}`;
    })
    .join("\n");
}

// Cities served — used for the location step on both paths.
const CITY_REPLIES = [
  { label: "Gurgaon", value: "Gurgaon" },
  { label: "Mohali", value: "Mohali" },
  { label: "Noida", value: "Noida" },
  { label: "Pune", value: "Pune" },
  { label: "Jaipur", value: "Jaipur" },
  { label: "Other (type below)", value: "__other__" },
];

const TIME_REPLIES = [
  { label: "Morning (9am – 12pm)", value: "Morning (9am - 12pm)" },
  { label: "Afternoon (12pm – 4pm)", value: "Afternoon (12pm - 4pm)" },
  { label: "Evening (4pm – 7pm)", value: "Evening (4pm - 7pm)" },
];

const INTENT_REPLIES = [
  { label: "Buy a property", value: "Buy a property" },
  { label: "🔎 Search properties", value: "Search properties" },
  { label: "Talk to an agent", value: "Talk to an agent" },
];

// Cities available for the city-wise search drill-down.
const SEARCH_CITIES = [
  { label: "Gurgaon", value: "Gurgaon" },
  { label: "Noida", value: "Noida" },
  { label: "Pune", value: "Pune" },
  { label: "Mohali", value: "Mohali" },
  { label: "Jaipur", value: "Jaipur" },
];

export default function PropertyChatbot() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [inputMode, setInputMode] = useState("disabled"); // disabled | text | phone | email
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const [showLabel, setShowLabel] = useState(true); // the "Need help?" launcher bubble

  // Keep the launcher bubble dismissed once the user closes it.
  useEffect(() => {
    try {
      if (localStorage.getItem("imbot_label_dismissed")) setShowLabel(false);
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Auto-hide the launcher bubble after a few seconds (non-persistent — a manual
  // close persists, but the timed hide lets it gently nudge again next visit).
  useEffect(() => {
    if (!showLabel) return undefined;
    const t = setTimeout(() => setShowLabel(false), 7000);
    return () => clearTimeout(t);
  }, [showLabel]);

  const dismissLabel = (e) => {
    e.stopPropagation();
    setShowLabel(false);
    try {
      localStorage.setItem("imbot_label_dismissed", "1");
    } catch (err) {
      /* ignore */
    }
  };

  const stepRef = useRef("greeting");
  const leadRef = useRef({});
  const scrollRef = useRef(null);
  const startedRef = useRef(false);
  const resultsRef = useRef({ list: [], page: 0, kind: "buy" });
  const messagesRef = useRef([]); // always-current copy for transcript building
  const searchRef = useRef({ city: "", localities: [], suggestions: [] });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, replies, busy]);

  // Persist the full conversation to localStorage.
  const persistHistory = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_HISTORY, buildTranscript(messagesRef.current));
      localStorage.setItem(LS_MESSAGES, JSON.stringify(messagesRef.current));
    } catch (e) {
      /* ignore quota / serialization errors */
    }
  };

  // ---- message primitives (keep messagesRef synchronous + persist) ----
  const appendMsg = (msg) => {
    messagesRef.current = [...messagesRef.current, msg];
    setMessages(messagesRef.current);
    persistHistory();
  };

  const pushUser = (text) =>
    appendMsg({ id: nextId(), from: "user", type: "text", text });

  const pushBotNow = (msg) => appendMsg({ id: nextId(), from: "bot", ...msg });

  const botSay = (payload, delay = 550) => {
    const items = Array.isArray(payload) ? payload : [payload];
    setReplies([]);
    setTyping(true);
    let i = 0;
    const emit = () => {
      const item = items[i];
      const msg = typeof item === "string" ? { type: "text", text: item } : item;
      pushBotNow(msg);
      i += 1;
      if (i < items.length) {
        setTimeout(emit, 450);
      } else {
        setTyping(false);
        if (!open) setUnread(true);
      }
    };
    setTimeout(emit, delay);
  };

  const setControls = ({ replies: r = [], input = "disabled" } = {}) => {
    setReplies(r);
    setInputMode(input);
    setInputValue("");
  };

  const goto = (step) => {
    stepRef.current = step;
    enterStep(step);
  };

  function enterStep(step) {
    switch (step) {
      case "greeting":
        botSay(
          `Hi there! 👋 Welcome to ${COMPANY}. I'm here to help you find your perfect property. How can I assist you today?`
        );
        setControls({ input: "disabled", replies: INTENT_REPLIES });
        break;

      /* ---------------- BUY ---------------- */
      case "A1":
        botSay("Great! Let's find you the right home. What is your approximate budget?");
        setControls({ replies: BUDGET_OPTIONS });
        break;

      case "A2":
        botSay("Which city are you looking in?");
        setControls({ input: "text", replies: CITY_REPLIES });
        break;

      case "A5":
        showResults("buy");
        break;

      /* ---------------- RENT ---------------- */
      case "B2":
        botSay("Sure! What is your monthly rental budget?");
        setControls({
          replies: [
            { label: "Under ₹10,000", value: "Under ₹10,000" },
            { label: "₹10k – ₹20k", value: "₹10k - ₹20k" },
            { label: "₹20k – ₹40k", value: "₹20k - ₹40k" },
            { label: "Above ₹40k", value: "Above ₹40k" },
          ],
        });
        break;

      case "B3":
        botSay("Which city are you looking in?");
        setControls({ input: "text", replies: CITY_REPLIES });
        break;

      case "B5":
        showResults("rent");
        break;

      /* ---------------- SEARCH PROPERTIES ---------------- */
      case "S_city":
        botSay("Which city would you like to explore?");
        setControls({
          replies: [
            ...SEARCH_CITIES,
            { label: "🔎 Search by name / locality", value: "__suggest__" },
          ],
        });
        break;

      case "S_suggest":
        botSay("Type a property name, locality or city to search:");
        setControls({ input: "text" });
        break;

      /* ---------------- TALK TO AGENT ---------------- */
      case "C_agent":
        botSay([
          "Happy to connect you with our property expert! 🤝",
          {
            type: "agent",
            text: `You can call us directly at`,
          },
        ]);
        setControls({
          replies: [
            { label: "Request a callback", value: "__callback__" },
            { label: "I'll call now", value: "__done__" },
          ],
        });
        break;

      /* ---------------- LEAD CAPTURE ---------------- */
      case "LC_name":
        botSay("Awesome! May I know your name so our property expert can assist you?");
        setControls({ input: "text" });
        break;

      case "LC_phone":
        botSay(
          `Thanks, ${leadRef.current.name || "there"}! What's the best phone number to reach you on?`
        );
        setControls({ input: "phone" });
        break;

      case "LC_email":
        botSay("Great! And your email address? (We'll share matching options here.)");
        setControls({ input: "email" });
        break;

      case "LC_time":
        botSay("Perfect! What's the best time for our expert to call you?");
        setControls({ replies: TIME_REPLIES });
        break;

      case "LC_confirm":
        confirmLead();
        break;

      case "done":
        botSay(
          `Is there anything else I can help you with? For any other queries, you can also reach our expert directly at 📞 ${AGENT_PHONE}.`
        );
        setControls({
          replies: [...INTENT_REPLIES, { label: "Start over", value: "__restart__" }],
        });
        break;

      default:
        break;
    }
  }

  // ---- results (live inventory, ordered + paged) ----
  async function showResults(kind) {
    botSay(
      kind === "buy"
        ? "Here are some properties that match your requirements:"
        : "Here are some rentals available that match:"
    );
    setControls({ input: "disabled" });
    setBusy(true);

    const list = await fetchChatbotProperties({
      budget: leadRef.current.budget,
      location: leadRef.current.location,
    });

    setBusy(false);

    resultsRef.current = { list, page: 0, kind };

    if (list.length === 0) {
      pushBotNow({
        type: "text",
        text: "I couldn't find live listings for that selection right now, but our property expert can share the best matching options with you directly.",
      });
      botSay("Would you like us to get in touch?", 300);
      setControls({
        replies: [
          { label: "Yes, contact me", value: "__lead__" },
          { label: "Talk to an agent", value: "__agent__" },
        ],
      });
      return;
    }

    renderResultsPage(300);
  }

  // Render the current results page (sorted by `order`) and the action chips.
  function renderResultsPage(delay = 0) {
    const { list, page, kind } = resultsRef.current;
    const start = page * PAGE_SIZE;
    const cards = list.slice(start, start + PAGE_SIZE);
    const hasMore = start + PAGE_SIZE < list.length;

    pushBotNow({ type: "cards", cards });

    const moreLabel = kind === "buy" ? "See other options" : "Show more options";
    const replies = [
      {
        label: kind === "buy" ? "Book a site visit" : "Schedule a visit",
        value: "__lead_visit__",
      },
      { label: "Get more details", value: "__lead_details__" },
    ];
    if (hasMore) replies.push({ label: moreLabel, value: "__more__" });

    botSay("Would you like to take the next step?", delay);
    setControls({ replies });
  }

  // ---- search: city -> locality -> properties ----
  async function chooseCity(city) {
    searchRef.current = { city, localities: [], suggestions: [] };
    leadRef.current.location = city;
    botSay(`Let me pull up localities in ${city}…`);
    setControls({ input: "disabled" });
    setBusy(true);

    const localities = await fetchLocalities(city);
    searchRef.current.localities = localities;
    setBusy(false);

    if (localities.length === 0) {
      // No localities — just show all city properties.
      showSearchResults(await fetchPropertiesByLocality(city), city);
      return;
    }

    const chips = localities.slice(0, 10).map((l) => ({
      label: l.name,
      value: `loc::${l.name}`,
    }));
    chips.push({ label: `All of ${city}`, value: "__allcity__" });

    botSay(`Choose a locality in ${city}:`, 300);
    stepRef.current = "S_locality";
    setControls({ replies: chips });
  }

  async function showLocalityResults(localityName) {
    const { city } = searchRef.current;
    botSay(
      localityName
        ? `Here are properties in ${localityName}, ${city}:`
        : `Here are properties in ${city}:`
    );
    setControls({ input: "disabled" });
    setBusy(true);
    const list = await fetchPropertiesByLocality(city, localityName);
    setBusy(false);
    showSearchResults(list, localityName ? `${localityName}, ${city}` : city);
  }

  // Free-text search via /suggest.
  async function runSuggest(query) {
    botSay(`Searching for "${query}"…`);
    setControls({ input: "disabled" });
    setBusy(true);
    const suggestions = await fetchSuggestions(query);
    searchRef.current.suggestions = suggestions;
    setBusy(false);

    if (suggestions.length === 0) {
      botSay("No matches found. Try a different city, locality or project name.", 250);
      stepRef.current = "S_suggest";
      setControls({ input: "text" });
      return;
    }

    const chips = suggestions.slice(0, 8).map((s, i) => ({
      label: s.title,
      value: `sg::${i}`,
    }));
    botSay("Here's what I found — pick one:", 250);
    stepRef.current = "S_pick";
    setControls({ replies: chips });
  }

  async function handleSuggestion(s) {
    if (!s) return;
    // Direct property hit — show it as a single card.
    if (s.type === "property" && s.slug) {
      const card = {
        id: s.slug,
        slug: s.slug,
        name: s.title,
        image: "",
        location: "",
        price: "View details",
        config: "",
        order: 0,
      };
      showSearchResults([card], s.title);
      return;
    }
    // Locality / sub-locality / city / state — title looks like "Area, City".
    const parts = (s.title || "").split(",").map((p) => p.trim());
    const place = parts[0] || "";
    const city = parts[1] || parts[0] || "";
    searchRef.current.city = city;
    leadRef.current.location = city;
    botSay(`Showing properties in ${s.title}…`);
    setControls({ input: "disabled" });
    setBusy(true);
    const list =
      s.type === "city" || s.type === "state"
        ? await fetchPropertiesByLocality(city)
        : await fetchPropertiesByLocality(city, place);
    setBusy(false);
    showSearchResults(list, s.title);
  }

  // Shared: render a search result set, reusing the buy results actions/paging.
  function showSearchResults(list, contextLabel) {
    resultsRef.current = { list, page: 0, kind: "buy" };
    leadRef.current.intent = leadRef.current.intent || "Buy a property";
    stepRef.current = "A5"; // reuse A5 result-action handlers (lead capture + paging)

    if (!list || list.length === 0) {
      pushBotNow({
        type: "text",
        text: `I couldn't find live listings for ${contextLabel} right now, but our property expert can help directly.`,
      });
      botSay("Would you like us to get in touch?", 300);
      setControls({
        replies: [
          { label: "Yes, contact me", value: "__lead__" },
          { label: "Talk to an agent", value: "__agent__" },
        ],
      });
      return;
    }
    renderResultsPage(300);
  }

  // ---- confirm + backend ----
  async function confirmLead() {
    setControls({ input: "disabled" });
    setBusy(true);
    // Attach the full chat transcript — sent to the backend as message: history.
    leadRef.current.history = buildTranscript(messagesRef.current);
    const ok = await submitChatbotLead(leadRef.current);
    setBusy(false);

    const { name, phone, callTime } = leadRef.current;
    if (ok) {
      botSay(
        `Thank you, ${name}! ✅ Our property expert will call you at ${phone}${
          callTime ? ` during ${callTime}` : ""
        }. We look forward to speaking with you!`
      );
    } else {
      botSay(
        `Thanks, ${name}! We've noted your details and our expert will reach out at ${phone}. If it's urgent, call us at ${AGENT_PHONE}.`
      );
    }
    setTimeout(() => goto("done"), 800);
  }

  // ---- quick reply handler ----
  function handleReply(reply) {
    const step = stepRef.current;
    const { value, label } = reply;

    if (value === "__restart__") {
      resetConversation();
      return;
    }
    if (value === "__done__") {
      pushUser(label);
      goto("done");
      return;
    }
    if (value === "__other__") {
      pushUser(label);
      botSay("Sure — please type the city/area you're looking in below. 👇", 250);
      setInputMode("text");
      return;
    }

    pushUser(label);

    // greeting + done share the intent buttons
    if (step === "greeting" || step === "done") {
      if (value === "Buy a property") {
        leadRef.current = { intent: "Buy a property" };
        goto("A1");
      } else if (value === "Rent / PG") {
        leadRef.current = { intent: "Rent / PG" };
        goto("B2");
      } else if (value === "Search properties") {
        leadRef.current = { intent: "Buy a property" };
        goto("S_city");
      } else if (value === "Talk to an agent") {
        leadRef.current = { intent: "Talk to an agent" };
        goto("C_agent");
      }
      return;
    }

    switch (step) {
      case "S_city":
        if (value === "__suggest__") goto("S_suggest");
        else chooseCity(value);
        return;

      case "S_locality":
        if (value === "__allcity__") showLocalityResults(null);
        else if (value.startsWith("loc::")) showLocalityResults(value.slice(5));
        return;

      case "S_pick":
        if (value.startsWith("sg::")) {
          const idx = parseInt(value.slice(4), 10);
          handleSuggestion(searchRef.current.suggestions[idx]);
        }
        return;

      case "A1":
        leadRef.current.budget = value;
        goto("A2");
        return;
      case "A2":
        leadRef.current.location = value;
        goto("A5");
        return;

      case "B2":
        leadRef.current.budget = value;
        goto("B3");
        return;
      case "B3":
        leadRef.current.location = value;
        goto("B5");
        return;

      case "C_agent":
        if (value === "__callback__") goto("LC_name");
        return;

      case "LC_time":
        leadRef.current.callTime = value;
        goto("LC_confirm");
        return;

      case "A5":
      case "B5":
        if (value === "__lead_visit__") {
          leadRef.current.subIntent = "Site visit";
          goto("LC_name");
        } else if (value === "__lead_details__") {
          leadRef.current.subIntent = "More details";
          goto("LC_name");
        } else if (value === "__lead__") {
          goto("LC_name");
        } else if (value === "__agent__") {
          leadRef.current.intent = "Talk to an agent";
          goto("C_agent");
        } else if (value === "__more__") {
          // Page forward through the ordered list (no re-fetch).
          resultsRef.current.page += 1;
          renderResultsPage(250);
        }
        return;

      default:
        return;
    }
  }

  // ---- free-text / typed input handler ----
  function handleSend() {
    const raw = inputValue.trim();
    if (!raw || busy || typing) return;
    const step = stepRef.current;

    if (inputMode === "phone") {
      if (!isValidPhone(raw)) {
        pushUser(raw);
        botSay(
          "That doesn't look like a valid mobile number. Please enter a 10-digit number (with or without country code, e.g. +91 9876543210). 📱",
          250
        );
        setInputValue("");
        return;
      }
      const phone = normalizePhone(raw);
      pushUser(phone);
      leadRef.current.phone = phone;
      setInputValue("");
      goto("LC_email");
      return;
    }

    if (inputMode === "email" || step === "LC_email") {
      if (!isValidEmail(raw)) {
        pushUser(raw);
        botSay("Please enter a valid email address (e.g. name@example.com). ✉️", 250);
        setInputValue("");
        return;
      }
      pushUser(raw);
      leadRef.current.email = raw;
      setInputValue("");
      goto("LC_time");
      return;
    }

    if (step === "LC_name") {
      if (!isValidName(raw)) {
        pushUser(raw);
        botSay("Please enter a valid name (letters only) so we can address you correctly. 🙂", 250);
        setInputValue("");
        return;
      }
      pushUser(raw);
      leadRef.current.name = raw;
      setInputValue("");
      goto("LC_phone");
      return;
    }

    if (step === "S_suggest") {
      pushUser(raw);
      setInputValue("");
      runSuggest(raw);
      return;
    }

    if (step === "A2" || step === "B3") {
      pushUser(raw);
      leadRef.current.location = raw;
      setInputValue("");
      goto(step === "A2" ? "A5" : "B5");
      return;
    }

    pushUser(raw);
    setInputValue("");
    botSay("Sorry, I didn't quite get that. Please use the options above. 🙂", 250);
  }

  const openProperty = (card) => {
    if (card?.slug) {
      window.open(`/property/${card.slug}`, "_blank", "noopener,noreferrer");
    }
    leadRef.current.selectedProject = card?.name;
  };

  function resetConversation() {
    messagesRef.current = [];
    setMessages([]);
    persistHistory();
    leadRef.current = {};
    stepRef.current = "greeting";
    _id = 0;
    enterStep("greeting");
  }

  const handleOpen = () => {
    setOpen(true);
    setUnread(false);
    if (!startedRef.current) {
      startedRef.current = true;
      enterStep("greeting");
    }
  };

  return (
    <>
      {!open && (
        <div className="imbot-launch-wrap">
          {showLabel && (
            <div
              className="imbot-launch-label"
              role="button"
              tabIndex={0}
              aria-label="Chat with our AI assistant"
              onClick={handleOpen}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
            >
              <button
                className="imbot-label-close"
                aria-label="Dismiss message"
                onClick={dismissLabel}
              >
                ×
              </button>
              <strong>Need help finding a home?</strong>
              <span>Chat with our AI assistant 👋</span>
            </div>
          )}
          <button className="imbot-launcher" aria-label="Chat with our AI assistant" onClick={handleOpen}>
            <span className="imbot-online" />
            <svg className="imbot-boticon" viewBox="0 0 32 32" width="32" height="32" fill="none">
              {/* antenna */}
              <line x1="16" y1="4.2" x2="16" y2="8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="3.2" r="1.9" fill="#fff" />
              {/* ears */}
              <rect x="3.4" y="13" width="2.6" height="6" rx="1.3" fill="#fff" />
              <rect x="26" y="13" width="2.6" height="6" rx="1.3" fill="#fff" />
              {/* head */}
              <rect x="6" y="8" width="20" height="16" rx="6" fill="#fff" />
              {/* eyes */}
              <circle cx="12" cy="15" r="2" fill="#b8821f" />
              <circle cx="20" cy="15" r="2" fill="#b8821f" />
              {/* smile */}
              <path d="M11.5 19 Q16 22 20.5 19" stroke="#b8821f" strokeWidth="1.9" fill="none" strokeLinecap="round" />
            </svg>
            {unread && <span className="imbot-dot" />}
          </button>
        </div>
      )}

      {open && (
        <div className="imbot-window" role="dialog" aria-label="Property assistant">
          <div className="imbot-header">
            <div className="imbot-avatar">
              <svg className="imbot-avatar-bot" viewBox="0 0 32 32" width="24" height="24" fill="none">
                <line x1="16" y1="4.2" x2="16" y2="8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="3.2" r="1.9" fill="#fff" />
                <rect x="3.4" y="13" width="2.6" height="6" rx="1.3" fill="#fff" />
                <rect x="26" y="13" width="2.6" height="6" rx="1.3" fill="#fff" />
                <rect x="6" y="8" width="20" height="16" rx="6" fill="#fff" />
                <circle cx="12" cy="15" r="2" fill="#1f2a44" />
                <circle cx="20" cy="15" r="2" fill="#1f2a44" />
                <path d="M11.5 19 Q16 22 20.5 19" stroke="#1f2a44" strokeWidth="1.9" fill="none" strokeLinecap="round" />
              </svg>
              <span className="imbot-avatar-dot" />
            </div>
            <div className="imbot-hwrap">
              <strong>{COMPANY} Assistant</strong>
              <span className="imbot-status">
                <i /> Typically replies instantly
              </span>
            </div>
            <button
              className="imbot-restart"
              aria-label="Start conversation again"
              title="Start over"
              onClick={resetConversation}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button className="imbot-close" aria-label="Close chat" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="imbot-body" ref={scrollRef}>
            {messages.map((m) => {
              if (m.type === "cards") {
                return (
                  <div className="imbot-cards" key={m.id}>
                    {m.cards.map((c) => (
                      <div className="imbot-card" key={c.id}>
                        {c.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.image} alt={c.name} className="imbot-card-img" />
                        ) : null}
                        <div className="imbot-card-body">
                          <div className="imbot-card-name">{c.name}</div>
                          {c.location && <div className="imbot-card-loc">📍 {c.location}</div>}
                          <div className="imbot-card-meta">
                            {c.config && <span>{c.config}</span>}
                            <span className="imbot-card-price">{c.price}</span>
                          </div>
                          <button className="imbot-card-btn" onClick={() => openProperty(c)}>
                            Know more
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              if (m.type === "agent") {
                return (
                  <div key={m.id} className="imbot-row bot">
                    <div className="imbot-bubble bot imbot-agentcard">
                      <span>{m.text}</span>
                      <a className="imbot-callbtn" href={`tel:${AGENT_PHONE_TEL}`}>
                        📞 {AGENT_PHONE}
                      </a>
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className={`imbot-row ${m.from}`}>
                  <div className={`imbot-bubble ${m.from}`}>{m.text}</div>
                </div>
              );
            })}

            {(typing || busy) && (
              <div className="imbot-row bot">
                <div className="imbot-bubble bot imbot-typing">
                  <span /> <span /> <span />
                </div>
              </div>
            )}

            {!typing && !busy && replies.length > 0 && (
              <div className="imbot-replies">
                {replies.map((r) => (
                  <button
                    key={r.value + r.label}
                    className="imbot-chip"
                    onClick={() => handleReply(r)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="imbot-input">
            <input
              type={inputMode === "phone" ? "tel" : inputMode === "email" ? "email" : "text"}
              placeholder={
                inputMode === "disabled"
                  ? "Please pick an option above…"
                  : inputMode === "phone"
                  ? "Phone (with or without country code)"
                  : inputMode === "email"
                  ? "Enter your email"
                  : "Type your message…"
              }
              value={inputValue}
              disabled={inputMode === "disabled" || busy}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="imbot-send"
              onClick={handleSend}
              disabled={inputMode === "disabled" || busy || !inputValue.trim()}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .imbot-launch-wrap {
          position: fixed;
          /* Sit clear of the site's floating call/WhatsApp buttons
             (right:8px, bottom:25px & 85px) on desktop. */
          right: 13px;
          bottom: 155px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 99998;
          /* gentle up/down float */
          animation: imbot-float 2.8s ease-in-out infinite;
        }
        .imbot-launch-label {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          gap: 1px;
          background: #ffffff;
          border: none;
          padding: 9px 14px;
          border-radius: 14px;
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          max-width: 210px;
          font-family: 'Lexend Deca', Arial, sans-serif;
          animation: imbot-label-in 0.45s ease both;
          animation-delay: 0.4s;
          opacity: 0;
        }
        .imbot-launch-label strong {
          font-size: 13px;
          font-weight: 700;
          color: #1f2a44;
          line-height: 1.25;
          white-space: nowrap;
        }
        .imbot-launch-label span {
          font-size: 11px;
          color: #6b7280;
          white-space: nowrap;
        }
        /* little tail pointing at the button */
        .imbot-launch-label::after {
          content: "";
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border: 7px solid transparent;
          border-left-color: #ffffff;
        }
        .imbot-label-close {
          position: absolute;
          top: -9px;
          right: -9px;
          width: 20px;
          height: 20px;
          padding: 0;
          border-radius: 50%;
          background: #1f2a44;
          color: #fff;
          border: 2px solid #fff;
          font-size: 14px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          z-index: 2;
        }
        .imbot-label-close:hover {
          background: #33415f;
        }
        .imbot-launcher {
          position: relative;
          flex: 0 0 auto;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.55);
          background: radial-gradient(circle at 32% 28%, #ffd97a 0%, #e6ac38 42%, #c98c1f 78%, #a9760f 100%);
          box-shadow: 0 10px 26px rgba(184, 130, 31, 0.5),
            0 4px 10px rgba(0, 0, 0, 0.28),
            inset 0 2px 4px rgba(255, 255, 255, 0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* "online" green dot on the launcher */
        .imbot-online {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #fff;
          z-index: 2;
        }
        /* pulsing ring */
        .imbot-launcher::after {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          border: 2px solid rgba(214, 157, 46, 0.65);
          animation: imbot-ring 2.2s ease-out infinite;
          pointer-events: none;
        }
        /* soft outer glow */
        .imbot-launcher::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(214, 157, 46, 0.45) 0%, rgba(214, 157, 46, 0) 70%);
          animation: imbot-glow 2.8s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }
        .imbot-launcher:hover {
          filter: brightness(1.07);
          box-shadow: 0 14px 32px rgba(184, 130, 31, 0.6),
            0 6px 14px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.5);
        }
        .imbot-launcher svg {
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18));
        }
        .imbot-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 12px;
          height: 12px;
          background: #ff3b3b;
          border-radius: 50%;
          border: 2px solid #fff;
        }
        .imbot-window {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 370px;
          max-width: calc(100vw - 24px);
          height: 560px;
          max-height: calc(100vh - 40px);
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 99999;
          font-family: 'Lexend Deca', Arial, Helvetica, sans-serif;
          animation: imbot-pop 0.25s ease;
        }
        .imbot-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 14px;
          background: linear-gradient(135deg, #17171c 0%, #0a0a0c 100%);
          border-bottom: 2px solid #e7b554;
          color: #fff;
        }
        .imbot-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 28%, #ffd97a 0%, #e6ac38 55%, #c98c1f 100%);
          box-shadow: 0 2px 7px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .imbot-avatar-bot {
          animation: imbot-bob 2.6s ease-in-out infinite;
        }
        .imbot-avatar-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #fff;
        }
        .imbot-hwrap {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
          flex: 1;
        }
        .imbot-hwrap strong {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .imbot-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          opacity: 0.9;
        }
        .imbot-status i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a5f3c0;
          display: inline-block;
          animation: imbot-pulse-dot 1.8s ease-out infinite;
        }
        @keyframes imbot-bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        @keyframes imbot-pulse-dot {
          0% {
            box-shadow: 0 0 0 0 rgba(165, 243, 192, 0.6);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(165, 243, 192, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(165, 243, 192, 0);
          }
        }
        .imbot-restart {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          opacity: 0.85;
        }
        .imbot-restart:hover {
          opacity: 1;
          transform: rotate(-45deg);
          transition: transform 0.2s ease;
        }
        .imbot-close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          padding: 0 4px;
        }
        .imbot-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          background: #f3f4f7;
        }
        .imbot-row {
          display: flex;
          margin-bottom: 8px;
        }
        .imbot-row.user {
          justify-content: flex-end;
        }
        .imbot-bubble {
          max-width: 80%;
          padding: 9px 13px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.45;
          white-space: pre-line;
          word-wrap: break-word;
        }
        .imbot-bubble.bot {
          background: #fff;
          color: #1f2937;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
        .imbot-bubble.user {
          background: #DCAA4C;
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .imbot-agentcard {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .imbot-callbtn {
          display: inline-block;
          background: #25d366;
          color: #fff;
          text-decoration: none;
          padding: 9px 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 14px;
          text-align: center;
        }
        .imbot-typing {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .imbot-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #b8bcc6;
          display: inline-block;
          animation: imbot-blink 1.2s infinite both;
        }
        .imbot-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .imbot-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }
        .imbot-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
          justify-content: flex-end;
        }
        .imbot-chip {
          background: #fff;
          border: 1.5px solid #DCAA4C;
          color: #b8821f;
          padding: 7px 13px;
          border-radius: 18px;
          font-size: 12.5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        .imbot-chip:hover {
          background: #DCAA4C;
          color: #fff;
        }
        .imbot-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 8px;
        }
        .imbot-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .imbot-card-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          display: block;
        }
        .imbot-card-body {
          padding: 10px 12px;
        }
        .imbot-card-name {
          font-weight: 700;
          font-size: 14px;
          color: #1f2937;
        }
        .imbot-card-loc {
          font-size: 12px;
          color: #6b7280;
          margin: 3px 0;
        }
        .imbot-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #374151;
          margin: 6px 0 8px;
        }
        .imbot-card-price {
          color: #DCAA4C;
          font-weight: 700;
        }
        .imbot-card-btn {
          width: 100%;
          background: #1f2a44;
          color: #fff;
          border: none;
          padding: 8px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .imbot-card-btn:hover {
          background: #2c3e63;
        }
        .imbot-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid #e5e7eb;
          background: #fff;
        }
        .imbot-input input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 20px;
          padding: 9px 14px;
          font-size: 13.5px;
          outline: none;
        }
        .imbot-input input:focus {
          border-color: #DCAA4C;
        }
        .imbot-input input:disabled {
          background: #f3f4f6;
        }
        .imbot-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #DCAA4C;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .imbot-send:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        @keyframes imbot-pop {
          from {
            transform: scale(0.85);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes imbot-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes imbot-ring {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        @keyframes imbot-glow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.12);
          }
        }
        @keyframes imbot-blink {
          0%,
          80%,
          100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
        @keyframes imbot-label-in {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .imbot-launch-wrap {
            animation: none;
          }
          .imbot-launch-label {
            animation: none;
            opacity: 1;
          }
        }
        @media (max-width: 480px) {
          .imbot-window {
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
          }
          .imbot-launch-wrap {
            /* Above the full-width bottom CTA bar (bottom:0) on mobile. */
            right: 12px;
            bottom: 72px;
          }
          /* Space is tight on phones — show just the button. */
          .imbot-launch-label {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
