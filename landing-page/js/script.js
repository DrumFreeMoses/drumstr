// ============================================
// DRUMSTR LANDING PAGE — SCRIPT
// ============================================

// Weekly Block Schedule — 5:00 PM Mountain Time, Monday-Friday
// (Respects day-job hours 7:30 AM-4:30 PM MT. Weekend/extra 10-min sessions coming later.)
// POC platform: public Jitsi — drum-audio flags (raw audio through) +
// broadcast toolbar whitelist (mic/camera/chat/hangup only). HiveTalk/MiroTalk
// SFU self-host lands with the A/V VPS.
const JITSI_AUDIO = '#config.disableNS=true'
  + '&config.disableAEC=true'
  + '&config.disableAGC=true'
  + '&config.enableNoisyMicDetection=false'
  + '&config.disableDeepLinking=true'
  + '&config.toolbarButtons=' + encodeURIComponent(JSON.stringify(['microphone', 'camera', 'chat', 'hangup']))
  + '&interfaceConfig.SHOW_JITSI_WATERMARK=false'
  + '&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false'
  + '&interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true';
const blockSchedule = [
  { day: "Monday",    date: "October 12", time: "5:00 PM MT", roomUrl: "https://meet.jit.si/drumstr-block-2026-10-12" + JITSI_AUDIO },
  { day: "Tuesday",   date: "October 13", time: "5:00 PM MT", roomUrl: "https://meet.jit.si/drumstr-block-2026-10-13" + JITSI_AUDIO },
  { day: "Wednesday", date: "October 14", time: "5:00 PM MT", roomUrl: "https://meet.jit.si/drumstr-block-2026-10-14" + JITSI_AUDIO },
  { day: "Thursday",  date: "October 15", time: "5:00 PM MT", roomUrl: "https://meet.jit.si/drumstr-block-2026-10-15" + JITSI_AUDIO },
  { day: "Friday",    date: "October 16", time: "5:00 PM MT", roomUrl: "https://meet.jit.si/drumstr-block-2026-10-16" + JITSI_AUDIO },
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
