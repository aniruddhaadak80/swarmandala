/**
 * English is the source of truth: every other locale must satisfy this shape.
 * Placeholders use {braces} and are substituted by the `t()` helper.
 */
export const en = {
  "brand.name": "swarmandala",
  "brand.tagline": "Hear the hour.",

  "nav.atlas": "Atlas",
  "nav.clock": "Prahar clock",
  "nav.compare": "Compare",
  "nav.about": "About",
  "nav.practice": "Practice",

  "hero.eyebrow": "A living atlas of Hindustani raga",
  "hero.title1": "The day has",
  "hero.title2": "a scale.",
  "hero.intro":
    "Twenty-four ragas, each tied to a watch of the day. Tune a drone, trace a scale, and find out what 6pm is supposed to sound like.",
  "hero.cta": "Enter the atlas",
  "hero.cta2": "What is playing now?",
  "hero.now": "At {time}, the atlas suggests",
  "hero.listen": "Start the tanpura",
  "hero.stop": "Stop",
  "hero.muted": "Sound stays off until you ask for it.",
  "hero.footnote": "No samples. No keys. Just oscillators and a very old idea.",

  "clock.title": "Eight watches, one day",
  "clock.intro":
    "Hindustani music keeps time in prahars — three-hour watches that begin at 4am. Drag the hand and the atlas re-tunes.",
  "clock.now": "Now",
  "clock.suggested": "Suggested for this watch",
  "clock.watch": "Watch {n}",
  "clock.drag": "Drag the hand, or use the arrow keys.",
  "clock.sam": "Sam",

  "atlas.title": "The atlas",
  "atlas.intro":
    "Twenty-four ragas, sorted by the hour they belong to. Filter by thaat, mood, or season.",
  "atlas.search": "Search ragas, thaats, moods…",
  "atlas.filterAll": "All watches",
  "atlas.results": "{n} ragas",
  "atlas.empty": "No ragas match that. Try a thaat name, a mood, or a watch.",
  "atlas.sortPrahar": "By hour",
  "atlas.sortName": "By name",

  "raga.aroha": "Aroha",
  "raga.avaroha": "Avaroha",
  "raga.pakad": "Pakad",
  "raga.vadi": "Vadi",
  "raga.samvadi": "Samvadi",
  "raga.thaat": "Thaat",
  "raga.prahar": "Watch",
  "raga.rasa": "Rasa",
  "raga.mood": "Mood",
  "raga.related": "Hear it next",
  "raga.practice": "Practice this raga",
  "raga.listen": "Hear the scale",
  "raga.stop": "Stop",
  "raga.scale": "Scale on the mandala",
  "raga.about": "About this raga",
  "raga.season": "Season",
  "raga.notFound": "That raga is not in the atlas.",
  "raga.back": "All ragas",

  "practice.title": "Practice room",
  "practice.intro": "A drone, a theka, and nothing else. Set the tempo; the sam will find you.",
  "practice.drone": "Tanpura",
  "practice.taal": "Taal",
  "practice.tempo": "Tempo",
  "practice.start": "Begin",
  "practice.stop": "Stop",
  "practice.sam": "Sam",
  "practice.khali": "Khali",
  "practice.beat": "Matra {n}",
  "practice.note": "Tap a swara to play it over the drone.",
  "practice.sa": "Sa",
  "practice.volume": "Volume",

  "compare.title": "Two ragas, one circle",
  "compare.intro":
    "Pick two ragas and see which notes they share. Similarity is the overlap of their pitch-class sets.",
  "compare.a": "First raga",
  "compare.b": "Second raga",
  "compare.shared": "Shared",
  "compare.onlyA": "Only {name}",
  "compare.onlyB": "Only {name}",
  "compare.similarity": "Similarity",
  "compare.sameThaat": "Same thaat",
  "compare.differentThaat": "Different thaats",

  "about.title": "What this is",
  "about.intro":
    "Swarmandala is a free, offline-first atlas of Hindustani raga: a way to see the scale, hear the drone, and learn the hour.",
  "about.whatIsRaga": "What is a raga?",
  "about.whatIsRagaBody":
    "A raga is a melodic framework — a set of swaras with rules for how they move. It is not a fixed song. Two musicians can spend an hour on the same raga and never repeat a phrase.",
  "about.prahar": "What is a prahar?",
  "about.praharBody":
    "A prahar is a three-hour watch of the day. Ragas are traditionally assigned to a prahar, and the assignment is part of the raga's identity, not a playlist suggestion.",
  "about.notation": "Reading the notation",
  "about.notationBody":
    "S is Sa, the tonic. Lowercase letters are komal (flattened), capitals are shuddha. M^ is tivra Ma. A trailing apostrophe is the upper octave. The atlas chooses Sa for you, but every raga is relative — tune to your own voice.",
  "about.honesty": "A note on accuracy",
  "about.honestyBody":
    "Raga grammar varies by gharana, and any atlas flattens it. This one follows common concert practice and cites its sources. Corrections are welcome — the dataset lives in one file.",
  "about.sources": "Sources",
  "about.sourcesBody":
    "Descriptions draw on standard Hindustani pedagogy, common concert practice, and public reference material. Per-raga notes and caveats live in docs/reference/ragas.md in the repository.",
  "about.disclaimer": "Made with respect for the tradition, and no claim to authority over it.",

  "clock.ragasInWatch": "Ragas in this watch",
  "clock.selectWatch": "Choose a watch",

  "home.now": "At {time}, the atlas suggests",
  "home.watches": "Eight watches",
  "home.watchesIntro": "A day in three-hour turns. Pick a watch and see what lives there.",
  "home.ways": "Three ways in",
  "home.way1Title": "See the scale",
  "home.way1Body":
    "Twelve swaras in a circle, with every raga's ascent drawn across them. Tap a note to hear it.",
  "home.way2Title": "Hear the drone",
  "home.way2Body": "No samples — just oscillators, tuned to your Sa and plucked like a tanpura.",
  "home.way3Title": "Keep time",
  "home.way3Body": "Teentaal, Jhaptal, Roopak, Keherwa. Count the vibhags and find the sam.",
  "home.quote":
    "A raga is not a song. It is a set of rules for moving through a scale — and a good musician can spend an hour inside one without repeating a phrase.",
  "home.quoteAttribution": "A working definition, not a quotation.",
  "home.ctaTitle": "Start with the hour you're in.",
  "home.ctaBody": "Open the clock, drag the hand, and let the atlas tune the day.",
  "home.ctaButton": "Open the prahar clock",
  "home.featured": "Six ragas to start with",
  "home.viewAll": "All {n} ragas",
  "home.listenScale": "Hear the scale",
  "home.ragaOfHour": "Raga of the hour",

  "footer.built": "Built in Kolkata. Zero samples, zero API keys.",
  "footer.data": "Raga data",
  "footer.source": "Source",
  "footer.license": "MIT",

  "common.loading": "Tuning…",
  "common.minutes": "{n} min",
  "common.play": "Play",
  "common.pause": "Pause",
  "common.close": "Close",
  "common.menu": "Menu",
  "common.language": "Language",
  "common.theme": "Theme",
  "common.keyboard": "Space starts the drone. Arrow keys move the clock.",
  "common.skip": "Skip to content",
} as const;

export type Dictionary = { readonly [K in keyof typeof en]: string };
export type TranslationKey = keyof Dictionary;
