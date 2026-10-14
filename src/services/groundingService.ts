import { GroundingResponse } from '../types';

export async function askPrayerGrounding(query: string): Promise<GroundingResponse> {
  const res = await fetch('/api/prayer-grounding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل الاتصال بمستكشف الصلاة والبحث');
  }

  return res.json();
}
