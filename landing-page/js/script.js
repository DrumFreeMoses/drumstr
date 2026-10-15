// Daily Block — join link for today (fallback: next scheduled weekday).
// Self-hosted MiroTalk SFU with ?drumMode=1 (raw mic: EC/AGC/NS off).
const blockDates = [
  { day: "Monday",    date: "October 12" },
  { day: "Tuesday",   date: "October 13" },
  { day: "Wednesday", date: "October 14" },
  { day: "Thursday",  date: "October 15" },
  { day: "Friday",    date: "October 16" },
];

function nextBlock() {
  const todayLabel = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const hit = blockDates.find(b => b.date === todayLabel);
  if (hit) return hit;
  return blockDates[blockDates.length - 1];
}

function roomUrlFor(block) {
  const iso = "2026-10-" + String(12 + blockDates.indexOf(block)).padStart(2, "0");
  return `https://av.drumfreeexperience.org/join/drumstr-block-${iso}?drumMode=1`;
}

document.addEventListener("DOMContentLoaded", () => {
  const next = nextBlock();
  const roomLink = document.getElementById("room-link");
  if (roomLink && next) {
    roomLink.href = roomUrlFor(next);
    roomLink.removeAttribute("hidden");
  }
});
