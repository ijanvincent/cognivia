import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './faq.module.css';

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

/* ── FAQ Item ── */
function FaqItem({ q, a, index, activeIndex, setActiveIndex, catDelay }) {
  const [ref, inView] = useInView(0.1);
  const isOpen = activeIndex === index;

  return (
    <div
      ref={ref}
      className={`${styles.faqItem} ${inView ? styles.visible : ''} ${isOpen ? styles.faqOpen : ''}`}
      style={{ transitionDelay: catDelay }}
    >
      <button className={styles.faqQ} onClick={() => setActiveIndex(isOpen ? null : index)}>
        <span className={styles.faqQText}>{q}</span>
        <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div className={styles.faqA} style={{ maxHeight: isOpen ? '400px' : '0px' }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ── Category Section ── */
function FaqCategory({ icon, title, items, startIndex, activeIndex, setActiveIndex }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div ref={ref} className={`${styles.faqCategory} ${inView ? styles.visible : ''}`}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon}>{icon}</span>
        <h3 className={styles.categoryTitle}>{title}</h3>
      </div>
      <div className={styles.categoryItems}>
        {items.map((item, i) => (
          <FaqItem
            key={i}
            q={item.q}
            a={item.a}
            index={startIndex + i}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            catDelay={`${i * 0.05}s`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function FAQ() {
  const [heroRef, heroIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Getting Started',
      items: [
        {
          q: 'What is CogniVia?',
          a: 'CogniVia is an AI-powered interactive learning companion that turns knowledge into an engaging, gamified experience. It combines adaptive trivia games, AI-powered document scanning, progress analytics, and multiplayer challenges to make learning fun and effective for students, professionals, and lifelong learners.',
        },
        {
          q: 'How do I create an account?',
          a: 'Click "Get Started Free" on any page and fill in your username, email, and password. Your account is activated instantly — no email verification wait time. You\'ll be taken directly to your learning dashboard where you can start your first trivia session right away.',
        },
        {
          q: 'Is CogniVia free to use?',
          a: 'Yes! CogniVia has a generous free plan that includes 50 topic categories, 5 AI scans per month, basic progress tracking, and access to public multiplayer rooms. For unlimited access, our Pro plan starts at $9/month. You can upgrade anytime from your account settings.',
        },
        {
          q: 'What devices and platforms does CogniVia support?',
          a: 'CogniVia is fully web-based and works on any modern browser — Chrome, Firefox, Safari, and Edge — on desktop, tablet, and mobile. No app download is required. A native mobile app is on our roadmap for a future release.',
        },
      ],
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Trivia & Learning',
      items: [
        {
          q: 'How does the adaptive difficulty system work?',
          a: 'Our AI engine tracks your answer accuracy, response time, and topic history in real-time. If you answer correctly quickly, difficulty increases. If you struggle, it eases back and reinforces fundamentals. This keeps you in the optimal learning zone — challenged but never overwhelmed — maximizing knowledge retention.',
        },
        {
          q: 'What subjects and topics are available?',
          a: 'Free users get access to 50 topic categories spanning science, history, geography, technology, arts, literature, and more. Pro users unlock 500+ categories including niche subjects, professional certifications, and specialized domains. We add new topic packs every month.',
        },
        {
          q: 'Can I create my own custom question sets?',
          a: 'Yes — Pro and Enterprise users can create unlimited custom question banks. You can write questions manually, import from spreadsheets, or use our AI Scanner to generate questions from your own materials. Custom sets can be kept private, shared with your team, or published to the community.',
        },
        {
          q: 'How does the AI Scanner generate questions from my materials?',
          a: 'Point your camera at any textbook, article, whiteboard, or handwritten notes — or upload a PDF or image. Our computer vision and NLP models read the content and automatically generate relevant trivia questions, multiple-choice options, and flashcards. Free users get 5 scans per month; Pro users get unlimited scans.',
        },
      ],
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Multiplayer & Social',
      items: [
        {
          q: 'How do live multiplayer trivia battles work?',
          a: 'In a live battle, two players are matched in real-time and given the same questions simultaneously. Points are awarded for correct answers and speed. Matches typically last 5–10 minutes. Free users can join public rooms; Pro users can create private rooms and invite specific friends or teammates.',
        },
        {
          q: 'How do leaderboards work?',
          a: 'There are global, topic-specific, and friend leaderboards. Your rank is calculated from your cumulative XP earned across all trivia sessions, scans, and battles. Leaderboards reset monthly, giving everyone a fresh chance to climb. Pro users also get access to private team leaderboards.',
        },
        {
          q: 'Can I challenge a specific friend?',
          a: 'Yes — on Pro and Enterprise plans you can send direct challenge invites to any CogniVia user via their username or a shareable link. Challenges can be set with a specific topic, difficulty, and question count. The result is shared to both players\' profiles automatically.',
        },
      ],
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Plans & Billing',
      items: [
        {
          q: 'Can I switch or cancel my plan at any time?',
          a: 'Absolutely. You can upgrade, downgrade, or cancel from your account settings at any time with no penalties. Upgrades take effect immediately and are prorated. Downgrades take effect at the end of your current billing period. Cancelled accounts retain access until the period ends.',
        },
        {
          q: 'Is there a free trial for Pro?',
          a: 'Yes — Pro comes with a 14-day free trial, no credit card required. You get full access to all Pro features during the trial. After 14 days, you\'ll be prompted to enter payment details to continue. If you don\'t subscribe, your account reverts to the Free plan with no data loss.',
        },
        {
          q: 'Do you offer student or nonprofit discounts?',
          a: 'Yes. We offer a 50% discount for verified students (with a valid .edu email or student ID) and registered nonprofit organizations. Contact our support team with proof of eligibility and the discount will be applied to your account within 24 hours.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe. We never store your full card details on our servers.',
        },
      ],
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Privacy & Security',
      items: [
        {
          q: 'How is my personal data handled?',
          a: 'Your data belongs to you. We collect only what\'s necessary to provide the service — your email, username, and learning activity. We never sell, rent, or share your personal data with third parties for advertising. All data is encrypted at rest and in transit using AES-256 and TLS 1.3.',
        },
        {
          q: 'What happens to my data if I delete my account?',
          a: 'When you delete your account, all personal data including your profile, progress, custom question sets, and payment history is permanently deleted within 30 days. Anonymized, aggregated usage statistics (which cannot identify you) may be retained for product analytics.',
        },
        {
          q: 'Is CogniVia GDPR and COPPA compliant?',
          a: 'Yes. CogniVia is fully GDPR compliant for users in the European Economic Area and COPPA compliant for users under 13 in the United States. Users can request a full data export or deletion at any time from account settings. Our full Privacy Policy is available at the footer of every page.',
        },
      ],
    },
  ];

  // Flatten for global index tracking (accordion: only one open at a time)
  let globalIndex = 0;
  const categoriesWithIndex = categories.map(cat => {
    const start = globalIndex;
    globalIndex += cat.items.length;
    return { ...cat, startIndex: start };
  });

  // Search filter
  const filtered = searchQuery.trim()
    ? categoriesWithIndex.map(cat => ({
        ...cat,
        items: cat.items.filter(
          item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.items.length > 0)
    : categoriesWithIndex;

  const totalQuestions = categories.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <div className={styles.pageContainer}>
      <WaveBg />

      {/* ── Top Nav ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLogo}></div>
        <nav className={styles.topBarNav}>
          <Link to="/about"     className={styles.navLink}>About</Link>
          <Link to="/solutions" className={styles.navLink}>Solutions</Link>
          <Link to="/pricing"   className={styles.navLink}>Pricing</Link>
          <Link to="/faq"       className={`${styles.navLink} ${styles.navActive}`}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>Help Center</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>Got Questions?</span>
          <span className={styles.heroAccent}>We've Got</span>
          <span className={styles.heroSub}>Answers.</span>
        </h1>
        <p className={styles.heroBody}>
          Everything you need to know about CogniVia — from getting started to
          advanced features, billing, and privacy.
        </p>

        {/* Search Bar */}
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={`Search ${totalQuestions} questions…`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className={styles.searchMeta}>
            {searchQuery
              ? `${filtered.reduce((a, c) => a + c.items.length, 0)} result${filtered.reduce((a, c) => a + c.items.length, 0) !== 1 ? 's' : ''} for "${searchQuery}"`
              : `${categories.length} categories · ${totalQuestions} questions`}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ CATEGORIES
      ═══════════════════════════════════════ */}
      <section className={styles.faqSection}>
        {filtered.length > 0 ? (
          filtered.map((cat, i) => (
            <FaqCategory
              key={i}
              icon={cat.icon}
              title={cat.title}
              items={cat.items}
              startIndex={cat.startIndex}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p>No questions match "<strong>{searchQuery}</strong>"</p>
            <button className={styles.noResultsReset} onClick={() => setSearchQuery('')}>Clear search</button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          STILL NEED HELP
      ═══════════════════════════════════════ */}
      <section className={styles.helpStrip}>
        <div className={styles.helpStripInner}>
          <div className={styles.helpItem}>
            <div className={styles.helpItemIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className={styles.helpItemTitle}>Email Support</span>
              <span className={styles.helpItemDesc}>Get a response within 24 hours on weekdays.</span>
            </div>
          </div>
          <div className={styles.helpDivider}></div>
          <div className={styles.helpItem}>
            <div className={styles.helpItemIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <span className={styles.helpItemTitle}>Live Chat</span>
              <span className={styles.helpItemDesc}>Available Mon–Fri, 9am–6pm EST for Pro users.</span>
            </div>
          </div>
          <div className={styles.helpDivider}></div>
          <div className={styles.helpItem}>
            <div className={styles.helpItemIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className={styles.helpItemTitle}>Documentation</span>
              <span className={styles.helpItemDesc}>In-depth guides and tutorials for every feature.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ═══════════════════════════════════════ */}
      <section ref={ctaRef} className={`${styles.ctaSection} ${ctaIn ? styles.visible : ''}`}>
        <div className={styles.ctaGlow}></div>
        <div className={styles.ctaInner}>
          <span className={styles.sectionEyebrow}>Still Curious?</span>
          <h2 className={styles.ctaTitle}>
            Ready to Experience<br />
            <span className={styles.gradientText}>CogniVia Yourself?</span>
          </h2>
          <p className={styles.ctaBody}>
            The best way to answer your questions is to try it.
            Start free — no credit card required.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.btnPrimary}>Get Started Free →</Link>
            <Link to="/pricing"  className={styles.btnOutline}>View Pricing</Link>
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