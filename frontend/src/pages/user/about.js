import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './about.module.css';


function useCounter(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}


function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}


function StatCard({ value, suffix, label, delay }) {
  const [ref, inView] = useInView();
  const count = useCounter(value, 1600, inView);
  return (
    <div ref={ref} className={styles.statCard} style={{ animationDelay: delay }}>
      <span className={styles.statNumber}>{count}{suffix}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}


function FeatureCard({ icon, title, body, accent, delay }) {
  return (
    <div className={styles.featureCard} style={{ '--card-accent': accent, animationDelay: delay }}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureBody}>{body}</p>
    </div>
  );
}

export default function About() {
  const [heroRef, heroIn] = useInView(0.1);
  const [missionRef, missionIn] = useInView(0.1);
  const [featRef, featIn] = useInView(0.1);
  const [goalRef, goalIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  return (
    <div className={styles.pageContainer}>


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

   
      <div className={styles.topBar}>
        <div className={styles.topBarLogo}></div>
        <nav className={styles.topBarNav}>
          <Link to="/about" className={styles.navLink}>About</Link>
          <Link to="/solutions" className={styles.navLink}>Solutions</Link>
          <Link to="/howitworks" className={styles.navLink}>How It Works</Link>
          <Link to="/faq" className={styles.navLink}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

     
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>About CogniVia</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>Where Learning</span>
          <span className={styles.heroAccent}>Meets Play.</span>
          <span className={styles.heroSub}>A smarter way to grow.</span>
        </h1>
        <p className={styles.heroBody}>
          CogniVia is an AI-powered learning companion that turns everyday knowledge
          into an engaging, gamified adventure — built for curious minds who refuse to stop growing.
        </p>

  
        <div className={styles.statsRow}>
          <StatCard value={500}  suffix="+"  label="Topics Covered"    delay="0s"    />
          <StatCard value={10}   suffix="K+" label="Active Learners"   delay="0.12s" />
          <StatCard value={98}   suffix="%"  label="Satisfaction Rate" delay="0.24s" />
          <StatCard value={3}    suffix="x"  label="Faster Retention"  delay="0.36s" />
        </div>
      </section>

 
      <section ref={missionRef} className={`${styles.missionSection} ${missionIn ? styles.visible : ''}`}>
        <div className={styles.missionInner}>
          <div className={styles.missionLeft}>
            <span className={styles.sectionEyebrow}>Our Mission</span>
            <h2 className={styles.sectionTitle}>
              Foster Effective Learning Through{' '}
              <span className={styles.gradientText}>Intelligent Play</span>
            </h2>
            <p className={styles.sectionBody}>
              We believe education doesn't have to feel like a chore. CogniVia combines the science of
              spaced repetition and active recall with AI-powered personalization — delivering a learning
              experience that adapts to you, challenges you, and rewards your progress.
            </p>
            <p className={styles.sectionBody}>
              By merging gamification with cutting-edge AI, we've created a system that doesn't just
              test what you know — it builds who you're becoming.
            </p>
            <div className={styles.missionTags}>
              {['Adaptive Learning', 'AI-Powered', 'Gamified', 'Progress Tracking'].map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>

          <div className={styles.missionRight}>
            <div className={styles.missionCard}>
              <div className={styles.missionCardGlow}></div>
              <div className={styles.missionCardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <blockquote className={styles.missionQuote}>
                "The more I know, the more I realize how much I don't know — CogniVia makes that journey irresistible."
              </blockquote>
              <div className={styles.missionQuoteAuthor}>— The CogniVia Philosophy</div>
            </div>
          </div>
        </div>
      </section>


      <section ref={featRef} className={`${styles.featuresSection} ${featIn ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>What We Offer</span>
          <h2 className={styles.sectionTitle}>
            Built for the <span className={styles.gradientText}>Modern Learner</span>
          </h2>
          <p className={styles.sectionDesc}>
            Every feature in CogniVia is designed to maximize knowledge retention, spark curiosity,
            and make learning a habit you actually look forward to.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <FeatureCard delay="0s" accent="rgba(34,211,238,0.7)"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            }
            title="Trivia Game Engine"
            body="Thousands of curated questions across science, history, tech, and more. Difficulty adapts in real-time to keep you in the optimal learning zone."
          />
          <FeatureCard delay="0.1s" accent="rgba(232,121,249,0.7)"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            }
            title="Smart Flashcards"
            body="Auto-generated flashcards from your trivia sessions using spaced repetition science. Review the right material at the right time for maximum retention."
          />
          <FeatureCard delay="0.2s" accent="rgba(168,85,247,0.7)"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            }
            title="Progress Analytics"
            body="Detailed dashboards show your strengths, knowledge gaps, and streaks. See exactly how your cognitive skills improve over time."
          />
          <FeatureCard delay="0.3s" accent="rgba(34,211,238,0.7)"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
            }
            title="Personalized Learning"
            body="Your skill profile evolves with every session. CogniVia recommends the right topics at the right time, maximizing retention with minimal effort."
          />
          <FeatureCard delay="0.4s" accent="rgba(232,121,249,0.7)"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            }
            title="Multiplayer Challenges"
            body="Compete with friends or learners worldwide in live trivia battles. Climb global leaderboards and prove your knowledge under pressure."
          />
          <FeatureCard delay="0.5s" accent="rgba(168,85,247,0.7)"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            }
            title="Rewards & Badges"
            body="Earn XP, unlock achievement badges, and build daily streaks. CogniVia's reward system keeps motivation high and learning consistent."
          />
        </div>
      </section>


      <section ref={goalRef} className={`${styles.goalsSection} ${goalIn ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Our Goals</span>
          <h2 className={styles.sectionTitle}>
            Six Pillars of <span className={styles.gradientText}>CogniVia</span>
          </h2>
        </div>

        <div className={styles.goalsList}>
          {[
            { num: '01', title: 'Expand Knowledge',       body: 'Encourage users to explore new topics and deepen understanding through fun, interactive trivia experiences across diverse subjects.' },
            { num: '02', title: 'Sharpen Cognition',      body: 'Improve memory, problem-solving, and critical thinking through carefully designed challenges that push cognitive boundaries.' },
            { num: '03', title: 'Personalize Learning',   body: 'Deliver experiences that adapt to each user\'s skill level, learning style, and pace — because no two learners are alike.' },
            { num: '04', title: 'Smart Flashcard Review', body: 'Reinforce knowledge with auto-generated flashcards powered by spaced repetition — the most scientifically proven study method available.' },
            { num: '05', title: 'Track Progress',         body: 'Give learners full visibility into their journey with detailed analytics, streaks, and measurable milestones.' },
            { num: '06', title: 'Make Studying Joyful',   body: 'Be the learning companion that makes education feel like a reward — blending knowledge with entertainment seamlessly.' },
          ].map((g, i) => (
            <div key={g.num} className={styles.goalItem} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.goalNum}>{g.num}</span>
              <div className={styles.goalContent}>
                <h3 className={styles.goalTitle}>{g.title}</h3>
                <p className={styles.goalBody}>{g.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

   
      <section ref={ctaRef} className={`${styles.ctaSection} ${ctaIn ? styles.visible : ''}`}>
        <div className={styles.ctaGlow}></div>
        <div className={styles.ctaInner}>
          <span className={styles.sectionEyebrow}>Ready to Begin?</span>
          <h2 className={styles.ctaTitle}>
            Start Your Learning<br />
            <span className={styles.gradientText}>Journey Today</span>
          </h2>
          <p className={styles.ctaBody}>
            Join thousands of curious learners already levelling up with CogniVia.
            Your first game is just one click away.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.ctaBtnPrimary}>Get Started Free →</Link>
            <Link to="/login"    className={styles.ctaBtnOutline}>Sign In</Link>
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