/* ============================================================================
   ARCANE DATA — runes, familiar intelligence, spellbook diagrams
   ============================================================================ */

/* Elder Futhark rune set used for ambient glyph work */
export const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

/* Arcane labels for the disciplines — pairs with the tech terms */
export const DISCIPLINES: Record<string, { rune: string; arcane: string; tech: string }> = {
  kotlin:        { rune: 'ᚲ', arcane: 'Invocation of Kotlin',      tech: 'Kotlin · Coroutines · Flow' },
  compose:       { rune: 'ᚲ', arcane: 'Weaving of Compose',        tech: 'Jetpack Compose · Material 3' },
  architecture:  { rune: 'ᛗ', arcane: 'Order of Clean Arch',       tech: 'MVVM · MVI · Multi-module' },
  firebase:      { rune: 'ᚠ', arcane: 'Binding of Firebase',       tech: 'Auth · Firestore · FCM' },
  flutter:       { rune: 'ᛚ', arcane: 'Mirror Craft of Flutter',   tech: 'Flutter · Dart · Riverpod' },
  cicd:          { rune: 'ᛞ', arcane: 'Ritual of Delivery',        tech: 'GitHub Actions · Fastlane' },
  performance:   { rune: 'ᛈ', arcane: 'Swiftness Sigil',           tech: 'Profiling · 60fps · Baseline' },
  security:      { rune: 'ᛉ', arcane: 'Warding Arts',              tech: 'Ethical Hacking · Secure Storage' },
};

/* ---------- FAMILIAR KNOWLEDGE BASE ---------- */
export interface FamIntent {
  keys: string[];
  runes: string;
  title: string;
  answer: string;
  follow?: string[];
}

export const FAM_INTENTS: FamIntent[] = [
  {
    keys: ['kotlin', 'coroutine', 'flow', 'language', 'invoke'],
    runes: 'ᚲ ᚱ ᛁ',
    title: 'The Kotlin Invocation',
    answer: 'Kotlin is my primary tongue — twelve years of casting. Coroutines are the summoning circles that let work happen without blocking the main thread, and Flow is the current of data that streams through them. Together they let the UI stay smooth while the app speaks to the network and database in the background.',
    follow: ['How do you keep coroutines safe?', 'What about Compose?'],
  },
  {
    keys: ['compose', 'ui', 'widget', 'jetpack', 'screen', 'interface'],
    runes: 'ᚹ ᛖ ᚨ',
    title: 'The Weaving of Compose',
    answer: 'Jetpack Compose weaves interface from pure function calls — you describe the screen for a given state, and the framework diffs and redraws. The craft is keeping recomposition cheap: stable models, deferred reads, and hoisting state so only the smallest subtree rebuilds. Done well, a list scrolls at 60fps on a 2019 mid-ranger.',
    follow: ['How do you manage state?', 'Tell me about performance'],
  },
  {
    keys: ['architecture', 'clean', 'mvvm', 'mvi', 'module', 'structure', 'layer'],
    runes: 'ᛗ ᛖ ᛗ',
    title: 'The Order of Clean Architecture',
    answer: 'The binding circle has three rings. Presentation holds UI and holds no logic. Domain holds pure Kotlin use-cases that import nothing from the framework, so they test in milliseconds. Data holds repositories, cache and network. Dependencies point inward only. Each feature owns its own slice — features never import each other, they speak through contracts exposed by a thin core.',
    follow: ['How does cross-platform fit?', 'How do you test this?'],
  },
  {
    keys: ['flutter', 'dart', 'cross', 'platform', 'mirror', 'ios'],
    runes: 'ᛚ ᛚ ᚢ',
    title: 'The Mirror Craft',
    answer: 'Flutter is mirror-craft — one Dart codebase reflected onto both platforms. I share roughly 85 to 92 percent of code. The rule is simple: anything touching pixels, sensors or platform policy stays native. Payments, biometrics, camera and notifications are always native, wrapped behind an interface so the shared layer stays testable.',
    follow: ['What about platform channels?', 'Kotlin or Flutter?'],
  },
  {
    keys: ['performance', 'slow', 'fast', 'startup', 'jank', 'optimize', 'lag', 'speed', 'frame'],
    runes: 'ᛈ ᛊ ᚹ',
    title: 'The Swiftness Sigil',
    answer: 'Performance work only counts if measured on real hardware. My last engagement cut cold start from 3.1 seconds to 1.4 with baseline profiles and deferred initialisation, dropped frames per scroll from 41 to 3, and shrank the APK by 55 percent. Every release is tested on a mid-range device before rollout — not just the flagship on the desk.',
    follow: ['Book a performance audit', 'What tools do you use?'],
  },
  {
    keys: ['offline', 'sync', 'cache', 'local', 'database', 'room', 'sqlite', 'conflict'],
    runes: 'ᛞ ᚱ ᚢ',
    title: 'The Persistence Bind',
    answer: 'Local-first means the database is the single source of truth and the network is merely a sync mechanism. Every mutation is queued as an idempotent operation with a client UUID so retries are safe. Conflicts resolve field-by-field with last-write-wins and server arbitration, and the merge history is kept for ninety days. In the field this took offline task completion from 48 to 97 percent.',
    follow: ['Read that case study', 'How is this tested?'],
  },
  {
    keys: ['security', 'secure', 'hack', 'encrypt', 'protect', 'ward', 'threat'],
    runes: 'ᛉ ᛃ ᚱ',
    title: 'The Warding Arts',
    answer: 'Practical security, not theatre. Encrypted storage for tokens, certificate pinning on the network layer, R8 obfuscation in release, and a dependency risk sweep on every release branch. I hold ethical hacking certifications and I audit the attack surface the way an attacker would — then close it.',
    follow: ['Audit my app', 'What certifications?'],
  },
  {
    keys: ['test', 'testing', 'tdd', 'quality', 'espresso', 'junit', 'mock'],
    runes: 'ᛏ ᛖ ᛊ',
    title: 'The Trial of Proof',
    answer: 'Three tiers. Domain use-cases are pure Kotlin, unit tested with no framework imports — they run in milliseconds. Repositories run against fakes and contract tests. UI gets a thin Espresso and golden suite on both platforms. The aim is not coverage vanity; it is confidence to change code without fear.',
    follow: ['How does CI fit in?', 'Architecture layers'],
  },
  {
    keys: ['ci', 'cd', 'deploy', 'release', 'pipeline', 'github action', 'automation', 'ritual'],
    runes: 'ᚱ ᛁ ᛏ ᚢ ᚨ ᛚ',
    title: 'The Ritual of Delivery',
    answer: 'Every pull request runs lint, the full test suite and a signed build. Merges go out as staged rollouts — 5 percent, then 20, then 100 — with crash metrics watched at each gate. There is a documented rollback path that has actually been rehearsed, not just written down. This is how crash-free sessions hold at 99.9 percent.',
    follow: ['Performance results', 'How do you review code?'],
  },
  {
    keys: ['mentor', 'learn', 'teach', 'junior', 'career', 'grow', 'student'],
    runes: 'ᛗ ᚨ ᚾ ᚨ',
    title: 'The Passing of Knowledge',
    answer: 'Mentoring is the part of senior work with the longest half-life. I keep a small number of ongoing mentees so sessions stay practical — we work on your real codebase, not toy examples. Tracks cover code review support, pairing, refactoring rescue, career growth, and a structured eight-week Flutter curriculum.',
    follow: ['See mentorship tracks', 'How do I apply?'],
  },
  {
    keys: ['price', 'cost', 'rate', 'hire', 'quote', 'money', 'fee', 'much'],
    runes: 'ᚠ ᛖ ᛟ',
    title: 'The Compact of Coin',
    answer: 'Four compacts, priced transparently in kyat, baht or dollar. A Quick Audit at $149 for one app. An Architecture Review at $449 for a full codebase. Monthly Advisory at $1,200 for ongoing guidance. Implementation Support is scoped per mission. Every engagement begins with a free twenty-minute discovery call.',
    follow: ['See pricing page', 'Are you available?'],
  },
  {
    keys: ['available', 'hire', 'free', 'work', 'job', 'role', 'remote', 'when', 'open'],
    runes: 'ᚨ ᚢ ᚨ',
    title: 'The Open Gate',
    answer: 'The gate is open. I am taking senior Android and Flutter roles plus consulting engagements for 2026, based in GMT+6:30 and overlapping Bangkok, Singapore and European mornings. I reply within 24 hours on business days — usually much faster. For urgent production incidents, Telegram reaches me quickest.',
    follow: ['How to contact you', 'What roles interest you?'],
  },
  {
    keys: ['contact', 'email', 'phone', 'reach', 'message', 'talk', 'call'],
    runes: 'ᛊ ᛁ ᚷ ᚾ',
    title: 'The Sending',
    answer: 'You may send word by the inscription form on the contact page, or directly — moekyawaung@engineer.com is my primary address, and +95 9 889 000 889 my line. I read Burmese, English and Thai. Expect a reply within one day.',
    follow: ['Open the contact page', 'Are you available?'],
  },
  {
    keys: ['project', 'app', 'build', 'portfolio', 'work', 'spellbook', 'case study', 'example'],
    runes: 'ᛒ ᛟ ᚲ',
    title: 'The Grimoire of Works',
    answer: 'The grimoire holds sixteen public spellbooks — a POS suite with thermal printing, a video player with background playback, a social dashboard on Compose and Firebase, plus games, PWAs and Flutter builds. Three carry full case studies with measured before-and-after numbers. Every repository is open on GitHub.',
    follow: ['Show me a case study', 'What is your best project?'],
  },
  {
    keys: ['experience', 'year', 'long', 'history', 'background', 'senior', 'career'],
    runes: 'ᛖ ᚱ ᛁ ᛚ',
    title: 'The Long Practise',
    answer: 'Nearly twelve years. I began in 2014 with Java and Eclipse in Mandalay, migrated six client apps to Kotlin by 2017, owned an MVVM and Coroutines stack in Bangkok by 2019, led dual-track Kotlin and Flutter for a regional fintech at 99.9 percent crash-free, andarchitected a multi-module platform serving more than three million users. Now independent.',
    follow: ['Read the resume', 'See the timeline'],
  },
  {
    keys: ['certificat', 'credential', 'award', 'qualif', 'education', 'degree'],
    runes: 'ᛞ ᛁ ᛈ ᛚ ᛟ ᛗ',
    title: 'The Sealed Credentials',
    answer: 'Over forty verified certifications across nine domains — programming languages, web, mobile, databases, AI and machine learning, security, blockchain, software engineering and business. Including the Google Developers Launchpad advanced Android track. Each seal on the certificate page links to a verifiable ID.',
    follow: ['View certificates', 'What awards?'],
  },
  {
    keys: ['familiar', 'who are you', 'your name', 'runix', 'ai', 'assistant', 'bot', 'magic'],
    runes: 'ᚠ ᚨ ᛗ ᛁ ᛚ ᛁ ᚨ ᚱ',
    title: 'I am RUNIX',
    answer: 'I am RUNIX — a digital familiar bound to this grimoire. I am not a large language model connected to the network; I am a local spirit compiled from Moe Kyaw Aung\'s own notes, so every answer I give comes from his actual practice. Ask me about his architecture, his performance work, or how to hire him.',
    follow: ['Explain his architecture', 'How do I contact him?'],
  },
  {
    keys: ['rune', 'glyph', 'magic', 'arcane', 'sigil', 'spell', 'grimoire', 'meaning'],
    runes: 'ᚱ ᚢ ᚾ ᛟ',
    title: 'On Runes and Sigils',
    answer: 'The glyphs drifting through this place are Elder Futhark — the oldest runic alphabet, some eighteen centuries old. Each discipline here carries its own seal: ᚲ for Kotlin invocation, ᛗ for the order of clean architecture, ᛈ for the swiftness sigil, ᛉ for the warding arts. They are the interface between very old symbols and very new code.',
    follow: ['Show me the disciplines', 'What is this site built with?'],
  },
];

/* Architect-decision intents — precise rationale for each major call */
const DECISION_INTENTS: FamIntent[] = [
  {
    keys: ['why clean', 'layer', 'separation', 'boundary', 'three ring', 'decision'],
    runes: 'ᛞ ᛖ ᚦ',
    title: 'Decision — Layered Boundaries',
    answer: 'Layering is a testability decision, not a structural one. A pure domain layer lets invariants be verified in milliseconds without the framework. The cost — more files, more indirection — is paid once at the boundary and recovered on every refactor for the life of the app. The rule: dependencies point inward only, and features never import each other.',
    follow: ['How do you test this?', 'State management approach'],
  },
  {
    keys: ['why compose', 'compose or xml', 'xml', 'ui framework'],
    runes: 'ᚹ ᛖ ᚨ',
    title: 'Decision — Compose over XML',
    answer: 'XML was a document format forced into a view hierarchy. Compose makes UI a pure function of state — same state, same pixels. That determinism is what makes previews, golden tests and recomposition analysis possible. The trade, a steeper curve for teams fluent in XML, paid back during our migration in a single quarter.',
    follow: ['How do you keep recomposition cheap?', 'Performance results'],
  },
  {
    keys: ['flutter or native', 'native or flutter', 'platform choice', 'one codebase'],
    runes: 'ᛚ  ᛗ',
    title: 'Decision — One Codebase or Two',
    answer: 'The test is how often Android and iOS must diverge. Divergence is rare: one shared codebase with a thin native edge wins on velocity and consistency. Divergence is deep and continuous: two native codebases with shared domain logic is cheaper long term. That decision belongs in the product, not the tech stack — and it should be revisited at every major release.',
    follow: ['What about platform channels?', 'Read that case study'],
  },
  {
    keys: ['state management', 'single source', 'viewmodel', 'view model', 'state ownership'],
    runes: 'ᛊ ᛏ ᛖ',
    title: 'Decision — Single Source of Truth',
    answer: 'Every screen derives from one immutable state object, updated through named intents. Duplicated state is where UI bugs live. The discipline: if a value is derived, compute it; if it is owned, own it in exactly one place. That single rule has removed more production bugs than any tooling we have added.',
    follow: ['How does CI fit in?', 'How do you keep recomposition cheap?'],
  },
  {
    keys: ['why', 'tradeoff', 'trade-off', 'rationale', 'reason', 'how you decide', 'think'],
    runes: 'ᛞ ᛖ ᚹ',
    title: 'On How I Decide',
    answer: 'Every decision is answered in three parts: what the constraint is, what the cost is, and what reverses cleanly. I prefer decisions that are cheap to reverse. The ones I make most often — layering, state ownership, platform boundaries — are chosen so a new engineer can predict the consequence of any change before making it.',
    follow: ['Why clean architecture?', 'Flutter or native?'],
  },
];

/* Merged knowledge base — decision intents take priority (matched first) */
export const ALL_INTENTS: FamIntent[] = [...DECISION_INTENTS, ...FAM_INTENTS];

export const FAM_GREETING =
  'I am RUNIX, digital familiar of this grimoire. Ask me of Moe Kyaw Aung\'s craft — his architecture, his performance rites, or how to bind him to your project.';

export const FAM_GREETING_MINIMAL =
  'AURA — I explain architectural decisions the way they are made: constraint, cost, and what reverses cleanly. Ask about layering, state ownership, platform boundaries, or performance.';

export const FAM_GREETING_PLASMA =
  'CORE online. I trace this codebase as an energy circuit — Kotlin and Compose feed the architecture core, which routes through Firebase and the CI loop. Ask me to trace any path.';

export const FAM_GREETING_WARP =
  'Ship computer online. I am HELM, navigation intelligence for this vessel. Twelve years of logged missions are aboard. Set a heading — architecture, performance, a mission debrief, or a course to contact — and I will plot it.';

export const FAM_GREETING_NEURAL =
  'COGNITIVE LINK established. I am COGNIS, your neural cognitive core interface. I coordinate and monitor Moe Kyaw Aung\'s biometric software architecture. Select any neural junction to initiate a structural readout.';

export const FAM_GREETING_VELVET =
  'Good evening. I am the concierge of this atelier. Ask about Moe Kyaw Aung\'s selected work, the architecture beneath it, or his availability — I answer with discretion and precision.';

export const FAM_GREETING_NANO =
  'Unit NANO-1 assembled and active. I operate at molecular scale, examining the bonds of this engineer\'s work. Point me at a structure — architecture, performance, a nano-module — and I will explain how its atoms hold together.';

export const FAM_FALLBACK =
  'That question reaches beyond my binding. I speak fluently of Kotlin, Compose, architecture, Flutter, performance, offline sync, security, testing, delivery rituals, pricing, and how to make contact. Try one of those, or pull a thread from below.';

export const FAM_SUGGESTIONS = [
  'Explain his architecture',
  'How does he make apps fast?',
  'What does an audit cost?',
  'Is he available to hire?',
  'Tell me about Flutter',
  'How does offline sync work?',
];

/* ---------- SPELLBOOK ARCANE DIAGRAMS ---------- */
/* Each project gets an animated sigil diagram rendered in SVG */
export interface DiagramNode { label: string; }
export const DIAGRAMS: Record<string, string[]> = {
  android: ['UI', 'VM', 'USE', 'REPO', 'NET'],
  flutter: ['VIEW', 'STATE', 'USE', 'REPO', 'API'],
  web:     ['SHELL', 'ROUTE', 'STORE', 'CACHE', 'NET'],
  game:    ['LOOP', 'INPUT', 'STATE', 'RENDER', 'SAVE'],
};
