import { PreviouslyChosenClass } from "@/types/localStorage/PreviouslyChosenClass";

const previousKey = `previousClasses`;

function toDate(input: string): Date | null {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

function weekdayMon1Sun7(d: Date): number {
  const js = d.getDay();
  return ((js + 6) % 7) + 1;
}

function hhmm(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function weekdayTimeKey(iso: string): string | null {
  const d = toDate(iso);
  if (!d) return null;
  return `${weekdayMon1Sun7(d)}-${hhmm(d)}`;
}

export function sameByNameDayAndTime(a: PreviouslyChosenClass, b: PreviouslyChosenClass): boolean {
  if (a.name !== b.name) return false;
  const ka = weekdayTimeKey(a.startTime);
  const kb = weekdayTimeKey(b.startTime);
  return ka !== null && kb !== null && ka === kb;
}

export function loadPreviousClasses(): PreviouslyChosenClass[] {
  try {
    const raw = localStorage.getItem(previousKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isClassInHistoryByRef(ref: PreviouslyChosenClass): boolean {
  const list = loadPreviousClasses();
  return list.some((x) => sameByNameDayAndTime(x, ref));
}

export function addPreviousClass(ref: PreviouslyChosenClass) {
  try {
    const list = loadPreviousClasses();
    const exists = list.some((x) => sameByNameDayAndTime(x, ref));
    if (!exists) {
      list.push(ref);
      localStorage.setItem(previousKey, JSON.stringify(list));
    }
  } catch {
    console.log("Something went wrong adding class to local storage");
  }
}

export function removePreviousClass(ref: PreviouslyChosenClass) {
  try {
    const list = loadPreviousClasses();
    const next = list.filter((x) => !sameByNameDayAndTime(x, ref));
    localStorage.setItem(previousKey, JSON.stringify(next));
  } catch {
    console.log("Something went wrong removing class from local storage");
  }
}
