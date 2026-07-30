// Design tokens
export const COLORS = {
  headerBlue: "#1B7FBF",
  headerTeal: "#2FC4CE",
  ink: "#1F2933",
  subtle: "#6B7684",
  hairline: "#111111",
  upcoming: "#2FC4CE",
  now: "#8DC63F",
  ended: "#D9D9D9",
  panelGrey: "#5A6470",
  mergedBg: "#FFFFFF",
  pageBg: "#F4F6F9",
  cardBg: "#FFFFFF",
  nowRowGlow: "#FFC400",
};

export const GRADIENT = `linear-gradient(135deg, ${COLORS.headerBlue}, ${COLORS.headerTeal})`;
export const CARD_SHADOW = "0 1px 4px rgba(16,24,40,0.06)";
export const CARD_SHADOW_LG = "0 8px 24px rgba(27,127,191,0.16)";
export const PILL_SHADOW = "0 2px 6px rgba(16,24,40,0.10)";

export const STATUS = ["upcoming", "now", "ended"];
export const STATUS_LABEL = { upcoming: "Upcoming", now: "Now", ended: "Ended" };
export const STATUS_COLOR = { upcoming: COLORS.upcoming, now: COLORS.now, ended: COLORS.ended };

export const STATUS_STYLE = {
  upcoming: { bg: "#E7F6F8", fg: "#0F8A9C" },
  now: { bg: "#DFF3CB", fg: "#4C7A1E" },
  ended: { bg: "#E4E6EA", fg: "#6B7684" },
};

// Schedule column order
export const TRACKS = ["Auditorium", "Baleh", "Baram", "Murum", "Bakun"];

export const TAG_LABEL = {
  E: "Electrical",
  M: "Mechanical",
  C: "Civil",
  TO: "Technical Others",
  CF: "Corporate Functions",
};

export const TAG_COLOR = {
  E: "#F04438",
  M: "#FF8A4C",
  C: "#FFD43B",
  TO: "#74C0FC",
  CF: "#B197FC",
};

export const TAG_BADGE_STYLE = {
  E: { bg: "#C92A2A", fg: "#FFE3E3" },
  M: { bg: "#D9480F", fg: "#FFE8CC" },
  C: { bg: "#B08900", fg: "#FFF9DB" },
  TO: { bg: "#1864AB", fg: "#D0EBFF" },
  CF: { bg: "#862E9C", fg: "#F3E8FF" },
};

// Every parallel block below is expressed as a start time plus a list of per-track bullet titles
// Each bullet = 30 minutes, so start/end times for every row are generated automatically instead of typed by hand
export function toMinutes(label) {
  const m = label.match(/(\d+):(\d+)(am|pm)/i);
  let [, h, min, ap] = m;
  h = parseInt(h, 10);
  min = parseInt(min, 10);
  if (ap.toLowerCase() === "pm" && h !== 12) h += 12;
  if (ap.toLowerCase() === "am" && h === 12) h = 0;
  return h * 60 + min;
}

function toLabel(mins) {
  let h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ap = h >= 12 ? "pm" : "am";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, "0")}${ap}`;
}

// Full-width banner items
const MERGED_ITEMS = [
  { id: "m-arrival", start: "8:00am", end: "9:00am", title: "Arrival and Registration" },
  { id: "m-briefing", start: "9:00am", end: "9:15am", title: "Safety Briefing & Opening Speech by Group COO" },
  { id: "m-photo", start: "9:15am", end: "9:30am", title: "Group Photo" },
];

const MIDDAY = { id: "m-lunch", start: "12:00pm", end: "2:00pm", title: "Lunch at Batang Ai room" };

const CLOSING_ITEMS = [
  { id: "m-aivision", start: "3:00pm", end: "3:30pm", title: "AI Vision Empowered Robotic Dog for Substation Inspection & Monitoring", tag: "TO" },
  { id: "m-drone", start: "3:30pm", end: "4:00pm", title: "From Drone Footage to Decisions: Turning Pixels into Power", tag: "TO" },
  { id: "m-luckydraw", start: "4:00pm", end: "5:00pm", title: "Lucky Draw & Closing" },
];

// Parallel-track blocks
const MORNING_BLOCK_START = "9:30am";
const MORNING_TALKS = {
  Auditorium: [
    { title: "Invisible Backbone: Why Communication Protocols are Vital for Distribution Automation", tag: "E" },
    { title: "Current Transformer Placement Strategies in One-and-a-Half Breaker Substations for Secure and Sustainable Transmission Systems", tag: "E" },
    { title: "When Milliseconds Matter: Tackling Voltage Sags in Industrial Facilities", tag: "E" },
    { title: "Outage Management Through Smart Technologies", tag: "E" },
    { title: "Analysis of Sustained Oscillation at Sejingkat Coal-Fired Power Plant Based on Nonlinear Dynamical System Theory", tag: "E" },
  ],
  Baleh: [
    { title: "Reducing Forced Outage Due To Emission Non-Compliance Through The Installation Of Acoustic Air Horn System For ESP", tag: "M" },
    { title: "From CO2 Emissions to Resource: A Circularity Approach to Capture, Utilisation, and Storage (CCUS) Using Coal Fly Ash", tag: "TO" },
    { title: "Assessment of Gas Turbine Primary Frequency Response Limitations During Grid Disturbances", tag: "E" },
    { title: "Debris Cutter System as an Innovative Solution for Intake Clogging Issue at Sungai Kota 2 Mini Hydro, Lawas", tag: "TO" },
    { title: "Internal Consultancy Framework: Monetising our Mastery", tag: "E" },
  ],
  Baram: [
    { title: "Forensic Structural Investigation for Building Cracks at Astana 132kV Substation", tag: "C" },
    { title: "Forecasting Challenges in Run-of-River Mini Hydropower Systems: Lessons from the Kota 2 Mini Hydro Project", tag: "C" },
    { title: "Marudi Junction 275/132/33kV Substation Slope Stabilisation & Enhancement Works", tag: "C" },
    { title: "Early Identification of Slope Instability through Preliminary Assessment: Application and Validation of a Proforma-Based Method", tag: "TO" },
    { title: "Principle of Explosive and It's Application", tag: "C" },
  ],
  Murum: [
    { title: "Sarawak Energy Shared Environmental Information System (ENVIS): Transforming Environmental Data Management through Geospatial Intelligence Technology", tag: "TO" },
    { title: "Building a Scalable Enterprise Data Platform for a Data-Driven Utility: A Case Study in Sarawak Energy", tag: "TO" },
    { title: "Scheduled Waste Management at Baleh HEP - Recovery of Waste Oil as a Sensitizer for Quarry Blasting Operation", tag: "TO" },
    { title: "Satisfaction and Happiness Level Survey: A tool for Project Resettlement Performance and Social Impact Measurement", tag: "CF" },
    { title: "Application of Numerical Modelling in an Environmental Impact Assessment (EIA) for Thermal Power Plant development", tag: "TO" },
  ],
  Bakun: [
    { title: "Finance Continuous Improvement: Past, Present and Future", tag: "CF" },
    { title: "Creating Value and Driving Innovation for the Utility Sector", tag: "TO" },
    { title: "Protecting Our Intellectual Property", tag: "TO" },
    { title: "Small Generators and Power Systems to Support the Energy Transition", tag: "TO" },
    { title: "Smart Robotic Systems for Utilities", tag: "TO" },
  ],
};

const AFTERNOON_BLOCK_START = "2:00pm";
const AFTERNOON_TALKS = {
  Auditorium: [
    { title: "PI VISION and Lesson learned from Transformer Thermal Imaging PoC", tag: "M" },
    { title: "STG9 Tripping Event: Analysis & Keys Take Away", tag: "M" },
  ],
  Baleh: [
    { title: "Into the Realms of Microseconds with Real-Time Digital Simulator (RTDS)", tag: "E" },
    { title: "Impacting SAIDI & SAIFI: Exploring Single-Phase Cutout Reclosers in Rural Feeder Application", tag: "E" },
  ],
  Baram: [
    { title: "Multi-Criteria Evaluation of 34 CMIP6 Global Climate Models and Statistical Downscaling for Precipitation Projection in the Bakun Hydropower Basin, Sarawak, Malaysia", tag: "C" },
    { title: "Fire Suppression System for Substation Application", tag: "E" },
  ],
  Murum: [
    { title: "From Principles to Practice: Free, Prior, and Informed Consent (FPIC) Implementation Insights from Sarawak Energy's International Project (Indonesia)", tag: "CF" },
    { title: "Machine Learning Empowered Electronic Nose for Transformer Oil Rapid Analysis", tag: "TO" },
  ],
  Bakun: [
    { title: "Advancing Environmental Sciences in Power Utilities", tag: "TO" },
    { title: "Laboratory Services in Supporting Asset Health Monitoring", tag: "TO" },
  ],
};

const ANNOUNCEMENT_PREFIX = "Please assemble at the Auditorium for";

export const ANNOUNCEMENT_CONFIG = {
  "m-arrival": { icon: "arrival", accent: COLORS.upcoming },
  "m-briefing": { icon: "briefing", accent: COLORS.headerBlue },
  "m-photo": { icon: "photo", accent: COLORS.panelGrey },
  "m-aivision": { icon: "aivision", accent: COLORS.headerBlue },
  "m-drone": { icon: "drone", accent: COLORS.headerBlue },
  "m-luckydraw": { icon: "luckydraw", accent: COLORS.now },
};

export function getActiveAnnouncement(now) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const candidates = [...MERGED_ITEMS, ...CLOSING_ITEMS];

  for (const item of candidates) {
    const cfg = ANNOUNCEMENT_CONFIG[item.id];
    if (!cfg) continue;

    const startMin = toMinutes(item.start);
    const endMin = toMinutes(item.end);
    if (nowMin >= startMin && nowMin < endMin) {
      return {
        id: item.id,
        title: item.title,
        start: item.start,
        end: item.end,
        icon: cfg.icon,
        accent: cfg.accent,
        message: `${ANNOUNCEMENT_PREFIX} ${item.title}`,
      };
    }
  }
  return null;
}

// Builds one "parallel" row per 30-minute increment for a block of talks
function buildParallelBlock(blockId, startLabel, talksByTrack) {
  const startMin = toMinutes(startLabel);
  const rowCount = Math.max(...TRACKS.map((t) => (talksByTrack[t] || []).length));
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowStart = startMin + i * 30;
    const rowEnd = rowStart + 30;
    const tracks = {};
    TRACKS.forEach((track) => {
      const talk = (talksByTrack[track] || [])[i];
      if (talk) tracks[track] = { title: talk.title, tag: talk.tag, status: "upcoming" };
    });
    rows.push({
      id: `${blockId}-r${i}`,
      type: "parallel",
      start: toLabel(rowStart),
      end: toLabel(rowEnd),
      tracks,
    });
  }
  return rows;
}

function withDefaultStatus(item, status) {
  return { ...item, type: "merged", status };
}

// Builds the full day's schedule as one ordered list of rows, ready to render straight into a single table
export function buildSeedSessions() {
  const rows = [];
  MERGED_ITEMS.forEach((item) => rows.push(withDefaultStatus(item, "upcoming")));
  rows.push(...buildParallelBlock("morning", MORNING_BLOCK_START, MORNING_TALKS));
  rows.push(withDefaultStatus(MIDDAY, "upcoming"));
  rows.push(...buildParallelBlock("afternoon", AFTERNOON_BLOCK_START, AFTERNOON_TALKS));
  CLOSING_ITEMS.forEach((item) => rows.push(withDefaultStatus(item, "upcoming")));
  return rows;
}