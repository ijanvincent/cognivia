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

/* ── Wave SVG Background (same as all pages) ── */
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
        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
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

/* ── Comparison Table Row ── */
function CompareRow({ label, free, pro, enterprise, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`${styles.compareRow} ${inView ? styles.visible : ''}`} style={{ transitionDelay: delay }}>
      <span className={styles.compareLabel}>{label}</span>
      <span className={styles.compareCell}>{free}</span>
      <span className={`${styles.compareCell} ${styles.compareCellPro}`}>{pro}</span>
      <span className={styles.compareCell}>{enterprise}</span>
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
      points: ['Self-paced trivia across 500+ topics', 'AI-generated quizzes from your own materials', 'Daily streaks and XP rewards', 'Personal progress dashboard'],
    },
    educators: {
      title: 'For Educators & Teachers',
      desc: 'Create custom question sets, assign learning challenges to your class, and track every student\'s progress from one powerful dashboard.',
      points: ['Custom question bank creation', 'Class assignment & scheduling tools', 'Student performance analytics', 'Curriculum-aligned content packs'],
    },
    teams: {
      title: 'For Teams & Organizations',
      desc: 'Deploy CogniVia across your organization to reinforce training, onboarding knowledge, and compliance understanding through engaging, measurable trivia.',
      points: ['Team leaderboards & competitions', 'Custom branding & white-labeling', 'Admin controls & reporting', 'SSO & enterprise integrations'],
    },
  };

  return (
    <div className={styles.pageContainer}>
      <WaveBg />

      {/* ── Top Nav ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLogo}></div>
        <nav className={styles.topBarNav}>
          <Link to="/about"     className={styles.navLink}>About</Link>
          <Link to="/solutions" className={`${styles.navLink} ${styles.navActive}`}>Solutions</Link>
          <Link to="/pricing"   className={styles.navLink}>Pricing</Link>
          <Link to="/faq"       className={styles.navLink}>FAQ</Link>
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
          and intelligent scanning to deep analytics and team competitions.
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
            title="AI Scanner & Generator"
            subtitle="Scan Anything. Learn Instantly."
            body="Point your camera at any textbook, article, whiteboard, or handwritten note. Our AI reads the content and instantly generates relevant trivia questions, flash cards, and learning exercises — turning any resource into a quiz."
            features={['Image & document scanning', 'Multi-language support', 'Auto-generated flashcards', 'PDF & photo import']}
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
          COMPARISON TABLE
      ═══════════════════════════════════════ */}
      <section ref={compareRef} className={`${styles.compareSection} ${compareIn ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Compare Plans</span>
          <h2 className={styles.sectionTitle}>
            Find the Right <span className={styles.gradientText}>Fit for You</span>
          </h2>
        </div>

        <div className={styles.compareTable}>
          {/* Header */}
          <div className={`${styles.compareRow} ${styles.compareHeader}`}>
            <span className={styles.compareLabel}>Feature</span>
            <span className={styles.compareCell}>Free</span>
            <span className={`${styles.compareCell} ${styles.compareCellPro}`}>
              Pro
              <span className={styles.proTag}>Popular</span>
            </span>
            <span className={styles.compareCell}>Enterprise</span>
          </div>

          <CompareRow label="Trivia Topics"          free="50 topics"      pro="500+ topics"    enterprise="Unlimited"     delay="0s"    />
          <CompareRow label="AI Scanner"             free="5 scans/mo"     pro="Unlimited"      enterprise="Unlimited"     delay="0.05s" />
          <CompareRow label="Progress Analytics"     free="Basic"          pro="Advanced"       enterprise="Full Suite"    delay="0.1s"  />
          <CompareRow label="Multiplayer"            free="Public rooms"   pro="Private rooms"  enterprise="Custom rooms"  delay="0.15s" />
          <CompareRow label="Custom Question Sets"   free="—"              pro="✓"              enterprise="✓"             delay="0.2s"  />
          <CompareRow label="Team Management"        free="—"              pro="Up to 5"        enterprise="Unlimited"     delay="0.25s" />
          <CompareRow label="Admin Dashboard"        free="—"              pro="—"              enterprise="✓"             delay="0.3s"  />
          <CompareRow label="Priority Support"       free="—"              pro="Email"          enterprise="Dedicated"     delay="0.35s" />
        </div>

        <div className={styles.compareActions}>
          <Link to="/pricing"  className={styles.btnOutline}>View Full Pricing</Link>
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
          <a href="#" className={styles.footerLink}>Privacy</a>
          <a href="#" className={styles.footerLink}>Terms</a>
          <a href="#" className={styles.footerLink}>Contact</a>
        </div>
      </footer>
    </div>
  );
}