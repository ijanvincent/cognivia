import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

// ── Icons ──
const IconBolt   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const IconFire   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s-5 4-5 9a5 5 0 0010 0c0-5-5-9-5-9zm0 14a3 3 0 01-3-3c0-2 2-4 3-6 1 2 3 4 3 6a3 3 0 01-3 3z"/></svg>;
const IconTrophy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a2 2 0 00-2 2v2a5 5 0 005 5h10a5 5 0 005-5V6a2 2 0 00-2-2h-3"/><rect x="7" y="2" width="10" height="12" rx="2"/></svg>;
const IconStar   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconArrow  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconPlay   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconCamera = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;

const recentGames = [
  { subject: 'Science',    score: 92, questions: 20, time: '4m 32s', color: '#22d3ee' },
  { subject: 'History',    score: 78, questions: 15, time: '3m 18s', color: '#a855f7' },
  { subject: 'Math',       score: 85, questions: 25, time: '6m 44s', color: '#e879f9' },
  { subject: 'Literature', score: 70, questions: 10, time: '2m 10s', color: '#f59e0b' },
];

const subjects = [
  { name: 'Science',     progress: 74, color: '#22d3ee' },
  { name: 'History',     progress: 58, color: '#a855f7' },
  { name: 'Mathematics', progress: 82, color: '#e879f9' },
  { name: 'Literature',  progress: 45, color: '#f59e0b' },
  { name: 'Geography',   progress: 63, color: '#34d399' },
];

const weekData = [40, 65, 55, 80, 72, 90, 85];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const quickGames = [
  { label: 'Science Blitz',  desc: '20 questions · 5 min' },
  { label: 'Daily Challenge', desc: 'New every day · Mixed' },
  { label: 'Random Mix',     desc: 'All subjects · 15 min' },
];

function UserDashboard() {
  const [mounted, setMounted] = useState(false);
  const maxBar = Math.max(...weekData);

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  })();
  const userName    = storedUser.name || storedUser.username || 'Learner';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.page} ${mounted ? styles.mounted : ''}`}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Welcome back, <span className={styles.accentName}>{userName}</span> — keep the streak alive 🔥
          </p>
        </div>
        <div className={styles.avatarChip}>
          <div className={styles.avatar}>{userInitial}</div>
          <div>
            <div className={styles.avatarName}>{userName}</div>
            <div className={styles.avatarRole}>Member</div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsGrid}>
        {[
          { icon: <IconBolt />,   value: '1,248', label: 'Total Points',  sub: 'Lifetime score',    badge: '+12%',      ic: '#22d3ee', glow: true },
          { icon: <IconFire />,   value: '14',    label: 'Day Streak',    sub: 'Personal best: 21', badge: '🔥 Hot',    ic: '#e879f9' },
          { icon: <IconTrophy />, value: '83%',   label: 'Avg. Accuracy', sub: 'Top 15% of users',  badge: '#8 Global', ic: '#a855f7' },
          { icon: <IconStar />,   value: '27',    label: 'Badges Earned', sub: '5 remaining',       badge: '+3 new',    ic: '#34d399' },
        ].map((s, i) => (
          <div key={i} className={styles.statCard} style={{ '--delay': `${i * 0.07}s` }}>
            {s.glow && <div className={styles.statGlow} />}
            <div className={styles.statTop}>
              <span className={styles.statIconWrap} style={{ '--ic': s.ic }}>{s.icon}</span>
              <span className={styles.statBadge} style={{ '--ic': s.ic }}>{s.badge}</span>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Mid Row ── */}
      <div className={styles.midGrid}>

        {/* Bar Chart */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h3 className={styles.panelTitle}>Weekly Activity</h3>
              <p className={styles.panelSub}>Games played this week</p>
            </div>
            <span className={styles.panelTag}>This week</span>
          </div>
          <div className={styles.barChart}>
            {weekData.map((val, i) => (
              <div key={i} className={styles.barCol}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ height: `${(val / maxBar) * 100}%`, animationDelay: `${0.3 + i * 0.07}s` }} />
                </div>
                <span className={styles.barLabel}>{weekDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Mastery */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h3 className={styles.panelTitle}>Subject Mastery</h3>
              <p className={styles.panelSub}>Knowledge coverage</p>
            </div>
          </div>
          <div className={styles.subjectList}>
            {subjects.map((s, i) => (
              <div key={i} className={styles.subjectItem}>
                <div className={styles.subjectMeta}>
                  <span className={styles.subjectName}>{s.name}</span>
                  <span className={styles.subjectPct} style={{ color: s.color }}>{s.progress}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${s.progress}%`, background: `linear-gradient(90deg,${s.color}70,${s.color})`, animationDelay: `${0.4 + i * 0.08}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className={styles.bottomGrid}>

        {/* Recent Games */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h3 className={styles.panelTitle}>Recent Games</h3>
              <p className={styles.panelSub}>Your last 4 sessions</p>
            </div>
            <button className={styles.viewAllBtn}>View all <IconArrow /></button>
          </div>
          <div className={styles.tableHead}>
            <span>Subject</span><span>Score</span><span>Questions</span><span>Time</span>
          </div>
          {recentGames.map((g, i) => (
            <div key={i} className={styles.tableRow} style={{ animationDelay: `${0.5 + i * 0.06}s` }}>
              <div className={styles.gameSubject}>
                <span className={styles.subjectDot} style={{ background: g.color }} />
                {g.subject}
              </div>
              <span className={`${styles.scorePill} ${g.score >= 80 ? styles.scoreHigh : g.score >= 65 ? styles.scoreMid : styles.scoreLow}`}>{g.score}%</span>
              <span className={styles.tableMuted}>{g.questions} Qs</span>
              <span className={styles.tableMuted}>{g.time}</span>
            </div>
          ))}
        </div>

        {/* Right stack */}
        <div className={styles.rightStack}>

          {/* AI Scanner */}
          <div className={`${styles.panel} ${styles.scannerPanel}`}>
            <div className={styles.scannerGlow} />
            <div className={styles.scannerRow}>
              <div className={styles.scannerIconWrap}><IconCamera /></div>
              <div>
                <h3 className={styles.scannerTitle}>AI Scanner</h3>
                <p className={styles.scannerDesc}>Scan text or images — instantly generate trivia.</p>
              </div>
            </div>
            <button className={styles.scannerBtn}>Launch Scanner <IconArrow /></button>
          </div>

          {/* Quick Start */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h3 className={styles.panelTitle}>Quick Start</h3>
            </div>
            <div className={styles.quickList}>
              {quickGames.map((g, i) => (
                <button key={i} className={styles.quickItem}>
                  <div className={styles.quickLeft}>
                    <span className={styles.quickPlay}><IconPlay /></span>
                    <div>
                      <div className={styles.quickLabel}>{g.label}</div>
                      <div className={styles.quickDesc}>{g.desc}</div>
                    </div>
                  </div>
                  <span className={styles.quickArrow}><IconArrow /></span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;