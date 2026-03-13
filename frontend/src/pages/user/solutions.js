import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './solutions.module.css';

/* ── Intersection observer hook ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Wave SVG Background ── */
function WaveBg() {
  return (
    <div className={styles.bgCanvas}>
      <svg className={styles.bgSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        {[...Array(18)].map((_, i) => (
          <path key={`pink-${i}`} className={styles.wavePath}
            style={{ animationDelay: `${i * 0.15}s`, '--wave-color': `rgba(200, 80, 200, ${0.4 - i * 0.015})` }}
            d={`M ${-100 + i * 8} ${300 + i * 6} C ${200 + i * 5} ${100 + i * 8}, ${500 + i * 3} ${500 + i * 4}, ${700 + i * 6} ${200 + i * 5} S ${900 + i * 4} ${600 + i * 3}, ${1100 + i * 5} ${300 + i * 4}`}
            fill="none" strokeWidth="1.2" />
        ))}
        {[...Array(18)].map((_, i) => (
          <path key={`cyan-${i}`} className={styles.wavePath}
            style={{ animationDelay: `${i * 0.12 + 1}s`, '--wave-color': `rgba(30, 180, 255, ${0.4 - i * 0.015})` }}
            d={`M ${500 + i * 6} ${900} C ${700 + i * 4} ${650 + i * 5}, ${900 + i * 3} ${800 + i * 3}, ${1100 + i * 5} ${550 + i * 6} S ${1300 + i * 4} ${750 + i * 3}, ${1500 + i * 5} ${600 + i * 4}`}
            fill="none" strokeWidth="1.2" />
        ))}
        {[...Array(10)].map((_, i) => (
          <path key={`purple-${i}`} className={styles.wavePath}
            style={{ animationDelay: `${i * 0.2 + 0.5}s`, '--wave-color': `rgba(130, 80, 255, ${0.25 - i * 0.02})` }}
            d={`M ${200 + i * 10} ${500 + i * 4} C ${400 + i * 6} ${300 + i * 5}, ${700 + i * 4} ${700 + i * 3}, ${1000 + i * 5} ${400 + i * 4}`}
            fill="none" strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
}

/* ── Solution Card ── */
function SolutionCard({ number, title, subtitle, body, features, accent, delay, flip }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`${styles.solutionCard} ${inView ? styles.visible : ''} ${flip ? styles.flip : ''}`}
      style={{ '--accent': accent, transitionDelay: delay }}
    >
      <div className={styles.solutionCardLeft}>
        <span className={styles.solutionNum}>{number}</span>
        <div className={styles.solutionAccentBar} style={{ background: accent }}></div>
        <h3 className={styles.solutionTitle}>{title}</h3>
        <span className={styles.solutionSubtitle}>{subtitle}</span>
        <p className={styles.solutionBody}>{body}</p>
        <ul className={styles.featureList}>
          {features.map((f, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureDot} style={{ background: accent }}></span>
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.solutionCardRight}>
        <div className={styles.solutionVisual}>
          <div className={styles.visualGlow} style={{ background: accent }}></div>
          <div className={styles.visualIcon}>{getSolutionIcon(number)}</div>
        </div>
      </div>
    </div>
  );
}

function getSolutionIcon(num) {
  const icons = {
    '01': (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    '02': (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
    '03': (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
    '04': (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  };
  return icons[num] || null;
}

/* ── Feature Comparison Row ── */
function CompareRow({ label, starter, advanced, master, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`${styles.compareRow} ${inView ? styles.visible : ''}`} style={{ transitionDelay: delay }}>
      <span className={styles.compareLabel}>{label}</span>
      <span className={styles.compareCell}>{starter}</span>
      <span className={`${styles.compareCell} ${styles.compareCellPro}`}>{advanced}</span>
      <span className={styles.compareCell}>{master}</span>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function Solutions() {
  const [heroRef, heroIn] = useInView(0.1);
  const [compareRef, compareIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);
  const [activeTab, setActiveTab] = useState('learners');

  const tabs = {
    learners: {
      title: 'For Individual Learners',
      desc: 'Whether you\'re a student, professional, or lifelong learner, CogniVia adapts to your pace and goals — turning any free moment into a productive learning session.',
      points: ['Self-paced trivia across 500+ topics', 'Smart flashcard review with spaced repetition', 'Daily streaks and XP rewards', 'Personal progress dashboard'],
    },
    educators: {
      title: 'For Educators & Teachers',
      desc: 'Create custom question sets, assign learning challenges to your class, and track every student\'s progress from one powerful dashboard.',
      points: ['Custom question bank creation', 'Class assignment & scheduling tools', 'Student performance analytics', 'Curriculum-aligned content packs'],
    },
    teams: {
      title: 'For Teams & Organizations',
      desc: 'Deploy CogniVia across your organization to reinforce training, onboarding knowledge, and team learning through engaging, measurable trivia.',
      points: ['Team leaderboards & competitions', 'Collaborative learning sessions', 'Admin controls & reporting', 'Shared progress dashboards'],
    },
  };

  return (
    <div className={styles.pageContainer}>
      <WaveBg />

      {/* ── Top Nav ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLogo}></div>
        <nav className={styles.topBarNav}>
          <Link to="/about"       className={styles.navLink}>About</Link>
          <Link to="/solutions"   className={`${styles.navLink} ${styles.navActive}`}>Solutions</Link>
          <Link to="/howitworks"  className={styles.navLink}>How It Works</Link>
          <Link to="/faq"         className={styles.navLink}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>Our Solutions</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>One Platform.</span>
          <span className={styles.heroAccent}>Every Learner.</span>
          <span className={styles.heroSub}>Infinite Possibilities.</span>
        </h1>
        <p className={styles.heroBody}>
          CogniVia delivers a full suite of AI-powered learning tools — from gamified trivia
          and smart flashcards to deep analytics and team competitions.
        </p>
      </section>

      {/* ═══════════════════════════════════════
          WHO IS IT FOR — TAB SWITCHER
      ═══════════════════════════════════════ */}
      <section className={styles.audienceSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Who It's For</span>
          <h2 className={styles.sectionTitle}>
            Built for <span className={styles.gradientText}>Every Scenario</span>
          </h2>
        </div>

        <div className={styles.tabBar}>
          {Object.keys(tabs).map(key => (
            <button
              key={key}
              className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          <div className={styles.tabLeft}>
            <h3 className={styles.tabTitle}>{tabs[activeTab].title}</h3>
            <p className={styles.tabDesc}>{tabs[activeTab].desc}</p>
            <Link to="/register" className={styles.tabCta}>Get Started Free →</Link>
          </div>
          <div className={styles.tabRight}>
            {tabs[activeTab].points.map((p, i) => (
              <div key={i} className={styles.tabPoint} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.tabPointCheck}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CORE SOLUTIONS — alternating cards
      ═══════════════════════════════════════ */}
      <section className={styles.solutionsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Core Solutions</span>
          <h2 className={styles.sectionTitle}>
            Four Pillars of <span className={styles.gradientText}>CogniVia</span>
          </h2>
        </div>

        <div className={styles.solutionsList}>
          <SolutionCard
            number="01" delay="0s" flip={false}
            accent="rgba(34,211,238,0.9)"
            title="Adaptive Trivia Engine"
            subtitle="Smart. Responsive. Addictive."
            body="Our core engine serves thousands of questions across science, history, tech, arts, and more. Difficulty adjusts in real-time based on your performance, keeping you in the optimal learning zone — challenged but never overwhelmed."
            features={['500+ topic categories', 'Real-time difficulty scaling', 'Instant feedback & explanations', 'Timed & untimed modes']}
          />
          <SolutionCard
            number="02" delay="0.05s" flip={true}
            accent="rgba(232,121,249,0.9)"
            title="Smart Flashcard System"
            subtitle="Review Smarter. Remember Longer."
            body="Powered by spaced repetition science, CogniVia automatically generates flashcards from your trivia sessions and quiz history. Cards surface at the perfect moment before you forget — dramatically improving long-term retention with less effort."
            features={['Auto-generated from your sessions', 'Spaced repetition scheduling', 'Topic-based card collections', 'Confidence self-rating system']}
          />
          <SolutionCard
            number="03" delay="0.05s" flip={false}
            accent="rgba(168,85,247,0.9)"
            title="Progress & Analytics"
            subtitle="See Exactly How You're Growing."
            body="Detailed dashboards give you full visibility into your learning journey. Track streaks, identify knowledge gaps, measure improvement over time, and receive AI-powered recommendations for what to study next."
            features={['Visual progress charts', 'Weak-area detection', 'Study streak tracking', 'Weekly performance reports']}
          />
          <SolutionCard
            number="04" delay="0.05s" flip={true}
            accent="rgba(34,211,238,0.9)"
            title="Multiplayer & Social"
            subtitle="Compete. Collaborate. Conquer."
            body="Challenge friends or compete with learners worldwide in live trivia battles. Climb global leaderboards, join study groups, and earn badges that showcase your expertise. Learning is more fun when it's social."
            features={['Live 1v1 trivia battles', 'Global leaderboards', 'Study group creation', 'Achievement badges & XP']}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURE COMPARISON TABLE
          (replaces billing comparison — now shows
           feature depth across learning modes)
      ═══════════════════════════════════════ */}
      <section ref={compareRef} className={`${styles.compareSection} ${compareIn ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Learning Modes</span>
          <h2 className={styles.sectionTitle}>
            Find Your <span className={styles.gradientText}>Learning Style</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(241,245,249,0.55)', fontWeight: 300, lineHeight: 1.75 }}>
            CogniVia adapts to how you learn best. Whether you prefer solo deep dives, flashcard
            review, or competitive play — there's a mode built for you.
          </p>
        </div>

        <div className={styles.compareTable}>
          {/* Header */}
          <div className={`${styles.compareRow} ${styles.compareHeader}`}>
            <span className={styles.compareLabel}>Feature</span>
            <span className={styles.compareCell}>Solo Mode</span>
            <span className={`${styles.compareCell} ${styles.compareCellPro}`}>
              Study Mode
              <span className={styles.proTag}>Recommended</span>
            </span>
            <span className={styles.compareCell}>Battle Mode</span>
          </div>

          <CompareRow label="Trivia Questions"       starter="All topics"        advanced="All topics"          master="All topics"        delay="0s"    />
          <CompareRow label="Smart Flashcards"       starter="Basic review"      advanced="Spaced repetition"   master="Quick review"      delay="0.05s" />
          <CompareRow label="Progress Tracking"      starter="Basic stats"       advanced="Full analytics"      master="Battle history"    delay="0.1s"  />
          <CompareRow label="Difficulty Scaling"     starter="Manual"            advanced="AI-adaptive"         master="Opponent-matched"  delay="0.15s" />
          <CompareRow label="Leaderboards"           starter="—"                 advanced="Topic boards"        master="Global boards"     delay="0.2s"  />
          <CompareRow label="XP & Rewards"           starter="✓"                 advanced="✓"                   master="Bonus XP"          delay="0.25s" />
          <CompareRow label="Study Streaks"          starter="✓"                 advanced="✓"                   master="✓"                 delay="0.3s"  />
          <CompareRow label="Best For"               starter="Casual learning"   advanced="Deep retention"      master="Competitive fun"   delay="0.35s" />
        </div>

        <div className={styles.compareActions}>
          <Link to="/about"    className={styles.btnOutline}>Learn More</Link>
          <Link to="/register" className={styles.btnPrimary}>Start for Free →</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section ref={ctaRef} className={`${styles.ctaSection} ${ctaIn ? styles.visible : ''}`}>
        <div className={styles.ctaGlow}></div>
        <div className={styles.ctaInner}>
          <span className={styles.sectionEyebrow}>Ready to Level Up?</span>
          <h2 className={styles.ctaTitle}>
            The Right Solution<br />
            <span className={styles.gradientText}>Is Waiting for You</span>
          </h2>
          <p className={styles.ctaBody}>
            Join thousands of learners already using CogniVia to study smarter,
            retain more, and actually enjoy the process.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.btnPrimary}>Get Started Free →</Link>
            <Link to="/about"    className={styles.btnOutline}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>CogniVia</span>
        <span className={styles.footerCopy}>© {new Date().getFullYear()} CogniVia. All rights reserved.</span>
        <div className={styles.footerLinks}>
          <Link to="/privacy" className={styles.footerLink}>Privacy</Link>
          <Link to="/terms"   className={styles.footerLink}>Terms</Link>
          <Link to="/contact" className={styles.footerLink}>Contact</Link>
        </div>
      </footer>
    </div>
  );
}