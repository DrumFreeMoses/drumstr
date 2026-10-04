// ============================================
// DRUMSTR LANDING PAGE — SCRIPT
// ============================================

// Weekly Block Schedule (Noon Mountain Time = 11 AM PST / 2 PM EST)
const blockSchedule = [
  { day: "Monday",    date: "October 5",  time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-05" },
  { day: "Tuesday",   date: "October 6",  time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-06" },
  { day: "Wednesday", date: "October 7",  time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-07" },
  { day: "Thursday",  date: "October 8",  time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-08" },
  { day: "Friday",    date: "October 9",  time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-09" },
  { day: "Saturday",  date: "October 10", time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-10" },
  { day: "Sunday",    date: "October 11", time: "12:00 PM MT", roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-10-11" },
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
