import { addDays } from './dates'

/** Builds a calendar file with an all-day event and a morning reminder, so the phone's calendar alerts you. */
export function buildIcs(title: string, date: string, notes = '', yearly = false): string {
  const d = date.replaceAll('-', '')
  const next = addDays(date, 1).replaceAll('-', '')
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\;').replace(/\n/g, '\\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EJ Horse//EN',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID()}@ej-horse`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${next}`,
    ...(yearly ? ['RRULE:FREQ=YEARLY'] : []),
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(notes)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title)}`,
    'TRIGGER:-PT15H', // 9 am the day of an all-day event
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(title: string, date: string, notes = '', yearly = false) {
  const blob = new Blob([buildIcs(title, date, notes, yearly)], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = title.replace(/[^\w -]/g, '').slice(0, 40) + '.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000)
}
