import { useEffect, useState } from 'react';
import { LangCtx } from './hooks';
import type { Lang } from './data';
import { useRoute, Link } from './lib/router';
import { Preloader, Cursor, Background, BackToTop, StickyCta } from './components/fx';
import { CommandPalette, ScrollRail } from './components/premium';
import { Familiar, SpellVeil } from './components/arcane';
import { PlasmaDefs } from './components/plasma';
import { WarpDefs, WarpVeil } from './components/warp';
import { AtomVeil } from './components/nano';
import { VelvetCaseStudies, VelvetStack, VelvetAchievements, VelvetVeil } from './components/velvet';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Projects from './components/Projects';
import { Certificates, Collections } from './components/Collections';
import { Pricing, Testimonials, Faq } from './components/Engage';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { PageShell } from './components/pageshell';
import { ProjectPage, CaseStudiesPage, CaseStudyPage } from './pages/Work';
import {
  ResumePage, ExperiencePage, TechStackPage, ArchitecturePage, FlutterArchPage,
  PerformancePage, OpenSourcePage, GitHubPage, WritingPage, TalksPage,
  MentorshipPage, AwardsPage, LabsPage, DesignSystemPage, AccessibilityPage,
  LocalizationPage, LegalPage,
} from './pages/Craft';
import CmpPage from './pages/Cmp';
import CmpShowcase from './components/CmpShowcase';
import { ThemeControlDock } from './components/ThemeControlDock';
import type { ThemeMode } from './components/ThreeDScene';

type Theme = 'dark' | 'light';

/* Section rail ids used on the home landing page */
const HOME_RAIL = ['home', 'about', 'skills', 'services', 'projects', 'certificates', 'collections', 'pricing', 'testimonials', 'faq', 'contact'];
/* velvet keeps a tighter, brand-focused flow */
const VELVET_RAIL = ['home', 'projects', 'case-studies', 'about', 'skills', 'certificates', 'contact'];
const Sep = () => <div className="section-sep mx-auto max-w-[1440px]" />;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [realmTheme, setRealmTheme] = useState<ThemeMode>('neural');
  const [motionMode, setMotionMode] = useState<'interactive' | 'auto' | 'reduced'>('interactive');
  const [lang, setLang] = useState<Lang>('en');
  const route = useRoute();
  const velvet = realmTheme === 'velvet';

  /* apply theme to <html data-theme> so the CSS variable system reacts */
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else {
      document.documentElement.dataset.theme = realmTheme;
    }
  }, [theme, realmTheme]);

  /* lock scroll while the boot preloader is on screen */
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  /* ---- spell-circle route transition ---- */
  const [veil, setVeil] = useState<'idle' | 'in' | 'out'>('idle');

  useEffect(() => {
    if (loading) return;
    setVeil('in');
    window.scrollTo({ top: 0, behavior: 'auto' });
    const t1 = setTimeout(() => setVeil('out'), 700);
    const t2 = setTimeout(() => setVeil('idle'), 1180);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, loading]);

  /* keep the document title in sync with the active page */
  useEffect(() => {
    const pretty = route ? route.replace(/[-/]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : 'Arcane Code Sorcerer';
    document.title = `Moe Kyaw Aung — ${pretty} | 3D Kotlin & Flutter`;
  }, [route]);

  /* ---------------- route resolver ---------------- */
  const renderRoute = () => {
    /* nested detail routes */
    if (route.startsWith('project/')) return <ProjectPage slug={route.slice('project/'.length)} />;
    if (route.startsWith('case-study/')) return <CaseStudyPage slug={route.slice('case-study/'.length)} />;

    switch (route) {
      /* ---------- landing page ---------- */
      case '':
        /* velvet — the brand flow: hero → selected work → case studies → story → stack → achievements → contact */
        if (velvet) {
          return (
            <>
              <Hero realmTheme={realmTheme} motionMode={motionMode} />
              <Sep />
              <Projects realmTheme={realmTheme} />
              <Sep />
              <VelvetCaseStudies />
              <Sep />
              <About index="03" />
              <Sep />
              <VelvetStack />
              <Sep />
              <VelvetAchievements />
              <Sep />
              <Contact velvet index="06" />
            </>
          );
        }
        return (
          <>
            <Hero realmTheme={realmTheme} motionMode={motionMode} />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <About />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Skills />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Services />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Projects realmTheme={realmTheme} />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Certificates />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Collections />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Pricing />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Testimonials />
            <Faq />
            <CmpShowcase />
            <Contact />
          </>
        );

      /* ---------- pages that reuse landing sections ---------- */
      case 'about':
        return <PageShell route="about" wide><About /></PageShell>;
      case 'skills':
        return <PageShell route="skills" wide><Skills /></PageShell>;
      case 'services':
        return <PageShell route="services" wide><Services /></PageShell>;
      case 'projects':
        return <PageShell route="projects" wide><Projects realmTheme={realmTheme} /></PageShell>;
      case 'certificates':
        return <PageShell route="certificates" wide><Certificates /></PageShell>;
      case 'collections':
        return <PageShell route="collections" wide><Collections /></PageShell>;
      case 'pricing':
        return <PageShell route="pricing" wide><Pricing /></PageShell>;
      case 'testimonials':
        return <PageShell route="testimonials" wide><Testimonials /></PageShell>;
      case 'kmp':
        return <PageShell route="kmp" wide><CmpPage /></PageShell>;
      case 'faq':
        return <PageShell route="faq" wide><Faq /></PageShell>;
      case 'contact':
        return <PageShell route="contact" wide><Contact velvet={velvet} /></PageShell>;

      /* ---------- deep pages ---------- */
      case 'case-studies': return <CaseStudiesPage />;
      case 'resume': return <ResumePage />;
      case 'experience': return <ExperiencePage />;
      case 'tech-stack': return <TechStackPage />;
      case 'architecture': return <ArchitecturePage />;
      case 'flutter-architecture': return <FlutterArchPage />;
      case 'performance': return <PerformancePage />;
      case 'open-source': return <OpenSourcePage />;
      case 'github': return <GitHubPage />;
      case 'writing': return <WritingPage />;
      case 'talks': return <TalksPage />;
      case 'mentorship': return <MentorshipPage />;
      case 'awards': return <AwardsPage />;
      case 'labs': return <LabsPage />;
      case 'design-system': return <DesignSystemPage />;
      case 'accessibility': return <AccessibilityPage />;
      case 'localization': return <LocalizationPage />;
      case 'legal': return <LegalPage />;

      /* ---------- 404 ---------- */
      default:
        return (
          <PageShell route="about">
            <div className="py-16 text-center">
              <p className="font-display font-black text-7xl grad-text">404</p>
              <p className="mt-4 text-[var(--dim)]">This route does not exist in the system.</p>
              <Link to="" className="btn btn-primary clip-cy mt-8 inline-flex">Return home</Link>
            </div>
          </PageShell>
        );
    }
  };

  const isHome = route === '';

  return (
    <LangCtx.Provider value={lang}>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <PlasmaDefs />
      <WarpDefs />
      <Cursor />
      <Background />
      <CommandPalette />
      <Navbar theme={theme} setTheme={setTheme} setLang={setLang} />

      <main className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}>
        {renderRoute()}
      </main>

      <Footer />
      {isHome && <ScrollRail ids={velvet ? VELVET_RAIL : HOME_RAIL} />}
      <BackToTop />
      {!isHome && <StickyCta />}

      {/* ---- 3D Theme & Motion Control Dock ---- */}
      <ThemeControlDock
        currentTheme={realmTheme}
        onThemeChange={(t) => {
          setRealmTheme(t);
          if (theme === 'light') setTheme('dark');
        }}
        motionMode={motionMode}
        onMotionModeChange={(m) => setMotionMode(m)}
      />

      {/* ---- advisor & transition layer ---- */}
      <Familiar minimal={realmTheme === 'minimal'} plasma={realmTheme === 'plasma'} warp={realmTheme === 'warp'} nano={realmTheme === 'nano'} velvet={velvet} neural={realmTheme === 'neural'} />
      {velvet
        ? <VelvetVeil phase={veil} />
        : realmTheme === 'warp'
        ? <WarpVeil phase={veil} />
        : realmTheme === 'nano'
        ? <AtomVeil phase={veil} />
        : <SpellVeil phase={veil} minimal={realmTheme === 'minimal'} />}
    </LangCtx.Provider>
  );
}
