import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './howitworks.module.css';


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


function StepCard({ step, icon, title, body, accent, delay }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`${styles.stepCard} ${inView ? styles.visible : ''}`}
      style={{ '--accent': accent, transitionDelay: delay }}
    >
      <div className={styles.stepTop}>
        <div className={styles.stepIconWrap} style={{ background: `${accent}18`, borderColor: `${accent}33`, color: accent }}>
          {icon}
        </div>
        <span className={styles.stepNum}>{step}</span>
      </div>
      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepBody}>{body}</p>
      <div className={styles.stepAccentLine} style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}></div>
    </div>
  );
}


function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`${styles.faqItem} ${inView ? styles.visible : ''} ${open ? styles.faqOpen : ''}`}
      style={{ transitionDelay: delay }}>
      <button className={styles.faqQ} onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      <div className={styles.faqA} style={{ maxHeight: open ? '200px' : '0px' }}>
        <p>{a}</p>
      </div>
    </div>
  );
}


export default function HowItWorks() {
  const [heroRef, heroIn] = useInView(0.1);
  const [faqRef, faqIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  const steps = [
    {
      step: '01',
      accent: 'rgba(168,85,247,0.9)',
      title: 'Create Your Account',
      body: 'Sign up in seconds — no credit card, no friction. Choose your topics of interest and let CogniVia build your personalized learning profile instantly.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
    },
    {
      step: '02',
      accent: 'rgba(34,211,238,0.9)',
      title: 'Play & Learn',
      body: 'Dive into thousands of trivia questions across your chosen topics. The adaptive engine adjusts difficulty in real-time to your exact skill level — no more boring questions.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
    },
    {
      step: '03',
      accent: 'rgba(232,121,249,0.9)',
      title: 'Review & Level Up',
      body: 'Smart flashcards auto-generate from your sessions. Spaced repetition schedules review at the perfect moment — before you forget. Watch your knowledge compound over time.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
    },
  ];

  const highlights = [
    { icon: '🎯', label: 'Adaptive Difficulty',  desc: 'Questions scale to your level in real-time — never too easy, never too hard.' },
    { icon: '🧠', label: 'Spaced Repetition',    desc: 'Science-backed flashcard scheduling for maximum long-term memory retention.' },
    { icon: '🏆', label: 'Compete & Climb',      desc: 'Challenge friends, join live battles, and climb global leaderboards.' },
    { icon: '📈', label: 'Track Everything',     desc: 'See your growth with detailed analytics, streaks, and milestone badges.' },
  ];

  const sessionFlow = [
    { title: 'You answer a question',         body: 'The engine records your accuracy, response speed, topic, and difficulty level.' },
    { title: 'Difficulty adjusts instantly',  body: 'Get it right? The next question is harder. Struggle? It reinforces the concept before moving on.' },
    { title: 'Flashcards are generated',      body: 'Questions you found difficult become flashcards, scheduled for optimal review timing.' },
    { title: 'Your profile updates',          body: 'XP is awarded, streaks are tracked, and your topic mastery scores are recalculated live.' },
    { title: 'Analytics surface insights',    body: 'Your dashboard highlights weak areas, shows your growth curve, and suggests what to study next.' },
    { title: 'You come back stronger',        body: 'Each session builds on the last. Over time, your knowledge compounds — and it shows.' },
  ];

  const faqs = [
    { q: 'Is CogniVia completely free?',           a: 'Yes — CogniVia is free to use. Create an account and get full access to trivia, smart flashcards, analytics, and multiplayer modes right away.' },
    { q: 'How does adaptive difficulty work?',      a: 'Our engine tracks your accuracy and response speed in real-time. Consistent correct answers push difficulty up; struggles ease it back, keeping you in the optimal learning zone.' },
    { q: 'What are Smart Flashcards?',              a: 'After each trivia session, CogniVia auto-generates flashcards from questions you got wrong or found difficult. These are scheduled using spaced repetition — surfacing right before you\'re likely to forget.' },
    { q: 'How does multiplayer work?',              a: 'In live battle mode, you\'re matched with another player and given the same questions simultaneously. Points are awarded for accuracy and speed. Fast, competitive, and addictive.' },
    { q: 'Can I choose which topics to study?',     a: 'Absolutely. Browse 500+ topic categories and select exactly what you want to focus on — from world history and biology to coding and pop culture. Your profile remembers your preferences.' },
    { q: 'How is my progress tracked?',             a: 'Every session feeds your analytics dashboard. You can see accuracy by topic, daily streaks, XP earned, badge milestones, and a full history of improvement over time.' },
  ];

  return (
    <div className={styles.pageContainer}>
      <WaveBg />


      <div className={styles.topBar}>
        <div className={styles.topBarLogo}></div>
        <nav className={styles.topBarNav}>
          <Link to="/about"      className={styles.navLink}>About</Link>
          <Link to="/solutions"  className={styles.navLink}>Solutions</Link>
          <Link to="/howitworks" className={`${styles.navLink} ${styles.navActive}`}>How It Works</Link>
          <Link to="/faq"        className={styles.navLink}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

   
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>How It Works</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>Simple to Start.</span>
          <span className={styles.heroAccent}>Powerful to Use.</span>
          <span className={styles.heroSub}>Impossible to put down.</span>
        </h1>
        <p className={styles.heroBody}>
          CogniVia is designed to get you learning in minutes — no complicated setup,
          no steep learning curve. Just sign up, play, and grow.
        </p>
      </section>

 
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Your Journey</span>
          <h2 className={styles.sectionTitle}>
            Up & Running in <span className={styles.gradientText}>3 Steps</span>
          </h2>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((s, i) => (
            <StepCard key={i} {...s} delay={`${i * 0.1}s`} />
          ))}
        </div>
      </section>

      <section className={styles.valueStrip}>
        {highlights.map((v, i) => (
          <div key={i} className={styles.valueItem} style={{ animationDelay: `${i * 0.08}s` }}>
            <span className={styles.valueEmoji}>{v.icon}</span>
            <span className={styles.valueLabel}>{v.label}</span>
            <span className={styles.valueDesc}>{v.desc}</span>
          </div>
        ))}
      </section>

      <section style={{ position: 'relative', zIndex: 5, maxWidth: 1100, margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
          <span className={styles.sectionEyebrow}>Inside Every Session</span>
          <h2 className={styles.sectionTitle}>
            Every Answer <span className={styles.gradientText}>Works for You</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(241,245,249,0.55)', fontWeight: 300, lineHeight: 1.75 }}>
            CogniVia doesn't just ask questions — it builds a complete learning loop
            around every interaction so nothing is ever wasted.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', overflow: 'hidden', backdropFilter: 'blur(20px)',
        }}>
          {sessionFlow.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px', padding: '28px 40px',
              borderBottom: i < sessionFlow.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              transition: 'background 0.2s',
            }}>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 800,
                color: '#22d3ee', opacity: 0.6, flexShrink: 0, paddingTop: '3px',
                letterSpacing: '0.08em', minWidth: '28px',
              }}>0{i + 1}</span>
              <div>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 700,
                  color: '#f1f5f9', marginBottom: '6px', letterSpacing: '-0.2px',
                }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.75, color: 'rgba(241,245,249,0.55)', fontWeight: 300 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section ref={faqRef} className={`${styles.faqSection} ${faqIn ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Got Questions?</span>
          <h2 className={styles.sectionTitle}>
            Quick <span className={styles.gradientText}>Answers</span>
          </h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} delay={`${i * 0.06}s`} />
          ))}
        </div>
      </section>

      <section ref={ctaRef} className={`${styles.ctaSection} ${ctaIn ? styles.visible : ''}`}>
        <div className={styles.ctaGlow}></div>
        <div className={styles.ctaInner}>
          <span className={styles.sectionEyebrow}>Ready to Begin?</span>
          <h2 className={styles.ctaTitle}>
            Start Learning for<br />
            <span className={styles.gradientText}>Free Today</span>
          </h2>
          <p className={styles.ctaBody}>
            Join thousands of learners already levelling up with CogniVia.
            No credit card needed. No setup. Just learning.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register"  className={styles.btnPrimary}>Get Started Free →</Link>
            <Link to="/solutions" className={styles.btnOutline}>Explore Features</Link>
          </div>
        </div>
      </section>


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