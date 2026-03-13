import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './contact.module.css';

/* ── Intersection observer hook ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  React.useEffect(() => {
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

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function Contact() {
  const [heroRef, heroIn] = useInView(0.1);
  const [formRef, formIn] = useInView(0.1);
  const [infoRef, infoIn] = useInView(0.1);

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]     = useState({});
  const [status, setStatus]     = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = 'Name is required';
    if (!formData.email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.subject.trim()) e.subject = 'Subject is required';
    if (!formData.message.trim()) e.message = 'Message is required';
    else if (formData.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus('loading');
    // Simulate submission — replace with your api.post('/contact', formData) call
    await new Promise(r => setTimeout(r, 1400));
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      label: 'Email Us',
      value: 'support@cognivia.com',
      sub: 'We respond within 24 hours on weekdays',
      accent: 'rgba(34,211,238,0.9)',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
      label: 'Live Chat',
      value: 'Available in-app',
      sub: 'Mon–Fri, 9am–6pm EST (Pro users)',
      accent: 'rgba(232,121,249,0.9)',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      label: 'Office',
      value: 'Ubay Bohol, PH',
      sub: 'CogniVia Inc., Philippines',
      accent: 'rgba(168,85,247,0.9)',
    },
  ];

  const subjects = [
    'General Inquiry',
    'Technical Support',
    'Billing & Payments',
    'Feature Request',
    'Partnership / Enterprise',
    'Privacy & Data',
    'Bug Report',
    'Other',
  ];

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
          <Link to="/faq"       className={styles.navLink}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>Contact Us</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>We'd Love to</span>
          <span className={styles.heroAccent}>Hear From</span>
          <span className={styles.heroSub}>You.</span>
        </h1>
        <p className={styles.heroBody}>
          Have a question, idea, or just want to say hello?
          Our team is ready to help — reach out any time.
        </p>
      </section>

      {/* ═══════════════════════════════════════
          MAIN — FORM + INFO
      ═══════════════════════════════════════ */}
      <section className={styles.mainSection}>

        {/* ── Contact Form ── */}
        <div ref={formRef} className={`${styles.formCard} ${formIn ? styles.visible : ''}`}>
          {status === 'success' ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className={styles.successTitle}>Message Sent!</h3>
              <p className={styles.successBody}>Thanks for reaching out. We'll get back to you at <strong>{formData.email || 'your email'}</strong> within 24 hours.</p>
              <button className={styles.successReset} onClick={() => setStatus('idle')}>Send Another Message</button>
            </div>
          ) : (
            <>
              <div className={styles.formCardHeader}>
                <h2 className={styles.formCardTitle}>Send a Message</h2>
                <p className={styles.formCardSub}>Fill in the form and we'll respond within one business day.</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* Name + Email row */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <div className={`${styles.inputWrap} ${errors.name ? styles.inputWrapError : ''}`}>
                      <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                      </svg>
                      <input
                        type="text" name="name"
                        value={formData.name} onChange={handleChange}
                        className={styles.input}
                        placeholder="Jan Vincent"
                        disabled={status === 'loading'}
                        autoComplete="name"
                      />
                    </div>
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <div className={`${styles.inputWrap} ${errors.email ? styles.inputWrapError : ''}`}>
                      <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <input
                        type="email" name="email"
                        value={formData.email} onChange={handleChange}
                        className={styles.input}
                        placeholder="you@example.com"
                        disabled={status === 'loading'}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                  </div>
                </div>

                {/* Subject */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Subject</label>
                  <div className={`${styles.inputWrap} ${errors.subject ? styles.inputWrapError : ''}`}>
                    <svg className={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                    </svg>
                    <select
                      name="subject"
                      value={formData.subject} onChange={handleChange}
                      className={`${styles.input} ${styles.select}`}
                      disabled={status === 'loading'}
                    >
                      <option value="">Select a subject…</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                </div>

                {/* Message */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Message
                    <span className={styles.charCount}>{formData.message.length} / 1000</span>
                  </label>
                  <div className={`${styles.inputWrap} ${styles.textareaWrap} ${errors.message ? styles.inputWrapError : ''}`}>
                    <textarea
                      name="message"
                      value={formData.message} onChange={handleChange}
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Tell us what's on your mind…"
                      rows={5}
                      maxLength={1000}
                      disabled={status === 'loading'}
                    />
                  </div>
                  {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <><div className={styles.btnSpinner}></div>Sending…</>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── Info Side ── */}
        <div ref={infoRef} className={`${styles.infoSide} ${infoIn ? styles.visible : ''}`}>

          {/* Contact cards */}
          {contactInfo.map((c, i) => (
            <div key={i} className={styles.infoCard} style={{ '--accent': c.accent, transitionDelay: `${i * 0.1}s` }}>
              <div className={styles.infoCardIcon} style={{ background: `${c.accent}14`, borderColor: `${c.accent}30`, color: c.accent }}>
                {c.icon}
              </div>
              <div>
                <span className={styles.infoCardLabel}>{c.label}</span>
                <span className={styles.infoCardValue}>{c.value}</span>
                <span className={styles.infoCardSub}>{c.sub}</span>
              </div>
            </div>
          ))}

          {/* Response time badge */}
          <div className={styles.responseBadge}>
            <div className={styles.responseDot}></div>
            <div>
              <span className={styles.responseBadgeTitle}>Average Response Time</span>
              <span className={styles.responseBadgeValue}>Under 24 hours</span>
            </div>
          </div>

          {/* Quick links */}
          <div className={styles.quickLinks}>
            <span className={styles.quickLinksTitle}>Quick Links</span>
            <Link to="/faq"      className={styles.quickLink}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Browse FAQ
            </Link>
            <Link to="/howitworks"  className={styles.quickLink}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              View Pricing
            </Link>
            <Link to="/solutions" className={styles.quickLink}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Explore Features
            </Link>
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
          <Link to="/contact" className={`${styles.footerLink} ${styles.footerLinkActive}`}>Contact</Link>
        </div>
      </footer>
    </div>
  );
}