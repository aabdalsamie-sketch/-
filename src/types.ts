export type CharacterId = 'ahmad' | 'nour';

export type PrayerStepId =
  | 'intro'
  | 'wudu'
  | 'qibla_takbir'
  | 'fatiha_quran'
  | 'ruku'
  | 'rising_ruku'
  | 'sujud_first'
  | 'jalsa'
  | 'sujud_second'
  | 'tashahhud'
  | 'tasleem'
  | 'celebration';

export interface PrayerStep {
  id: PrayerStepId;
  title: string;
  subtitle: string;
  startTime: number; // in seconds (out of 300 total)
  duration: number; // in seconds
  egyptianExplanation: string; // Colloquial explanation for 5yo
  dhikr: string; // What to say in Arabic
  dhikrMeaning: string; // Simple meaning for kids
  kidActionPrompt: string; // Interactive prompt for the child to mimic
  funFact: string; // Short cheerful note
  posture: 'standing' | 'takbir' | 'qiyam' | 'ruku' | 'standing_straight' | 'sujud' | 'sitting' | 'tashahhud' | 'tasleem_right' | 'tasleem_left' | 'celebrating';
  colorTheme: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface GroundingResponse {
  answer: string;
  sources: GroundingSource[];
  webSearchQueries?: string[];
}
