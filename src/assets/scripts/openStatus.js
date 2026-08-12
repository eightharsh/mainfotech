// Live "Open now / Closed" indicator.
// Reads the shop's weekly hours (in its OWN timezone) and fills every
// [data-open-status] element with the current state, so the badge is correct for
// every visitor regardless of their device timezone. Re-runs on Astro page
// navigations and once a minute so it flips exactly at opening/closing time.
import { BUSINESS_HOURS, BUSINESS_TZ } from '@data/constants';

const WEEKDAY_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

// "HH:MM" -> minutes since midnight
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// "22:00" -> "10 PM", "09:30" -> "9:30 AM"
function to12h(hhmm) {
  let [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2, '0')} ${period}` : `${h} ${period}`;
}

// Current { day, minutes } in the shop's timezone.
function nowInShopTz() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const get = type => parts.find(p => p.type === type)?.value;
  let hour = parseInt(get('hour'), 10);
  if (hour === 24) hour = 0; // some engines emit "24" at midnight
  const minute = parseInt(get('minute'), 10);

  return {
    day: WEEKDAY_INDEX[get('weekday')] ?? new Date().getDay(),
    minutes: hour * 60 + minute,
  };
}

function computeStatus() {
  const { day, minutes } = nowInShopTz();
  const today = BUSINESS_HOURS[day];

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { open: true, text: `Open now · closes ${to12h(today.close)}` };
    }
    if (minutes < open) {
      return { open: false, text: `Closed · opens ${to12h(today.open)}` };
    }
  }

  // Closed for the rest of today (or a closed day) — find the next opening day.
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = BUSINESS_HOURS[d];
    if (h) {
      const when = i === 1 ? 'tomorrow' : WEEKDAY_LONG[d];
      return { open: false, text: `Closed · opens ${to12h(h.open)} ${when}` };
    }
  }

  return { open: false, text: 'Closed' };
}

function apply() {
  const els = document.querySelectorAll('[data-open-status]');
  if (!els.length) return;

  const status = computeStatus();
  els.forEach(el => {
    el.hidden = false;
    el.dataset.state = status.open ? 'open' : 'closed';
    el.setAttribute('title', status.text);
    const textEl = el.querySelector('[data-open-status-text]');
    if (textEl) textEl.textContent = status.text;
  });
}

apply();
document.addEventListener('astro:page-load', apply);
setInterval(apply, 60 * 1000);

export {};
