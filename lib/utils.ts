import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import PocketBase from 'pocketbase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractDateTime(dateTimeString: string) {
  const dateObj = new Date(dateTimeString);

  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  const hours = String(dateObj.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;

  return { date, time };
}

export function flattenObject(obj: any): string {
  let resultString = '';
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      resultString += ' ' + flattenObject(obj[key]);
    } else {
      resultString += ' ' + String(obj[key]).toLowerCase();
    }
  }
  return resultString;
}

export function calculateAge(dateString: string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function stripHtmlTags(html: string) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

export const pb = new PocketBase('https://medimanage.pockethost.io');
