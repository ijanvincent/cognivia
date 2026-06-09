import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/pricing.module.css';


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


function PricingCard({ plan, price, annualPrice, period, description, features, cta, ctaLink, accent, popular, delay, billing }) {
  const [ref, inView] = useInView();
  const displayPrice = billing === 'annual' ? annualPrice : price;
  const displayPeriod = billing === 'annual' ? '/mo, billed annually' : '/month';

  return (
    <div
      ref={ref}
      className={`${styles.pricingCard} ${popular ? styles.pricingCardPopular : ''} ${inView ? styles.visible : ''}`}
      style={{ '--accent': accent, transitionDelay: delay }}
    >
      {popular && (
        <div className={styles.popularBadge}>
          <span className={styles.popularBadgeText}>Most Popular</span>
        </div>
      )}
      <div className={styles.cardTop}>
        <div className={styles.planIconWrap} style={{ background: `${accent}18`, borderColor: `${accent}33` }}>
          {getPlanIcon(plan)}
        </div>
        <span className={styles.planName}>{plan}</span>
        <p className={styles.planDesc}>{description}</p>
      </div>
      <div className={styles.priceRow}>
        <span className={styles.priceCurrency}>$</span>
        <span className={styles.priceAmount}>{displayPrice}</span>
        <span className={styles.pricePeriod}>{displayPeriod}</span>
      </div>
      {billing === 'annual' && price !== '0' && (
        <div className={styles.savingsBadge}>
          Save {Math.round((1 - annualPrice / price) * 100)}% vs monthly
        </div>
      )}
      <div className={styles.divider} style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}></div>
      <ul className={styles.featureList}>
        {features.map((f, i) => (
          <li key={i} className={`${styles.featureItem} ${f.disabled ? styles.featureDisabled : ''}`}>
            <span className={styles.featureCheck} style={{ background: f.disabled ? 'transparent' : `${accent}18`, borderColor: f.disabled ? 'rgba(255,255,255,0.08)' : `${accent}33`, color: f.disabled ? 'rgba(241,245,249,0.2)' : accent }}>
              {f.disabled
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              }
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
      <Link to={ctaLink} className={`${styles.cardCta} ${popular ? styles.cardCtaPrimary : styles.cardCtaOutline}`}
        style={popular ? {} : { '--border-color': accent }}>
        {cta}
      </Link>
    </div>
  );
}

function getPlanIcon(plan) {
  const icons = {
    Free: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    Pro: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    Enterprise: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M9 8h1m-1 4h1m-1 4h1M14 8h1m-1 4h1m-1 4h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
      </svg>
    ),
  };
  return icons[plan] || null;
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


export default function Pricing() {
  const [heroRef, heroIn] = useInView(0.1);
  const [faqRef, faqIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);
  const [billing, setBilling] = useState('monthly');

  const plans = [
    {
      plan: 'Free',
      price: '0',
      annualPrice: '0',
      description: 'Perfect for curious learners just getting started.',
      accent: 'rgba(168,85,247,0.9)',
      cta: 'Get Started Free',
      ctaLink: '/register',
      features: [
        { text: '50 trivia topic categories' },
        { text: '5 AI scans per month' },
        { text: 'Basic progress dashboard' },
        { text: 'Public multiplayer rooms' },
        { text: 'Daily streak tracking' },
        { text: 'Custom question sets', disabled: true },
        { text: 'Private multiplayer rooms', disabled: true },
        { text: 'Priority support', disabled: true },
      ],
    },
    {
      plan: 'Pro',
      price: '9',
      annualPrice: '7',
      description: 'For dedicated learners who want the full CogniVia experience.',
      accent: 'rgba(34,211,238,0.9)',
      popular: true,
      cta: 'Start Pro Free →',
      ctaLink: '/register',
      features: [
        { text: '500+ trivia topic categories' },
        { text: 'Unlimited AI scans' },
        { text: 'Advanced analytics & insights' },
        { text: 'Private multiplayer rooms' },
        { text: 'Custom question sets' },
        { text: 'PDF & photo import' },
        { text: 'Team management (up to 5)' },
        { text: 'Email priority support' },
      ],
    },
    {
      plan: 'Enterprise',
      price: '29',
      annualPrice: '23',
      description: 'Built for teams, schools, and organizations at scale.',
      accent: 'rgba(232,121,249,0.9)',
      cta: 'Contact Sales',
      ctaLink: '/contact',
      features: [
        { text: 'Unlimited topics & scans' },
        { text: 'Full analytics suite' },
        { text: 'Unlimited team management' },
        { text: 'Custom branding & white-label' },
        { text: 'Admin dashboard & reporting' },
        { text: 'SSO & enterprise integrations' },
        { text: 'Custom question bank creation' },
        { text: 'Dedicated account manager' },
      ],
    },
  ];

  const faqs = [
    { q: 'Can I switch plans at any time?', a: 'Yes — you can upgrade or downgrade your plan at any time. If you upgrade mid-cycle, you\'ll be prorated for the remainder of your billing period. Downgrades take effect at the next billing cycle.' },
    { q: 'Is there a free trial for Pro or Enterprise?', a: 'Pro comes with a 14-day free trial — no credit card required. Enterprise plans include a custom demo and onboarding session. Reach out via our contact page to get started.' },
    { q: 'How does the AI Scanner work?', a: 'Our AI Scanner uses computer vision and natural language processing to read text from images, photos, PDFs, or live camera feeds. It then generates contextually relevant trivia questions, flashcards, and quizzes from that content.' },
    { q: 'What happens to my data if I cancel?', a: 'Your data is retained for 30 days after cancellation, giving you time to export your progress, custom question sets, and analytics. After 30 days, your data is permanently deleted per our privacy policy.' },
    { q: 'Can I use CogniVia for my classroom or team?', a: 'Absolutely. The Pro plan supports teams of up to 5 users. For larger classrooms, schools, or organizations, the Enterprise plan includes unlimited seats, admin controls, custom branding, and SSO integrations.' },
    { q: 'Do you offer student or nonprofit discounts?', a: 'Yes — we offer 50% discounts for verified students and nonprofit organizations. Contact our support team with proof of eligibility and we\'ll apply the discount to your account within 24 hours.' },
  ];

  return (
    <div className={styles.pageContainer}>
      <WaveBg />


      <div className={styles.topBar}>
        <div className={styles.topBarLogo}></div>
        <nav className={styles.topBarNav}>
          <Link to="/about"    className={styles.navLink}>About</Link>
          <Link to="/solutions" className={styles.navLink}>Solutions</Link>
          <Link to="/pricing"  className={`${styles.navLink} ${styles.navActive}`}>Pricing</Link>
          <Link to="/faq"      className={styles.navLink}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

  
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>Pricing</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>Simple, Transparent</span>
          <span className={styles.heroAccent}>Pricing.</span>
          <span className={styles.heroSub}>No surprises. Ever.</span>
        </h1>
        <p className={styles.heroBody}>
          Start free and scale as you grow. Every plan includes our core trivia engine,
          progress tracking, and multiplayer features.
        </p>

  
        <div className={styles.billingToggle}>
          <button
            className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.toggleActive : ''}`}
            onClick={() => setBilling('monthly')}
          >Monthly</button>
          <button
            className={`${styles.toggleBtn} ${billing === 'annual' ? styles.toggleActive : ''}`}
            onClick={() => setBilling('annual')}
          >
            Annual
            <span className={styles.savePill}>Save up to 22%</span>
          </button>
        </div>
      </section>

      <section className={styles.plansSection}>
        <div className={styles.plansGrid}>
          {plans.map((p, i) => (
            <PricingCard key={p.plan} {...p} billing={billing} delay={`${i * 0.1}s`} />
          ))}
        </div>
        <p className={styles.plansNote}>
          All prices in USD. Pro trial requires no credit card. Enterprise pricing scales with seat count.
        </p>
      </section>


      <section className={styles.valueStrip}>
        {[
          { icon: '🔒', label: 'No Hidden Fees', desc: 'What you see is what you pay. No setup fees, no overage charges.' },
          { icon: '⚡', label: 'Instant Access', desc: 'Your account is live the moment you sign up. No waiting, no approval.' },
          { icon: '🔄', label: 'Cancel Anytime', desc: 'No long-term contracts. Downgrade or cancel with a single click.' },
          { icon: '🛡️', label: 'Data Privacy', desc: 'Your learning data belongs to you. We never sell or share it.' },
        ].map((v, i) => (
          <div key={i} className={styles.valueItem} style={{ animationDelay: `${i * 0.08}s` }}>
            <span className={styles.valueEmoji}>{v.icon}</span>
            <span className={styles.valueLabel}>{v.label}</span>
            <span className={styles.valueDesc}>{v.desc}</span>
          </div>
        ))}
      </section>

      <section ref={faqRef} className={`${styles.faqSection} ${faqIn ? styles.visible : ''}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Common Questions</span>
          <h2 className={styles.sectionTitle}>
            Pricing <span className={styles.gradientText}>FAQ</span>
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
            No credit card needed to get started.
          </p>
          <div className={styles.ctaActions}>
            <Link to="/register" className={styles.btnPrimary}>Get Started Free →</Link>
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