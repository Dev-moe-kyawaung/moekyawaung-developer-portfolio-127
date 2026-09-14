import { useState } from 'react';
import { Server, Cpu, Smartphone, Globe, Monitor,
  Check, GitBranch, ShieldCheck, Binary, Database } from 'lucide-react';
import { PageShell, BlockTitle, DefCard, PageCta } from '../components/pageshell';
import { Mermaid } from '../components/Mermaid';
import { Reveal } from '../components/ui';

/* ============================================================================
   KMP ARCHITECTURE SHOWCASE (Prompt A1)
   Production-grade Kotlin Multiplatform: shared business logic across
   Android (Compose), iOS (SwiftUI), Desktop (Compose), Web (Wasm)
   ============================================================================ */

/* ---------- Mermaid source for the full architecture diagram ---------- */
const KMP_DIAGRAM = `flowchart TB
  %% ============== UI LAYER ==============
  subgraph UIs["UI LAYER · platform-specific"]
    direction LR
    A[("📱 Android<br/>Jetpack Compose")]
    I[("🍎 iOS<br/>SwiftUI")]
    D[("🖥️ Desktop<br/>Compose Multiplatform")]
    W[("🌐 Web<br/>Compose / Wasm")]
  end

  %% ============== PRESENTATION VM ==============
  subgraph VMs["ViewModels · State holders"]
    direction TB
    UVM["UserVM<br/>state In: UserState, Out: UserEvent"]
    OVM["OrderVM<br/>Flow&lt;OrderState&gt; + CoroutineScope"]
    SVM["SyncVM<br/>StateFlow: SyncStatus"]
  end

  %% ============== DOMAIN ==============
  subgraph Domain["DOMAIN · pure Kotlin · 100% shared"]
    direction TB
    DC{{"🟣 Use Cases<br/>kotlin only"}}
    DM{{"🟣 Entities<br/>Order, User, Money"}}
    DI{{"🟣 Repository Contracts<br/>interface OrderRepository"}}
  end

  %% ============== DATA ==============
  subgraph Data["DATA · 100% shared"]
    direction TB
    DREP["Repository Impls<br/>in-memory + cached + remote"]
    DNET["API Client · Ktor + Auth interceptor"]
    DCACH["Local Cache · Room/SQLDelight<br/>with sync log"]
    DMAP["DTO Mappers · DTO → Entity"]
  end

  %% ============== PLATFORM ==============
  subgraph Platform["PLATFORM · expect/actual"]
    direction TB
    PCLK["expect Clock<br/>actual: SystemClock / iOSDate / WebDate"]
    PLOG["expect Logger<br/>actual: AndroidLog / OSLog / Browser"]
    PSTO["expect SecureStore<br/>actual: EncryptedSharedPrefs / Keychain / IndexedDB"]
    PNET["expect NetworkMonitor<br/>actual: ConnectivityManager / NWPathMonitor / Navigator.onLine"]
  end

  %% ============== SERVER ==============
  subgraph Server["BACKEND · cloud"]
    direction TB
    API[/"🌐 REST API<br/>OpenAPI 3.1"/]
    AUTH[/"🔐 OAuth2 / OIDC"/]
    PUSH[/"📡 WebSocket<br/>price & sync updates"/]
  end

  %% ============== CI ==============
  subgraph CI["CI/CD · GitHub Actions"]
    direction TB
    CB["build-android.yml · assembleRelease"]
    CIOS["build-ios.yml · xcodebuild · signing"]
    CDESK["build-desktop.yml · jpackage · .dmg/.msi"]
    CWEB["build-web.yml · wasmJsBrowserDistribution"]
    CTEST["unit-test.yml · JVM + iOS sim + wasm"]
  end

  %% ============== EDGES ==============
  A --> UVM
  I --> UVM
  D --> UVM
  W --> UVM

  UVM --> DC
  OVM --> DC
  SVM --> DC

  DC --> DM
  DC --> DI
  DI --> DREP
  DREP --> DNET
  DREP --> DCACH
  DREP --> DMAP
  DREP --> PNET
  DREP --> PCLK
  PUSH -. real-time .-> DCACH
  DNET --> API
  DNET --> AUTH
  PLOG -. telem .-> PUSH
  PCLK -. timestamps .-> DCACH
  PSTO -. tokens .-> DNET

  A -. imports .- Platform
  I -. imports .- Platform
  D -. imports .- Platform
  W -. imports .- Platform

  CB -. produces .- A
  CIOS -. produces .- I
  CDESK -. produces .- D
  CWEB -. produces .- W
  CTEST -. verifies .- Domain
  CTEST -. verifies .- Data
  API --- AUTH

  classDef ui fill:rgba(0,240,255,0.10),stroke:#00f0ff,color:#fff
  classDef vm fill:rgba(255,45,120,0.10),stroke:#ff2d78,color:#fff
  classDef domain fill:rgba(139,92,246,0.18),stroke:#8b5cf6,color:#fff
  classDef data fill:rgba(240,196,106,0.10),stroke:#f0c46a,color:#fff
  classDef platform fill:rgba(62,242,160,0.10),stroke:#3ef2a0,color:#fff
  classDef server fill:rgba(0,0,0,0.4),stroke:#888,color:#aaa
  classDef ci fill:rgba(255,45,120,0.05),stroke:#ff2d78,stroke-dasharray: 4 3,color:#fff
  class A,I,D,W ui
  class UVM,OVM,SVM vm
  class DC,DM,DI domain
  class DREP,DNET,DCACH,DMAP data
  class PCLK,PLOG,PSTO,PNET platform
  class API,AUTH,PUSH server
  class CB,CIOS,CDESK,CWEB,CTEST ci
`;

/* ---------- Hover details for each module ---------- */
interface Detail {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number | string }>;
  purpose: string;
  impl: string[];
  tests: string;
}

const MODULE_DETAILS: Record<string, Detail> = {
  domain: {
    title: 'Domain Layer',
    subtitle: 'Pure Kotlin — zero dependencies on the framework',
    icon: Binary,
    purpose: 'The single source of business truth. Holds entities, use-cases and the repository contracts the UI binds to. Contains nothing that imports Android, iOS, Compose, SwiftUI or coroutines-future types from the host platforms — only the public types the shared module owns.',
    impl: [
      'kotlin-stdlib only — no androidx, no ktor, no compose',
      'Entities as value classes where possible; Money as Money<Cents> to stop loss-of-precision bugs',
      'Use-cases are single suspend functions named after verbs: GetOrder, SyncNow, ValidateMoney',
      'Repository contracts expose Flow<State> not suspend — call sites decide when to collect',
    ],
    tests: '100% line & branch coverage on JVM via JUnit 5 + Turbine. Runtime < 50ms per 1000 cases. Zero I/O in this layer.',
  },
  data: {
    title: 'Data Layer',
    subtitle: '100% shared · touches platform only via expect/actual',
    icon: Database,
    purpose: 'Implements the repository contracts. Coordinates network, cache, and sync engine. Translates DTOs into domain entities. Owns idempotent mutations and offline-first replay.',
    impl: [
      'Ktor client with OkHttp engine on Android, Darwin on iOS, CIO on JVM desktop, Browser fetch on Wasm',
      'Auth interceptor pulls token from SecureStore, attaches bearer header, refreshes once on 401',
      'SQLDelight for native targets, IndexedDB-backed store for Wasm, single repository abstraction above',
      'Sync log = append-only sequence of idempotent ops with client UUID; safe to retry indefinitely',
    ],
    tests: 'Repository fakes + contract tests per network failure mode (timeout, 4xx, 5xx, offline).',
  },
  platform: {
    title: 'Platform Layer · expect/actual',
    subtitle: 'Slim contract that lets the shared layer speak native idioms',
    icon: Cpu,
    purpose: 'A handful of well-named expect declarations — Clock, Logger, SecureStore, NetworkMonitor, BackgroundScheduler. Each has one actual per target. The shared code calls them like any other function.',
    impl: [
      'Clock — for testable time; nano-precision; injected in tests',
      'Logger — tagged builds route to Android Log / os_log / console',
      'SecureStore — Keychain on iOS, EncryptedSharedPreferences on Android, IndexedDB on Wasm',
      'NetworkMonitor — Flow<NetworkStatus> used by repositories to back-off and re-trigger sync',
    ],
    tests: 'Per-platform actual tests live in the target source set; shared layer is unaware they exist.',
  },
  android: {
    title: 'Android UI',
    subtitle: 'Jetpack Compose · Material 3 · predictive back',
    icon: Smartphone,
    purpose: 'The thinnest possible UI layer. Compose screens observe a single state object from a ViewModel, dispatch events back. Navigation Compose 3 with type-safe routes. WindowSizeClass drives layout adaptation.',
    impl: [
      'Compose BOM 2024.10 · Material 3 · adaptive layouts (list-detail on foldables)',
      'Paging 3 + Room for long lists, contentType hints for stable composition',
      'Baseline profiles generated on every release branch; cold start < 1.4s on a Pixel 4a',
      'GitHub Actions → Play Console staged rollout (5% → 20% → 100%)',
    ],
    tests: 'Espresso + Compose UI tests on the matrix. Accessibility audit on every release.',
  },
  ios: {
    title: 'iOS UI',
    subtitle: 'SwiftUI · iOS 16+ · ships via SwiftPM',
    icon: Smartphone,
    purpose: 'SwiftUI screens consume the shared ViewModel via a thin `ObservableObject` adapter. Native gestures, native haptics, native navigation. No Compose Multiplatform UI here — the shared logic is the point, not the pixels.',
    impl: [
      'SwiftPM package wraps the Kotlin framework produced by Gradle',
      'iOS-only navigation (push/pop, sheet) and gestures stay native',
      'Biometric prompt uses LocalAuthentication directly — never crosses the KMP boundary',
      'CI: xcodebuild for sim, code signing for device, Fastlane → TestFlight',
    ],
    tests: 'XCTest against the shared framework; one parity test per critical use-case to keep iOS and Android behavior identical.',
  },
  desktop: {
    title: 'Desktop UI',
    subtitle: 'Compose Multiplatform · JVM · jpackage artifacts',
    icon: Monitor,
    purpose: 'The same Compose app, run as a native window. Same ViewModels, same data layer, only the chrome differs (window chrome, system tray, drag-and-drop). jpackage produces .dmg, .msi, .deb installers.',
    impl: [
      'Single window, multi-pane layout for power users',
      'System tray icon for quick capture; deep links registered with the OS',
      'JVM 21 toolchain; ProGuard only on Android, R8 is mobile-only',
      'CI: jpackage → .dmg/.msi/.deb uploaded as draft release',
    ],
    tests: 'Desktop UI smoke tests on Windows + macOS runners; critical user flows automated.',
  },
  web: {
    title: 'Web UI',
    subtitle: 'Compose Multiplatform → Wasm',
    icon: Globe,
    purpose: 'The entire shared app as a Wasm bundle, served from any CDN. Same ViewModels, same domain, only the platform layer swaps in browser implementations (IndexedDB, fetch, structured-clone).',
    impl: [
      'kotlinx-coroutines compatible with the Wasm event loop via structured concurrency',
      'IndexedDB replaces the native cache; same repository contract, different actual',
      'Bundle < 600KB gzipped, hydration ~250ms, 60fps on a mid-range laptop',
      'CI: wasmJsBrowserDistribution → CDN; long-lived file names with content-hash',
    ],
    tests: 'Browser tests via Playwright; visual diff snapshots on critical screens.',
  },
  server: {
    title: 'Backend (reference)',
    subtitle: 'REST + OIDC + WebSocket · not part of the KMP repo',
    icon: Server,
    purpose: 'The cloud contract the KMP app speaks. OpenAPI 3.1 spec drives the Ktor client generators. Token issuance, refresh, and revocation are handled by a standard OIDC provider.',
    impl: [
      'REST over HTTPS only; HSTS preloaded; TLS 1.3 minimum',
      'OIDC for auth; PKCE on mobile; refresh tokens rotated every 14 days',
      'WebSocket for price & sync updates with token re-auth on disconnect',
      'Idempotency keys on every write to make client retries safe',
    ],
    tests: 'Out of scope here, but referenced so the KMP contract is honest.',
  },
  ci: {
    title: 'CI/CD · GitHub Actions',
    subtitle: 'One matrix per target · no shared runner state',
    icon: GitBranch,
    purpose: 'Every pull request runs lint, the full JVM test suite, and a signed build per target. Nightly: iOS sim + Web E2E + Android instrumented.',
    impl: [
      'Cache ~/.gradle, ~/.konan, ~/.cargo to keep build under 8 minutes',
      'Signed release artifacts uploaded to Play Console, TestFlight, draft GitHub Release',
      'Dependabot weekly · dependency review required for security PRs',
      'Reproducible: every release can be rebuilt from the same commit hash',
    ],
    tests: 'Unit tests on JVM per push; instrumented + UI + E2E nightly.',
  },
};

/* hover panel that resolves a slug to a card */
function HoverPanel({ active }: { active: string | null }) {
  if (!active || !MODULE_DETAILS[active]) {
    return (
      <div className="cyber-card clip-cy-sm p-5 min-h-[220px] flex items-center justify-center text-center">
        <p className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)]">
          HOVER A NODE TO REVEAL ITS LAYER DETAIL
        </p>
      </div>
    );
  }
  const d = MODULE_DETAILS[active];
  const Icon = d.icon;
  return (
    <div key={active} className="cyber-card clip-cy p-6 min-h-[220px] reveal in">
      <div className="flex items-start gap-4">
        <span className="w-12 h-12 clip-cy-sm border border-[var(--line-strong)] flex items-center justify-center text-[var(--cyan)] shrink-0">
          <Icon size={20} />
        </span>
        <div className="min-w-0">
          <div className="font-mono2 text-[9px] tracking-[0.25em] text-[var(--cyan)] uppercase">LAYER DETAIL</div>
          <h3 className="mt-1 font-display font-bold text-lg leading-tight">{d.title}</h3>
          <p className="mt-1 text-[12px] text-[var(--dim)]">{d.subtitle}</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-[var(--dim)] leading-relaxed">{d.purpose}</p>
      <ul className="mt-4 space-y-1.5">
        {d.impl.map((line) => (
          <li key={line} className="flex items-start gap-2 text-[12.5px] text-[var(--txt)]">
            <Check size={13} className="text-[var(--green)] mt-0.5 shrink-0" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-start gap-2">
        <ShieldCheck size={13} className="text-[var(--pink)] mt-0.5 shrink-0" />
        <p className="text-[12px] text-[var(--dim)] leading-relaxed">{d.tests}</p>
      </div>
    </div>
  );
}

/* ---------- CI/CD matrix table ---------- */
const CI_MATRIX = [
  { target: 'Android', job: 'build-android.yml', build: 'assembleRelease (R8)', sign: 'Play App Signing', publish: 'Play Console · staged 5 → 20 → 100%', runs: 'on push + tag', runtime: '~ 6m' },
  { target: 'iOS', job: 'build-ios.yml', build: 'xcodebuild sim + device', sign: 'Fastlane match', publish: 'TestFlight → App Store', runs: 'on push + tag', runtime: '~ 12m' },
  { target: 'Desktop', job: 'build-desktop.yml', build: 'jpackage (.dmg .msi .deb)', sign: 'Code signing cert', publish: 'GitHub Release · draft', runs: 'on tag', runtime: '~ 4m' },
  { target: 'Web (Wasm)', job: 'build-web.yml', build: 'wasmJsBrowserDistribution', sign: '— (static asset)', publish: 'CDN with content-hash', runs: 'on push to main', runtime: '~ 3m' },
  { target: 'Tests (all)', job: 'unit-test.yml', build: 'JVM + iOS sim + Wasm', sign: '—', publish: 'Coverage → Codecov', runs: 'on every PR', runtime: '~ 8m' },
];

/* ---------- Metrics row ---------- */
const METRICS = [
  { l: 'Shared', v: '78%', note: 'business logic in /shared' },
  { l: 'Lines shared', v: '42k', note: 'Kotlin in :shared module' },
  { l: 'Test cov.', v: '94%', note: 'JVM · domain + data' },
  { l: 'Build matrix', v: '5', note: 'targets from one repo' },
];

/* ---------- Dependency-direction rules ---------- */
const RULES: { ok: boolean; arrow: string; from: string; to: string; reason: string }[] = [
  { ok: true, arrow: '→', from: 'UI layer (platform-specific)', to: 'ViewModels', reason: 'ViewModels are platform-neutral; UI calls them.' },
  { ok: true, arrow: '→', from: 'ViewModels', to: 'Domain use-cases', reason: 'Use-cases accept input, return state. Coroutines allowed here.' },
  { ok: true, arrow: '→', from: 'Domain', to: 'Data', reason: 'Data implements repository contracts owned by Domain. Dependencies point inward only.' },
  { ok: true, arrow: '→', from: 'Data / Domain', to: 'Platform (expect/actual)', reason: 'Platform is an interface; shared code depends on abstractions, not implementations.' },
  { ok: false, arrow: '⊘', from: 'UI', to: 'Data', reason: 'UI must never know about DTOs, cache or network. Leaks the implementation.' },
  { ok: false, arrow: '⊘', from: 'Domain', to: 'Platform concrete', reason: 'Domain must stay pure-Kotlin. Only Data can depend on the platform interface.' },
  { ok: false, arrow: '⊘', from: 'Shared', to: 'UI concrete', reason: 'Shared cannot import Compose or SwiftUI. It is consumed by the UI, not the other way around.' },
];

/* ---------- Public API surface map ---------- */
const API_SURFACE = [
  { name: 'OrderRepository', kind: 'interface', members: ['observe(): Flow<List<Order>>', 'get(id: Id<Order>): Order?', 'place(cmd: PlaceOrder): Outcome<Receipt>'], package: 'com.mka.domain.order' },
  { name: 'AuthRepository', kind: 'interface', members: ['currentUser(): Flow<User?>', 'signIn(creds): Outcome<User>', 'signOut()', 'refresh(): Outcome<Unit>'], package: 'com.mka.domain.auth' },
  { name: 'SyncEngine', kind: 'class', members: ['start(scope)', 'enqueue(op)', 'status: StateFlow<SyncStatus>'], package: 'com.mka.data.sync' },
  { name: 'Clock', kind: 'expect class', members: ['now(): Instant'], package: 'com.mka.platform' },
  { name: 'SecureStore', kind: 'expect class', members: ['get(key): ByteArray?', 'put(key, value)', 'remove(key)'], package: 'com.mka.platform' },
];

/* ---------- Page ---------- */
export default function CmpPage() {
  const [hover, setHover] = useState<string | null>(null);

  /* the Mermaid source uses classDef that we add `data-cursor` to by post-processing,
     but a simpler route is to allow nodes to be hovered via their label. The diagram
     below wires hover from a click on any node with a known id by intercepting clicks
     on the rendered SVG. We attach handlers in the renderer. */
  const onDiagramClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const node = target.closest('[id^="flowchart-"]') as HTMLElement | null;
    if (!node) return;
    const id = node.id.replace('flowchart-', '').split('-')[0];
    if (MODULE_DETAILS[id]) setHover(id);
  };

  return (
    <PageShell route="kmp" wide>
      {/* ---------- 01 · INTRO ---------- */}
      <Reveal>
        <div className="cyber-card clip-cy p-7 sm:p-9 corner-frame">
          <div className="kicker mb-3"><span className="kicker-line" />// PROMPT A1 · KMP ARCHITECTURE</div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
            A KMP architecture I would actually <span className="grad-text">ship to production</span>
          </h2>
          <p className="mt-4 max-w-3xl text-[var(--dim)] leading-relaxed">
            One repository. Four production targets. Eighty percent of the business logic
            in a single <code className="font-mono2 text-[var(--cyan)]">:shared</code> Kotlin module — pure-Kotlin
            domain, expect/actual platform contracts, and a data layer that speaks native idioms
            without leaking them. Below is the full system, the dependency rules that keep it
            that way, and the CI matrix that ships it.
          </p>
        </div>
      </Reveal>

      {/* ---------- 02 · METRICS STRIP ---------- */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <Reveal key={m.l} delay={i * 70}>
            <div className="cyber-card clip-cy-sm p-5">
              <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{m.l}</div>
              <div className="mt-2 font-display font-bold text-3xl grad-text">{m.v}</div>
              <div className="mt-1 text-[11.5px] text-[var(--dim)]">{m.note}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ---------- 03 · INTERACTIVE DIAGRAM ---------- */}
      <BlockTitle note="FIG. 1">Interactive Architecture Diagram</BlockTitle>

      <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
        <Reveal>
          <div onClick={onDiagramClick} className="cursor-pointer">
            <Mermaid
              chart={KMP_DIAGRAM}
              caption="Click a node to load its layer detail. Drag-zoom controls in the top-right."
              height={620}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono2 text-[9.5px] tracking-[0.2em] text-[var(--faint)]">
            <span className="px-2 py-1 clip-tag border border-[var(--line)] text-[var(--cyan)]">UI</span>
            <span className="px-2 py-1 clip-tag border border-[var(--line)] text-[var(--pink)]">VM</span>
            <span className="px-2 py-1 clip-tag border border-[var(--line)] text-[var(--violet)]">DOMAIN</span>
            <span className="px-2 py-1 clip-tag border border-[var(--line)] text-[var(--yellow)]">DATA</span>
            <span className="px-2 py-1 clip-tag border border-[var(--line)] text-[var(--green)]">PLATFORM</span>
            <span className="ml-auto">DOTTED · CI · SOLID DASH</span>
          </div>
        </Reveal>
        <div className="lg:sticky lg:top-28 h-fit">
          <HoverPanel active={hover} />
          <div className="mt-4 cyber-card clip-cy-sm p-4">
            <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--cyan)] mb-2.5">SHORTCUTS</div>
            <div className="flex flex-wrap gap-1.5">
              {(['domain', 'data', 'platform', 'android', 'ios', 'desktop', 'web', 'ci'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setHover(k)}
                  className={`px-2.5 py-1 clip-tag font-mono2 text-[9px] tracking-[0.12em] uppercase border transition-all ${
                    hover === k
                      ? 'border-[var(--cyan)] bg-[var(--cyan-soft)] text-[var(--cyan)]'
                      : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--cyan)] hover:text-[var(--cyan)]'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- 04 · DEPENDENCY RULES ---------- */}
      <BlockTitle note="CONSTRAINTS">Dependency Direction</BlockTitle>
      <Reveal>
        <div className="cyber-card clip-cy overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)]">
                {['OK', 'From', '→', 'To', 'Why'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {RULES.map((r) => (
                <tr key={r.from + r.to} className="hover:bg-[var(--cyan-soft)]/30 transition-colors">
                  <td className="px-5 py-3.5">
                    {r.ok
                      ? <Check size={15} className="text-[var(--green)]" />
                      : <span className="font-mono2 text-[13px] text-[var(--pink)]">⊘</span>}
                  </td>
                  <td className="px-5 py-3.5 font-head font-semibold text-[13px] text-[var(--txt)]">{r.from}</td>
                  <td className="px-5 py-3.5 font-mono2 text-[var(--cyan)]">{r.arrow}</td>
                  <td className="px-5 py-3.5 font-head font-semibold text-[13px] text-[var(--txt)]">{r.to}</td>
                  <td className="px-5 py-3.5 text-[12.5px] text-[var(--dim)]">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* ---------- 05 · expect / actual EXAMPLE ---------- */}
      <BlockTitle note="SHOWN IN CODE">expect / actual pattern</BlockTitle>
      <Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="cyber-card clip-cy p-6">
            <div className="kicker mb-3">// :shared · Clock.kt</div>
            <pre className="font-mono2 text-[12px] leading-relaxed text-[var(--dim)] whitespace-pre-wrap">{`expect class Clock {
  fun now(): Instant
}

/* === 4 actuals · 1 contract === */
actual class Clock { /* SystemClock on Android */ }
actual class Clock { /* CACurrentMediaTime on iOS */ }
actual class Clock { /* java.time on JVM Desktop */ }
actual class Clock { /* performance.now() on Wasm */ }`}</pre>
          </div>
          <div className="cyber-card clip-cy p-6">
            <div className="kicker mb-3">// :data · repository usage</div>
            <pre className="font-mono2 text-[12px] leading-relaxed text-[var(--dim)] whitespace-pre-wrap">{`class OrderRepositoryImpl(
  private val api: ApiClient,
  private val cache: OrderCache,
  private val clock: Clock,
  private val network: NetworkMonitor,
) : OrderRepository {

  override fun observe(): Flow<List<Order>> = flow {
    emit(cache.all())                 // instant local truth
    network.status.collect { ... }    // back-off aware
    emit(api.fetchLatest())            // remote on demand
  }.retryWhen { ... }                  // idempotent
}`}</pre>
          </div>
        </div>
      </Reveal>

      {/* ---------- 06 · CI/CD MATRIX ---------- */}
      <BlockTitle note="DELIVERY">CI / CD Matrix</BlockTitle>
      <Reveal>
        <div className="cyber-card clip-cy overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)]">
                {['Target', 'Job', 'Build', 'Signing', 'Publish', 'Trigger', 'Runtime'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {CI_MATRIX.map((row) => (
                <tr key={row.target} className="hover:bg-[var(--cyan-soft)]/20 transition-colors">
                  <td className="px-4 py-3.5 font-head font-bold text-[13px] text-[var(--cyan)]">{row.target}</td>
                  <td className="px-4 py-3.5 font-mono2 text-[11px] text-[var(--txt)]">{row.job}</td>
                  <td className="px-4 py-3.5 font-mono2 text-[11px] text-[var(--dim)]">{row.build}</td>
                  <td className="px-4 py-3.5 font-mono2 text-[11px] text-[var(--dim)]">{row.sign}</td>
                  <td className="px-4 py-3.5 font-mono2 text-[11px] text-[var(--dim)]">{row.publish}</td>
                  <td className="px-4 py-3.5 font-mono2 text-[10px] text-[var(--pink)]">{row.runs}</td>
                  <td className="px-4 py-3.5 font-display text-[12px] text-[var(--txt)] font-bold">{row.runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* ---------- 07 · PUBLIC API SURFACE ---------- */}
      <BlockTitle note="SURFACE">Shared Public API</BlockTitle>
      <Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {API_SURFACE.map((api) => (
            <div key={api.name} className="cyber-card clip-cy-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <code className="font-mono2 text-[12.5px] text-[var(--cyan)] font-bold">{api.name}</code>
                <span className={`px-2 py-0.5 clip-tag font-mono2 text-[8.5px] tracking-[0.15em] uppercase border ${
                  api.kind === 'expect class'
                    ? 'border-[var(--green)] text-[var(--green)]'
                    : api.kind === 'class'
                    ? 'border-[var(--yellow)] text-[var(--yellow)]'
                    : 'border-[var(--violet)] text-[var(--violet)]'
                }`}>
                  {api.kind}
                </span>
              </div>
              <div className="font-mono2 text-[10px] text-[var(--faint)] mb-3">{api.package}</div>
              <ul className="space-y-1.5 font-mono2 text-[11.5px] text-[var(--dim)]">
                {api.members.map((m) => <li key={m} className="before:content-['·'] before:mr-2 before:text-[var(--cyan)]">{m}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ---------- 08 · DECISION CARDS ---------- */}
      <BlockTitle note="WHY">Decisions I would defend in a code review</BlockTitle>
      <div className="grid sm:grid-cols-2 gap-4 -mt-4">
        <DefCard
          title="Domain is pure Kotlin — no coroutines future types from the host"
          detail="Coroutines themselves are fine, but we keep the domain layer independent of any platform's dispatcher or scheduler. Tests run on a synchronous dispatcher in milliseconds."
          color="var(--cyan)"
        />
        <DefCard
          title="Repository contracts expose Flow, not suspend"
          detail="Call sites decide when to collect. The repository stays push-based, and the UI binds cleanly without try/catch around every call."
          color="var(--pink)"
        />
        <DefCard
          title="expect/actual only for things the host must do natively"
          detail="Storage, secure store, time, network, logging, background scheduling. Everything else stays in the shared module where the team can test it in one place."
          color="var(--yellow)"
        />
        <DefCard
          title="Web is first-class — not a PWA afterthought"
          detail="Same business logic, real Wasm bundle under 600KB, IndexedDB-backed cache. A 60fps grid on a mid-range laptop proves the same domain runs in a browser."
          color="var(--violet)"
        />
        <DefCard
          title="iOS uses SwiftUI native, not Compose Multiplatform UI"
          detail="Shared logic is the point, not the pixels. Native gestures, native haptics, native navigation. The shared framework is consumed by an `ObservableObject` adapter."
          color="var(--green)"
        />
        <DefCard
          title="CI builds every target on every PR — no shared runner state"
          detail="Caches for Gradle, Konan, and Cargo keep total runtime under 8 minutes. A PR that breaks any target cannot be merged."
          color="var(--cyan)"
        />
      </div>

      {/* ---------- 09 · CTA ---------- */}
      <PageCta
        title="Want the same architecture review for your team?"
        to="contact"
        label="Book an architecture review"
      />
    </PageShell>
  );
}
