import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles/legal.module.css';


function useInView(threshold = 0.08) {
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

function LegalSection({ title, children, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`${styles.legalSection} ${inView ? styles.visible : ''}`} style={{ transitionDelay: delay }}>
      <h3 className={styles.legalSectionTitle}>{title}</h3>
      <div className={styles.legalSectionBody}>{children}</div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <>
      <LegalSection title="1. Information We Collect" delay="0s">
        <p>We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:</p>
        <ul>
          <li><strong>Account Information:</strong> Username, email address, and password when you register.</li>
          <li><strong>Usage Data:</strong> Trivia session history, scores, streaks, topic preferences, and learning progress.</li>
          <li><strong>Device & Log Data:</strong> IP address, browser type, operating system, referring URLs, and timestamps of your interactions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information" delay="0.04s">
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve CogniVia's features and services.</li>
          <li>Personalize your learning experience and adapt content to your skill level.</li>
          <li>Send you product updates, security alerts, and support messages.</li>
          <li>Analyze aggregate, anonymized usage patterns to improve the platform.</li>
          <li>Comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Sharing of Information" delay="0.08s">
        <p>We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following limited circumstances:</p>
        <ul>
          <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our platform (e.g., cloud hosting, analytics), bound by strict data processing agreements.</li>
          <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred — we will notify you beforehand.</li>
          <li><strong>With Your Consent:</strong> Any other sharing will only occur with your explicit permission.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Retention" delay="0.12s">
        <p>We retain your personal data for as long as your account is active or as needed to provide our services. If you delete your account, we will permanently erase your personal data within 30 days, except where retention is required by law. Anonymized, aggregated data may be retained indefinitely for analytics purposes.</p>
      </LegalSection>

      <LegalSection title="5. Security" delay="0.16s">
        <p>We take reasonable and industry-standard measures to protect your information from unauthorized access, disclosure, alteration, or destruction. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
      </LegalSection>

      <LegalSection title="6. Cookies & Tracking" delay="0.2s">
        <p>CogniVia uses cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookie behavior through your browser settings. Disabling cookies may affect certain features of the platform.</p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the platform to function (authentication, session management).</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how users interact with CogniVia (can be opted out).</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Children's Privacy" delay="0.24s">
        <p>CogniVia is compliant with the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided personal information, we will delete it immediately. Parents who believe their child has registered should contact us at privacy@cognivia.com.</p>
      </LegalSection>

      <LegalSection title="8. Your Rights" delay="0.28s">
        <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
          <li><strong>Rectification:</strong> Correct any inaccurate or incomplete data.</li>
          <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
          <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong>Objection:</strong> Object to processing of your data for certain purposes.</li>
        </ul>
        <p>To exercise any of these rights, contact us at privacy@cognivia.com. We will respond within 30 days.</p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy" delay="0.32s">
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform at least 14 days before the changes take effect. Continued use of CogniVia after the effective date constitutes your acceptance of the updated policy.</p>
      </LegalSection>

      <LegalSection title="10. Contact Us" delay="0.36s">
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:</p>
        <p><strong>Email:</strong> privacy@cognivia.com<br /><strong>Address:</strong> CogniVia Inc., Ubay Bohol, Philippines</p>
      </LegalSection>
    </>
  );
}


function TermsContent() {
  return (
    <>
      <LegalSection title="1. Acceptance of Terms" delay="0s">
        <p>By accessing or using CogniVia ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all users, including visitors, registered users, and paying subscribers.</p>
      </LegalSection>

      <LegalSection title="2. Eligibility" delay="0.04s">
        <p>You must be at least 13 years of age to use CogniVia. By using the Service, you represent and warrant that you meet this age requirement. If you are under 18, you represent that a parent or legal guardian has reviewed and agreed to these Terms on your behalf.</p>
      </LegalSection>

      <LegalSection title="3. User Accounts" delay="0.08s">
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information during registration.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
          <li>Not share your login credentials with any other person.</li>
          <li>Not create more than one account per person without our explicit permission.</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
      </LegalSection>

      <LegalSection title="4. Acceptable Use" delay="0.12s">
        <p>You agree not to use CogniVia to:</p>
        <ul>
          <li>Upload or share content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or obscene.</li>
          <li>Infringe upon the intellectual property rights of others.</li>
          <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure.</li>
          <li>Use automated bots, scrapers, or scripts to access or interact with the platform.</li>
          <li>Reverse-engineer, decompile, or disassemble any part of the Service.</li>
          <li>Use the Service for any commercial purpose without our prior written consent.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Intellectual Property" delay="0.16s">
        <p>All content, features, and functionality of CogniVia — including but not limited to text, graphics, logos, question databases, AI models, and software — are the exclusive property of CogniVia Inc. and are protected by copyright, trademark, and other intellectual property laws.</p>
        <p>You retain ownership of any content you upload (e.g., custom questions). By uploading content, you grant CogniVia a limited, non-exclusive license to use, process, and display that content solely to provide the Service to you.</p>
      </LegalSection>

      <LegalSection title="6. Disclaimer of Warranties" delay="0.2s">
        <p>CogniVia is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure. We make no guarantees regarding the accuracy or completeness of any content or learning outcomes.</p>
      </LegalSection>

      <LegalSection title="7. Limitation of Liability" delay="0.24s">
        <p>To the maximum extent permitted by law, CogniVia Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
      </LegalSection>

      <LegalSection title="8. Termination" delay="0.28s">
        <p>We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. You may terminate your account at any time by contacting us or using the account deletion option in your settings.</p>
      </LegalSection>

      <LegalSection title="9. Governing Law" delay="0.32s">
        <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration or in the courts of Ubay Bohol, Philippines.</p>
      </LegalSection>

      <LegalSection title="10. Changes to Terms" delay="0.36s">
        <p>We may revise these Terms at any time. We will notify you of material changes via email or in-app notification at least 14 days before the new Terms take effect. Your continued use of CogniVia after the effective date constitutes your acceptance of the revised Terms.</p>
      </LegalSection>

      <LegalSection title="11. Contact Us" delay="0.4s">
        <p>For questions about these Terms of Service, please contact us at:</p>
        <p><strong>Email:</strong> legal@cognivia.com<br /><strong>Address:</strong> CogniVia Inc., Ubay Bohol, Philippines</p>
      </LegalSection>
    </>
  );
}


export default function Legal() {
  const location = useLocation();
  const isTerms = location.pathname.includes('terms');
  const [activeTab, setActiveTab] = useState(isTerms ? 'terms' : 'privacy');
  const [heroRef, heroIn] = useInView(0.1);

  const lastUpdated = { privacy: 'March 1, 2025', terms: 'March 1, 2025' };

  return (
    <div className={styles.pageContainer}>
      <WaveBg />

      {/* ── Top Nav ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLogo}>
          <span className={styles.topBarBrand}>CogniVia</span>
        </div>
        <nav className={styles.topBarNav}>
          <Link to="/about"     className={styles.navLink}>About</Link>
          <Link to="/solutions" className={styles.navLink}>Solutions</Link>
          <Link to="/howitworks"   className={styles.navLink}>How It Works</Link>
          <Link to="/faq"       className={styles.navLink}>FAQ</Link>
        </nav>
        <Link to="/login" className={styles.navCta}>Sign In</Link>
      </div>

    
      <section ref={heroRef} className={`${styles.hero} ${heroIn ? styles.visible : ''}`}>
        <div className={styles.heroPill}>Legal</div>
        <div className={styles.heroDivider}></div>
        <h1 className={styles.heroTitle}>
          <span className={styles.heroLight}>Transparency &</span>
          <span className={styles.heroAccent}>Trust.</span>
          <span className={styles.heroSub}>Your rights. Our commitments.</span>
        </h1>
        <p className={styles.heroBody}>
          We believe in being clear about how CogniVia works, what data we collect,
          and the rules that keep our community safe for everyone.
        </p>

        
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'privacy' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Privacy Policy
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'terms' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Terms of Service
          </button>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.contentCard}>
     
          <div className={styles.contentCardHeader}>
            <div>
              <h2 className={styles.contentCardTitle}>
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <p className={styles.contentCardMeta}>
                Last updated: {lastUpdated[activeTab]} · Effective immediately upon posting
              </p>
            </div>
            <div className={styles.contentCardBadge}>
              {activeTab === 'privacy' ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
          </div>

          <div className={styles.contentIntro}>
            {activeTab === 'privacy'
              ? 'This Privacy Policy explains how CogniVia Inc. collects, uses, and protects the personal information you provide when using our platform. We are committed to handling your data responsibly and transparently.'
              : 'These Terms of Service govern your access to and use of CogniVia. By using our platform, you agree to these terms. Please read them carefully — they contain important information about your rights and obligations.'}
          </div>

   
          <div className={styles.sectionsWrap}>
            {activeTab === 'privacy' ? <PrivacyContent /> : <TermsContent />}
          </div>
        </div>

       
        <div className={styles.sideNote}>
          <div className={styles.sideNoteIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p>Questions about our legal policies? Email us at <span className={styles.sideNoteEmail}>legal@cognivia.com</span> and we'll respond within 2 business days.</p>
        </div>
      </section>

   
      <footer className={styles.footer}>
        <span className={styles.footerBrand}>CogniVia</span>
        <span className={styles.footerCopy}>© {new Date().getFullYear()} CogniVia. All rights reserved.</span>
        <div className={styles.footerLinks}>
          <button type="button" className={`${styles.footerLink} ${activeTab === 'privacy' ? styles.footerLinkActive : ''}`}
            onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Privacy
          </button>
          <button type="button" className={`${styles.footerLink} ${activeTab === 'terms' ? styles.footerLinkActive : ''}`}
            onClick={() => { setActiveTab('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Terms
          </button>
          <Link to="/faq" className={styles.footerLink}>Contact</Link>
        </div>
      </footer>
    </div>
  );
}