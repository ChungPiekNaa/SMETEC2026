// Design tokens
export const COLORS = {
  headerBlue: "#1B7FBF",
  ink: "#1F2933",
  subtle: "#6B7684",
  hairline: "#111111",
  upcoming: "#2FC4CE",
  now: "#8DC63F",
  ended: "#D9D9D9",
  panelGrey: "#5A6470",
  mergedBg: "#F5F6F7",
};

export const STATUS = ["upcoming", "now", "ended"];
export const STATUS_LABEL = { upcoming: "Upcoming", now: "Now", ended: "Ended" };
export const STATUS_COLOR = { upcoming: COLORS.upcoming, now: COLORS.now, ended: COLORS.ended };

export const STATUS_BG = {
  upcoming: "#DFF6F7",
  now: "#E9F5D8",
  ended: "#E9E9E9",
};

// Schedule column order
export const TRACKS = ["Auditorium", "Baleh", "Baram", "Murum", "Bakun"];

export const TAG_LABEL = {
  E: "Electrical",
  M: "Mechanical",
  C: "Civil",
  TO: "Technical (Others)",
  CF: "Corporate Functions",
};

// Every parallel block below is expressed as a start time plus a list of per-track bullet titles
// Each bullet = 30 minutes, so start/end times for every row are generated automatically instead of typed by hand
function toMinutes(label) {
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

const MIDDAY = { id: "m-lunch", start: "12:00pm", end: "2:00pm", title: "Lunch" };

const CLOSING_ITEMS = [
  { id: "m-aivision", start: "3:00pm", end: "3:30pm", title: "AI Vision Empowered Robotic Dog for Substation Inspection & Monitoring" },
  { id: "m-drone", start: "3:30pm", end: "4:00pm", title: "From Drone Footage to Decisions: Turning Pixels into Power" },
  { id: "m-luckydraw", start: "4:00pm", end: "4:30pm", title: "Lucky Draw & Closing" },
];

// Parallel-track blocks
const MORNING_BLOCK_START = "9:30am";
const MORNING_TALKS = {
  Auditorium: [
    "Invisible Backbone: Why Communication Protocols are Vital for Distribution Automation",
    "Current Transformer Placement Strategies in One-and-a-Half Breaker Substations for Secure and Sustainable Transmission Systems",
    "When Milliseconds Matter: Tackling Voltage Sags in Industrial Facilities",
    "Outage Management Through Smart Technologies",
    "Analysis of Sustained Oscillation at Sejingkat Coal-Fired Power Plant Based on Nonlinear Dynamical System Theory",
  ],
  Baleh: [
    "Reducing Forced Outage Due To Emission Non-Compliance Through The Installation Of Acoustic Air Horn System For ESP",
    "From CO2 Emissions to Resource: A Circularity Approach to Capture, Utilisation, and Storage (CCUS) Using Coal Fly Ash",
    "Assessment of Gas Turbine Primary Frequency Response Limitations During Grid Disturbances",
    "Debris Cutter System as an Innovative Solution for Intake Clogging Issue at Sungai Kota 2 Mini Hydro, Lawas",
    "Internal Consultancy Framework: Monetising our Mastery",
  ],
  Baram: [
    "Forensic Structural Investigation for Building Cracks at Astana 132kV Substation",
    "Forecasting Challenges in Run-of-River Mini Hydropower Systems: Lessons from the Kota 2 Mini Hydro Project",
    "Marudi Junction 275/132/33kV Substation Slope Stabilisation & Enhancement Works",
    "Early Identification of Slope Instability through Preliminary Assessment: Application and Validation of a Proforma-Based Method",
    "Principle of Explosive and It's Application",
  ],
  Murum: [
    "Sarawak Energy Shared Environmental Information System (ENVIS): Transforming Environmental Data Management through Geospatial Intelligence Technology",
    "Building a Scalable Enterprise Data Platform for a Data-Driven Utility: A Case Study in Sarawak Energy",
    "Scheduled Waste Management at Baleh HEP - Recovery of Waste Oil as a Sensitizer for Quarry Blasting Operation",
    "Satisfaction and Happiness Level Survey: A tool for Project Resettlement Performance and Social Impact Measurement",
    "Application of Numerical Modelling in an Environmental Impact Assessment (EIA) for Thermal Power Plant development",
  ],
  Bakun: [
    "Finance Continuous Improvement: Past, Present and Future",
    "Creating Value and Driving Innovation for the Utility Sector",
    "Protecting Our Intellectual Property",
    "Small Generators and Power Systems to Support the Energy Transition",
    "Smart Robotic Systems for Utilities",
  ],
};

const AFTERNOON_BLOCK_START = "2:00pm";
const AFTERNOON_TALKS = {
  Auditorium: [
    "PI VISION and Lesson learned from Transformer Thermal Imaging PoC",
    "STG9 Tripping Event: Analysis & Keys Take Away",
  ],
  Baleh: [
    "Into the Realms of Microseconds with Real-Time Digital Simulator (RTDS)",
    "Impacting SAIDI & SAIFI: Exploring Single-Phase Cutout Reclosers in Rural Feeder Application",
  ],
  Baram: [
    "Multi-Criteria Evaluation of 34 CMIP6 Global Climate Models and Statistical Downscaling for Precipitation Projection in the Bakun Hydropower Basin, Sarawak, Malaysia",
    "Fire Suppression System for Substation Application",
  ],
  Murum: [
    "From Principles to Practice: Free, Prior, and Informed Consent (FPIC) Implementation Insights from Sarawak Energy's International Project (Indonesia)",
    "Machine Learning Empowered Electronic Nose for Transformer Oil Rapid Analysis",
  ],
  Bakun: [
    "Advancing Environmental Sciences in Power Utilities",
    "Laboratory Services in Supporting Asset Health Monitoring",
  ],
};

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
      const title = (talksByTrack[track] || [])[i];
      if (title) tracks[track] = { title, status: "upcoming" };
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
