import React, { useState } from 'react';
import styles from './dashboard.module.css';
import finalLogo from './../../assets/final-remove.png';

// ── Icons as inline SVG components ──
const IconHome = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconBrain = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.69A3 3 0 016 11.5a3 3 0 013-3"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.69A3 3 0 0118 11.5a3 3 0 00-3-3"/></svg>;
const IconScan = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
const IconTrophy = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a2 2 0 00-2 2v2a5 5 0 005 5h10a5 5 0 005-5V6a2 2 0 00-2-2h-3"/><rect x="7" y="2" width="10" height="12" rx="2"/></svg>;
const IconChart = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const IconBolt = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const IconStar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconFire = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c0 0-5 4-5 9a5 5 0 0010 0c0-5-5-9-5-9zm0 14a3 3 0 01-3-3c0-2 2-4 3-6 1 2 3 4 3 6a3 3 0 01-3 3z"/></svg>;
const IconPlay = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconCamera = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconBell = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconLogout = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconCheckCircle = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;

const navItems = [
  { icon: <IconHome />, label: 'Dashboard', active: true },
  { icon: <IconBrain />, label: 'Trivia Games' },
  { icon: <IconScan />, label: 'AI Scanner' },
  { icon: <IconTrophy />, label: 'Leaderboard' },
  { icon: <IconChart />, label: 'Progress' },
];

const recentGames = [
  { subject: 'Science', score: 92, questions: 20, time: '4m 32s', trend: 'up' },
  { subject: 'History', score: 78, questions: 15, time: '3m 18s', trend: 'down' },
  { subject: 'Math', score: 85, questions: 25, time: '6m 44s', trend: 'up' },
  { subject: 'Literature', score: 70, questions: 10, time: '2m 10s', trend: 'up' },
];

const subjects = [
  { name: 'Science', progress: 74, color: '#22d3ee' },
  { name: 'History', progress: 58, color: '#a855f7' },
  { name: 'Mathematics', progress: 82, color: '#e879f9' },
  { name: 'Literature', progress: 45, color: '#f59e0b' },
  { name: 'Geography', progress: 63, color: '#34d399' },
];

const weekData = [40, 65, 55, 80, 72, 90, 85];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function Dashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const maxBar = Math.max(...weekData);

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>
            <img src={finalLogo} alt="CogniVia" className={styles.sidebarLogoImg} />
            {!sidebarCollapsed && <span className={styles.sidebarBrand}>CogniVia</span>}
          </div>
          <button className={styles.collapseBtn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item, i) => (
            <button
              key={i}
              className={`${styles.navItem} ${activeNav === i ? styles.navItemActive : ''}`}
              onClick={() => setActiveNav(i)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              {activeNav === i && !sidebarCollapsed && <span className={styles.navActiveBar}></span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.navItem}>
            <span className={styles.navIcon}><IconSettings /></span>
            {!sidebarCollapsed && <span className={styles.navLabel}>Settings</span>}
          </button>
          <button className={styles.navItem}>
            <span className={styles.navIcon}><IconLogout /></span>
            {!sidebarCollapsed && <span className={styles.navLabel}>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* ── Top Header ── */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageSubtitle}>Welcome back, <span className={styles.userName}>Alex</span> — keep the streak alive 🔥</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.iconBtn}>
              <IconBell />
              <span className={styles.notifDot}></span>
            </button>
            <div className={styles.userAvatar}>A</div>
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className={styles.content}>

          {/* ── Stat Cards Row ── */}
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.statCardAccent}`}>
              <div className={styles.statCardGlow}></div>
              <div className={styles.statTop}>
                <span className={styles.statIcon} style={{'--icon-color': '#22d3ee'}}><IconBolt /></span>
                <span className={styles.statBadge} style={{'--badge-bg': 'rgba(34,211,238,0.12)', '--badge-color': '#22d3ee'}}>+12%</span>
              </div>
              <div className={styles.statValue}>1,248</div>
              <div className={styles.statLabel}>Total Points</div>
              <div className={styles.statSub}>Lifetime score</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statIcon} style={{'--icon-color': '#e879f9'}}><IconFire /></span>
                <span className={styles.statBadge} style={{'--badge-bg': 'rgba(232,121,249,0.12)', '--badge-color': '#e879f9'}}>🔥 Hot</span>
              </div>
              <div className={styles.statValue}>14</div>
              <div className={styles.statLabel}>Day Streak</div>
              <div className={styles.statSub}>Personal best: 21</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statIcon} style={{'--icon-color': '#a855f7'}}><IconTrophy /></span>
                <span className={styles.statBadge} style={{'--badge-bg': 'rgba(168,85,247,0.12)', '--badge-color': '#a855f7'}}>#8 Global</span>
              </div>
              <div className={styles.statValue}>83%</div>
              <div className={styles.statLabel}>Avg. Accuracy</div>
              <div className={styles.statSub}>Top 15% of users</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statIcon} style={{'--icon-color': '#34d399'}}><IconStar /></span>
                <span className={styles.statBadge} style={{'--badge-bg': 'rgba(52,211,153,0.12)', '--badge-color': '#34d399'}}>+3 new</span>
              </div>
              <div className={styles.statValue}>27</div>
              <div className={styles.statLabel}>Badges Earned</div>
              <div className={styles.statSub}>5 remaining</div>
            </div>
          </div>

          {/* ── Middle Row ── */}
          <div className={styles.midGrid}>

            {/* Weekly Activity Chart */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
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
                      <div
                        className={styles.barFill}
                        style={{ height: `${(val / maxBar) * 100}%`, animationDelay: `${i * 0.08}s` }}
                      ></div>
                    </div>
                    <span className={styles.barLabel}>{weekDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Progress */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
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
                      <div
                        className={styles.progressFill}
                        style={{ width: `${s.progress}%`, background: `linear-gradient(90deg, ${s.color}99, ${s.color})`, animationDelay: `${i * 0.1}s` }}
                      ></div>
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
              <div className={styles.panelHeader}>
                <div>
                  <h3 className={styles.panelTitle}>Recent Games</h3>
                  <p className={styles.panelSub}>Your last 4 sessions</p>
                </div>
                <button className={styles.viewAllBtn}>View all <IconArrow /></button>
              </div>
              <div className={styles.gameTable}>
                <div className={styles.gameTableHead}>
                  <span>Subject</span>
                  <span>Score</span>
                  <span>Questions</span>
                  <span>Time</span>
                </div>
                {recentGames.map((g, i) => (
                  <div key={i} className={styles.gameRow} style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className={styles.gameSubject}>
                      <span className={styles.gameSubjectDot} style={{ background: subjects.find(s => s.name === g.subject)?.color || '#22d3ee' }}></span>
                      {g.subject}
                    </div>
                    <div className={styles.gameScore}>
                      <span className={`${styles.scorePill} ${g.score >= 80 ? styles.scoreHigh : g.score >= 65 ? styles.scoreMid : styles.scoreLow}`}>
                        {g.score}%
                      </span>
                    </div>
                    <div className={styles.gameQs}>{g.questions} Qs</div>
                    <div className={styles.gameTime}>{g.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Scanner CTA + Quick Start */}
            <div className={styles.rightStack}>

              {/* AI Scanner Card */}
              <div className={`${styles.panel} ${styles.scannerCard}`}>
                <div className={styles.scannerGlow}></div>
                <div className={styles.scannerInner}>
                  <div className={styles.scannerIcon}><IconCamera /></div>
                  <div>
                    <h3 className={styles.scannerTitle}>AI Scanner</h3>
                    <p className={styles.scannerDesc}>Scan text, images or questions — instantly generate trivia.</p>
                  </div>
                </div>
                <button className={styles.scannerBtn}>
                  Launch Scanner <IconArrow />
                </button>
              </div>

              {/* Quick Start */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h3 className={styles.panelTitle}>Quick Start</h3>
                </div>
                <div className={styles.quickList}>
                  {['Science Blitz', 'Daily Challenge', 'Random Mix'].map((g, i) => (
                    <button key={i} className={styles.quickItem}>
                      <div className={styles.quickLeft}>
                        <span className={styles.quickPlayIcon}><IconPlay /></span>
                        <span className={styles.quickLabel}>{g}</span>
                      </div>
                      <span className={styles.quickArrow}><IconArrow /></span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;