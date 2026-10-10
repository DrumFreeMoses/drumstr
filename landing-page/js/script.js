// ============================================
// DRUMSTR LANDING PAGE — SCRIPT
// ============================================

// Weekly Block Schedule — 5:00 PM Mountain Time, Monday-Friday
// (Respects day-job hours 7:30 AM-4:30 PM MT. Weekend/extra 10-min sessions coming later.)
const blockSchedule = [
  { day: "Monday",    date: "October 12", time: "5:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-12" },
  { day: "Tuesday",   date: "October 13", time: "5:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-13" },
  { day: "Wednesday", date: "October 14", time: "5:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-14" },
  { day: "Thursday",  date: "October 15", time: "5:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-15" },
  { day: "Friday",    date: "October 16", time: "5:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-16" },
];

function renderSchedule() {
  const next = blockSchedule[0];
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
