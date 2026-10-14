// ============================================
// DRUMSTR LANDING PAGE — SCRIPT
// ============================================

// Weekly Block Schedule — 5:00 PM Mountain Time, Monday-Friday
// (Respects day-job hours 7:30 AM-4:30 PM MT. Weekend/extra 10-min sessions coming later.)
// Platform: hosted HiveTalk honey (honey.hivetalk.org) — Nostr-native, iPad-safe.
// Self-hosted MiroTalk SFU lands with the A/V VPS.
const honeyRoom = (date) => `https://honey.hivetalk.org/join/drumstr-block-${date}`;
const blockSchedule = [
  { day: "Monday",    date: "October 12", time: "5:00 PM MT", roomUrl: honeyRoom("2026-10-12") },
  { day: "Tuesday",   date: "October 13", time: "5:00 PM MT", roomUrl: honeyRoom("2026-10-13") },
  { day: "Wednesday", date: "October 14", time: "5:00 PM MT", roomUrl: honeyRoom("2026-10-14") },
  { day: "Thursday",  date: "October 15", time: "5:00 PM MT", roomUrl: honeyRoom("2026-10-15") },
  { day: "Friday",    date: "October 16", time: "5:00 PM MT", roomUrl: honeyRoom("2026-10-16") },
];

function nextBlock() {
  const today = new Date();
  const todayLabel = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const hit = blockSchedule.find(b => b.date === todayLabel);
  if (hit) return hit;
  return blockSchedule[blockSchedule.length - 1];
}

function renderSchedule() {
  const next = nextBlock();
  const roomLink = document.getElementById("room-link");
  if (roomLink && next) roomLink.href = next.roomUrl;

  const list = document.getElementById("upcoming-list");
  if (list) {
    list.innerHTML = blockSchedule
      .map(b => `<li>${b.day}, ${b.date} at ${b.time}</li>`)
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", renderSchedule);
