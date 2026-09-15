import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowRight, Award, BriefcaseBusiness, Check, ChevronRight, CircleDollarSign, Compass, Dumbbell, ExternalLink, HeartHandshake, Menu, ShieldCheck, Sparkles, Target, TrendingUp, Trophy, Wallet, X } from "lucide-react";
import "./styles.css";
import { I18nProvider, useI18n } from "./i18n/index.jsx";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const api = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Something went wrong");
  return body;
};

function App() {
  const { language, setLanguage, t } = useI18n();
  const [view, setView] = useState("home");
  const [athleteId, setAthleteId] = useState(localStorage.getItem("nextlapAthlete") || "");
  const [dashboard, setDashboard] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [toast, setToast] = useState("");

  const loadDashboard = async (id = athleteId) => {
    if (!id) return null;
    const next = await api(`/api/athletes/${id}/dashboard`);
    setDashboard(next);
    return next;
  };
  useEffect(() => { if (athleteId) loadDashboard().catch(() => {}); }, [athleteId]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(""), 2400); return () => clearTimeout(timer); } }, [toast]);

  const go = (nextView) => { setView(nextView); setMobile(false); };
  const openDashboard = () => go(athleteId ? "dashboard" : "onboarding");
  const showToast = (message) => setToast(message);
  const loadDemo = async () => {
    try { const next = await api("/api/demo"); setAthleteId(next.athlete.id); setDashboard(next); localStorage.setItem("nextlapAthlete", next.athlete.id); setLanguage("en"); go("dashboard"); showToast("Demo athlete loaded"); }
    catch (error) { showToast(error.message); }
  };
  const exitDemo = () => { setView("home"); setDashboard(null); setAthleteId(""); localStorage.removeItem("nextlapAthlete"); setMobile(false); showToast("Demo mode exited"); };

  return <div className="app">
    <header className="nav">
      <button className="brand" onClick={() => go("home")} aria-label="NextLap home"><span className="brandMark">N</span><span>next<span>lap</span></span></button>
      <nav className={mobile ? "navLinks open" : "navLinks"}>
        <button onClick={() => go("home")}>{t("nav.home")}</button>
        <button onClick={openDashboard}>{t("nav.dashboard")}</button>
        <button onClick={() => go("opportunities")}>{t("nav.opportunities")}</button>
        <button onClick={() => go("how")}>{t("nav.how")}</button>
      </nav>
      <div className="navTools"><button className={language === "en" ? "lang active" : "lang"} onClick={() => setLanguage("en")}>EN</button><button className={language === "hi" ? "lang active" : "lang"} onClick={() => setLanguage("hi")}>हिंदी</button><button className="menu" onClick={() => setMobile(!mobile)} aria-label="Open menu">{mobile ? <X /> : <Menu />}</button></div>
      {dashboard?.athlete?.isDemo ? <button className="exitDemo" onClick={exitDemo}>{t("nav.exitDemo")} <X size={14} /></button> : <button className="navCta" onClick={openDashboard}>{t("nav.build")} <ArrowRight size={16} /></button>}
    </header>

    {view === "home" && <Home onStart={openDashboard} onHow={() => go("how")} onDemo={loadDemo} />}
    {view === "onboarding" && <Onboarding onDone={async (id) => { setAthleteId(id); localStorage.setItem("nextlapAthlete", id); await loadDashboard(id); go("dashboard"); }} />}
    {view === "dashboard" && dashboard && <Dashboard data={dashboard} onRefresh={() => loadDashboard()} onToast={showToast} />}
    {view === "dashboard" && !dashboard && <Onboarding onDone={async (id) => { setAthleteId(id); localStorage.setItem("nextlapAthlete", id); await loadDashboard(id); go("dashboard"); }} />}
    {view === "opportunities" && <Opportunities athleteId={athleteId} onRefresh={loadDashboard} onToast={showToast} />}
    {view === "how" && <How onStart={openDashboard} onDemo={loadDemo} />}
    <footer><div className="footerBrand">next<span>lap</span></div><div>{t("home.thesis")}</div><div>Udbhav 2026 • BITS Pilani</div></footer>
    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
  </div>;
}

function Home({ onStart, onHow, onDemo }) {
  const { t } = useI18n();
  return <main>
    <section className="hero"><div className="heroCopy"><div className="eyebrow"><span className="pulse" />{t("hero.eyebrow")}</div><h1>{t("hero.title")}</h1><p>{t("hero.body")}</p><div className="heroActions"><button className="primary" onClick={onStart}>{t("hero.start")} <ArrowRight /></button><button className="secondary" onClick={onHow}>{t("hero.how")}</button></div><div className="demoPrompt"><button className="textButton" onClick={onDemo}><Sparkles size={15} />{t("nav.demo")}</button><span>•</span><span>Demo-ready in 2 minutes</span></div><div className="trust"><ShieldCheck size={16} /> Built around the athlete journey • Demo prototype</div></div><div className="heroVisual"><div className="trackCard"><div className="trackTop"><span>YOUR JOURNEY</span><span className="live">● LIVE</span></div><div className="runner"><div className="runnerCircle"><Dumbbell size={28} /></div></div><div className="trackLine" /><div className="trackLabels"><span>PLAY</span><span>BUILD</span><span>EXPLORE</span><span>NEXT LAP</span></div><div className="statFloat"><span>READINESS</span><strong>72%</strong><small>+12% this month</small></div></div></div></section>
    <section className="stats"><div><strong>01</strong><span>Build transferable skills</span></div><div><strong>02</strong><span>Understand your money</span></div><div><strong>03</strong><span>Find your next opportunity</span></div><div><strong>04</strong><span>Create your transition plan</span></div></section>
    <section className="section"><div className="sectionHead"><div><div className="eyebrow">WHY NEXTLAP</div><h2>Sport builds more than athletes.</h2></div><p>Years of competition create discipline, leadership, teamwork and resilience. NextLap helps athletes recognise those assets and carry them into the next phase of life.</p></div><div className="featureGrid"><Feature icon={<Compass />} n="01" title="Career resilience" text="Map sporting experience to transferable skills and career pathways." /><Feature icon={<Wallet />} n="02" title="Financial resilience" text="Learn practical money basics around irregular sporting income." /><Feature icon={<BriefcaseBusiness />} n="03" title="Real opportunities" text="Discover internships, coaching and sports-sector opportunities matched to your profile." /></div></section>
    <section className="quoteSection"><div className="quoteMark">“</div><h2>{t("home.thesis")}<br /><em>Prepare before the transition becomes urgent.</em></h2></section>
  </main>;
}

function Feature({ icon, n, title, text }) { return <article className="feature"><div className="featureIcon">{icon}</div><div className="featureN">{n}</div><h3>{title}</h3><p>{text}</p><ChevronRight className="arrow" /></article>; }

function Onboarding({ onDone }) {
  const { t, language } = useI18n();
  const [step, setStep] = useState(1); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", sport: "", level: "State", years: 4, role: "Team captain", interests: "technology, teaching", careerInterests: "Sports Management", skillsSelf: ["Discipline"], experience: "", achievements: "", preferredLanguage: language, financial: { monthlyIncome: 0, savings: 0, goals: 0, irregularIncome: true, emergencyBuffer: false, financialKnowledge: "beginner" } });
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setFinancial = (key, value) => setForm((current) => ({ ...current, financial: { ...current.financial, [key]: value } }));
  const toggleSkill = (skill) => setForm((current) => ({ ...current, skillsSelf: current.skillsSelf.includes(skill) ? current.skillsSelf.filter((item) => item !== skill) : [...current.skillsSelf, skill] }));
  const submit = async () => { setLoading(true); setError(""); try { const payload = { ...form, interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean), careerInterests: form.careerInterests.split(",").map((item) => item.trim()).filter(Boolean), years: Number(form.years), financial: { ...form.financial, monthlyIncome: Number(form.financial.monthlyIncome), savings: Number(form.financial.savings), goals: Number(form.financial.goals) } }; const athlete = await api("/api/athletes", { method: "POST", body: JSON.stringify(payload) }); onDone(athlete.id); } catch (e) { setError(e.message); } finally { setLoading(false); } };
  const skills = ["Leadership", "Discipline", "Teamwork", "Communication", "Goal Setting", "Adaptability", "Time Management", "Performance Mindset"];
  return <main className="formPage"><div className="formWrap"><div className="formIntro"><div className="eyebrow">{t("onboarding.eyebrow")}</div><h1>{t("onboarding.title")}</h1><p>{t("onboarding.subtitle")}</p><div className="steps"><span className={step >= 1 ? "active" : ""}>01 Profile</span><span className={step >= 2 ? "active" : ""}>02 Skills</span><span className={step >= 3 ? "active" : ""}>03 Money</span></div></div><div className="formCard">
    {step === 1 && <><h2>{t("onboarding.profile")}</h2><p className="muted">Start with the experience that shaped you.</p><label>{t("field.name")}<input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aarav Sharma" /></label><label>{t("field.sport")}<input value={form.sport} onChange={(e) => set("sport", e.target.value)} placeholder="e.g. Badminton" /></label><div className="two"><label>{t("field.level")}<select value={form.level} onChange={(e) => set("level", e.target.value)}><option>District</option><option>State</option><option>National</option><option>International</option></select></label><label>{t("field.years")}<input type="number" min="0" value={form.years} onChange={(e) => set("years", e.target.value)} /></label></div><label>{t("field.role")}<input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Team captain" /></label><label>{t("field.interests")}<input value={form.interests} onChange={(e) => set("interests", e.target.value)} placeholder="technology, teaching" /></label><label>{t("field.career")}<input value={form.careerInterests} onChange={(e) => set("careerInterests", e.target.value)} placeholder="Sports Management, Analytics" /></label><button className="primary full" disabled={!form.name || !form.sport} onClick={() => setStep(2)}>{t("button.continue")} <ArrowRight /></button></>}
    {step === 2 && <><h2>{t("onboarding.skills")}</h2><p className="muted">Select strengths you recognise in yourself. We will combine them with your sporting story.</p><div className="skillChips">{skills.map((skill) => <button type="button" className={form.skillsSelf.includes(skill) ? "skillChip selected" : "skillChip"} key={skill} onClick={() => toggleSkill(skill)}>{form.skillsSelf.includes(skill) && <Check size={13} />}{skill}</button>)}</div><label>{t("field.experience")}<textarea value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="e.g. Led my team through a state tournament..." /></label><label>{t("field.achievements")}<textarea value={form.achievements} onChange={(e) => set("achievements", e.target.value)} placeholder="Medals, tournaments, captaincy, certifications..." /></label><div className="formBtns"><button className="secondary" onClick={() => setStep(1)}>{t("button.back")}</button><button className="primary" onClick={() => setStep(3)}>{t("button.nextMoney")} <ArrowRight /></button></div></>}
    {step === 3 && <><h2>{t("onboarding.money")}</h2><p className="muted">Educational readiness signals, not financial advice.</p><label>{t("field.income")}<input type="number" value={form.financial.monthlyIncome} onChange={(e) => setFinancial("monthlyIncome", e.target.value)} placeholder="₹ 0" /></label><label>{t("field.savings")}<input type="number" value={form.financial.savings} onChange={(e) => setFinancial("savings", e.target.value)} placeholder="₹ 0" /></label><label>{t("field.goal")}<input type="number" value={form.financial.goals} onChange={(e) => setFinancial("goals", e.target.value)} placeholder="₹ 0" /></label><label>{t("field.knowledge")}<select value={form.financial.financialKnowledge} onChange={(e) => setFinancial("financialKnowledge", e.target.value)}><option value="beginner">Beginner</option><option value="intermediate">Some confidence</option><option value="confident">Confident</option></select></label><label className="check"><input type="checkbox" checked={form.financial.emergencyBuffer} onChange={(e) => setFinancial("emergencyBuffer", e.target.checked)} />{t("field.buffer")}</label><label className="check"><input type="checkbox" checked={form.financial.irregularIncome} onChange={(e) => setFinancial("irregularIncome", e.target.checked)} />{t("field.irregular")}</label>{error && <div className="error">{error}</div>}<div className="formBtns"><button className="secondary" onClick={() => setStep(2)}>{t("button.back")}</button><button className="primary" disabled={loading} onClick={submit}>{loading ? t("button.loading") : t("button.build")} <Sparkles /></button></div></>}
  </div></div></main>;
}

function Dashboard({ data, onRefresh, onToast }) {
  const { t } = useI18n();
  const [courses, setCourses] = useState(data.courses || []); const [selectedCareer, setSelectedCareer] = useState(data.careerMatches?.[0]);
  const refresh = async () => { const next = await onRefresh(); if (next?.courses) setCourses(next.courses); };
  const selectCareer = async (career) => { setSelectedCareer(career); const next = await api(`/api/athletes/${data.athlete.id}/courses?career=${career.id}`); setCourses(next); };
  const update = async (url, options, message) => { await api(url, options); await refresh(); if (message) onToast(message); };
  const readiness = Math.round((data.readiness.career + data.readiness.financial + data.readiness.skills + data.readiness.opportunity) / 4);
  return <main className="dashboardPage"><div className="dashTop"><div><div className="eyebrow">ATHLETE DASHBOARD</div><h1>{t("dashboard.welcome")}, {data.athlete.name.split(" ")[0]}.</h1><p>{t("dashboard.subtitle")} {data.stats.completedTasks ? `${data.stats.completedTasks}/5 roadmap tasks complete.` : "Start with one small action today."}</p></div><div className="dashStats"><span>{data.stats.completedCourses} learning goals</span><span>{data.stats.savedOpportunities} saved opportunities</span></div></div>
    <section className="readinessGrid"><div className="readinessCard mainReadiness"><div><span className="muted">OVERALL READINESS</span><strong>{readiness}%</strong><small>{data.stats.learningStreak ? `Learning streak: ${data.stats.learningStreak} days` : "Based on your current profile"}</small></div><div className="ring" style={{ "--p": `${readiness}%` }}><span>{readiness}</span></div></div><Score title={t("dashboard.career")} value={data.readiness.career} icon={<Compass />} /><Score title={t("dashboard.skills")} value={data.readiness.skills} icon={<Target />} /><Score title={t("dashboard.opportunity")} value={data.readiness.opportunity} icon={<BriefcaseBusiness />} /></section>
    <section className="dashGrid"><SkillPassport skills={data.athlete.skills} sport={data.athlete.sport} /><CareerRadar careers={data.careerMatches} selected={selectedCareer} onSelect={selectCareer} t={t} /></section>
    <section className="dashGrid"><LearningPanel courses={courses} athleteId={data.athlete.id} onUpdate={refresh} onToast={onToast} t={t} /><FinancePanel data={data} athleteId={data.athlete.id} onUpdate={refresh} onToast={onToast} t={t} /></section>
    <section className="dashGrid"><OpportunityPanel opportunities={data.opportunities} athleteId={data.athlete.id} onUpdate={refresh} onToast={onToast} t={t} /><Roadmap data={data} athleteId={data.athlete.id} onUpdate={refresh} t={t} /></section>
  </main>;
}

function Score({ title, value, icon }) { return <div className="readinessCard"><div className="miniIcon">{icon}</div><span>{title}</span><strong>{value}%</strong><div className="miniBar"><i style={{ width: `${value}%` }} /></div></div>; }

function SkillPassport({ skills = [], sport = "your sport" }) {
  const { t } = useI18n();
  const [selected, setSelected] = useState(skills[0]);
  const mappings = skills.slice(0, 6).map((skill, index) => ({
    ...skill,
    trait: skill.sportSkill || ["Team captaincy", "Tournament competition", "Seven years of training", "Mentoring younger athletes", "Match-day decisions", "Recovery after setbacks"][index] || `${sport} experience`
  }));
  const active = selected?.name;
  return <div className="panel skillPassport"><div className="panelHead"><div><div className="eyebrow">01 • {t("dashboard.skillPassport")}</div><h2>{t("dashboard.skillTitle")}</h2><p className="passportIntro">Select a sporting trait to see the professional skill it proves.</p></div><Award /></div><div className="mapping" role="list" aria-label="Transferable skill mapping"><div className="mappingCol traits"><span className="mappingLabel">SPORTING EVIDENCE</span>{mappings.map((skill) => <button className={active === skill.name ? "mappingNode active" : "mappingNode"} key={`trait-${skill.name}`} onClick={() => setSelected(skill)} onMouseEnter={() => setSelected(skill)}>{skill.trait}</button>)}</div><svg className="mappingLines" viewBox={`0 0 120 ${Math.max(180, mappings.length * 48)}`} preserveAspectRatio="none" aria-hidden="true">{mappings.map((skill, index) => <path key={skill.name} className={active === skill.name ? "mappingLine active" : "mappingLine"} d={`M 8 ${24 + index * 48} C 45 ${24 + index * 48}, 75 ${24 + index * 48}, 112 ${24 + index * 48}`} />)}</svg><div className="mappingCol jobs"><span className="mappingLabel">PROFESSIONAL SKILL</span>{mappings.map((skill) => <button className={active === skill.name ? "mappingNode active" : "mappingNode"} key={`job-${skill.name}`} onClick={() => setSelected(skill)} onMouseEnter={() => setSelected(skill)}><b>{skill.name}</b><small>{skill.score}% evidence</small></button>)}</div></div>{selected && <div className="detailBox"><b>{t("dashboard.why")}</b><p>{selected.why}</p><b>{t("dashboard.strengthen")}</b><p>{selected.strengthen}</p></div>}</div>;
}

function CareerRadar({ careers = [], selected, onSelect, t }) {
  return <div className="panel"><div className="panelHead"><div><div className="eyebrow">02 • {t("dashboard.careerRadar")}</div><h2>{t("dashboard.careerTitle")}</h2></div><Compass /></div><div className="careerList">{careers.map((career) => <button className={selected?.id === career.id ? "careerItem selected" : "careerItem"} key={career.id} onClick={() => onSelect(career)}><div className="careerIcon">{career.title[0]}</div><div><b>{career.title}</b><small>{career.description}</small></div><strong>{career.match}%</strong></button>)}</div>{selected && <div className="careerDetail"><div className="detailTitle"><div><b>{selected.title} • {selected.match}% match</b><small>{selected.category}</small></div><span>{t("dashboard.gap")}</span></div><div className="tagList">{selected.why?.map((item) => <span key={item}>+ {item}</span>)}{selected.skillGaps?.map((item) => <span className="gap" key={item}>→ {item}</span>)}</div></div>}</div>;
}

function LearningPanel({ courses = [], athleteId, onUpdate, onToast, t }) {
  const [editing, setEditing] = useState(null);
  const updateProgress = async (course, value) => { const progress = Number(value); await api(`/api/athletes/${athleteId}/courses/${course.id}/progress`, { method: "PATCH", body: JSON.stringify({ progress, status: progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : "Not started" }) }); await onUpdate(); onToast(t("toast.progress")); };
  const save = async (course) => { await api(`/api/athletes/${athleteId}/courses/${course.id}/save`, { method: "POST" }); await onUpdate(); onToast(t("toast.saved")); };
  return <div className="panel learningPanel"><div className="panelHead"><div><div className="eyebrow">03 • {t("dashboard.learning")}</div><h2>{t("dashboard.learningTitle")}</h2></div><Sparkles /></div>{courses.map((course) => <article className="courseItem" key={course.id}><div className="courseTop"><div><b>{course.title}</b><small>{course.provider} • {course.skill} • {course.difficulty}</small></div><button className="iconButton" onClick={() => save(course)} aria-label={course.saved ? t("dashboard.saved") : t("dashboard.save")}>{course.saved ? <Check size={16} /> : <HeartHandshake size={16} />}</button></div><div className="courseProgress"><i><span style={{ width: `${course.progress}%` }} /></i><b>{course.progress}%</b></div><p>{course.recommendedBecause}</p><div className="courseActions"><a href={course.url} target="_blank" rel="noreferrer">{course.language !== "Hindi" && <span className="englishTag">{t("dashboard.resource")}</span>} <ExternalLink size={13} /> {course.provider}</a>{editing === course.id ? <input className="progressInput" type="range" min="0" max="100" defaultValue={course.progress} onChange={(e) => updateProgress(course, e.target.value)} onBlur={() => setEditing(null)} /> : <button className="textButton" onClick={() => setEditing(course.id)}>{course.progress ? t("dashboard.progress") : t("dashboard.start")}</button>}</div></article>)}</div>;
}

function FinancePanel({ data, athleteId, onUpdate, onToast, t }) {
  const completeModule = async (id) => { await api(`/api/athletes/${athleteId}/finance/modules/${id}`, { method: "POST" }); await onUpdate(); onToast(t("dashboard.complete")); };
  return <div className="panel moneyPanel"><div className="panelHead"><div><div className="eyebrow">04 • {t("dashboard.finance")}</div><h2>{t("dashboard.financeTitle")}</h2></div><CircleDollarSign /></div><div className="moneyScore"><strong>{data.financialScore}</strong><span>/ 100</span></div><div className="assessment"><div><b>{t("dashboard.strong")}</b>{data.financial.strong.map((item) => <span key={item}><Check size={13} />{item}</span>)}</div><div><b>{t("dashboard.attention")}</b>{data.financial.attention.map((item) => <span key={item}>→ {item}</span>)}</div></div><div className="financeModules">{data.financial.modules.map((module) => <button className={data.athlete.completedModules.includes(module.id) ? "module done" : "module"} key={module.id} onClick={() => completeModule(module.id)}><span>{data.athlete.completedModules.includes(module.id) ? <Check size={14} /> : <CircleDollarSign size={14} />}</span><div><b>{module.title}</b><small>{module.description}</small></div></button>)}</div></div>;
}

function OpportunityPanel({ opportunities = [], athleteId, onUpdate, onToast, t }) {
  const action = async (id, type) => { await api(`/api/athletes/${athleteId}/opportunities/${id}/${type}`, { method: "POST" }); await onUpdate(); onToast(type === "save" ? t("toast.saved") : t("dashboard.applied")); };
  return <div className="panel"><div className="panelHead"><div><div className="eyebrow">05 • {t("dashboard.opportunities")}</div><h2>{t("dashboard.opportunitiesTitle")}</h2></div><BriefcaseBusiness /></div><div className="oppList">{opportunities.slice(0, 4).map((opportunity) => <div className="oppItem" key={opportunity.id}><div><b>{opportunity.title}</b><small>{opportunity.organisation} • {opportunity.type} • {opportunity.location}</small><small className="matchReason">{opportunity.matchedSkills?.join(" • ") || "Profile match"}</small></div><span>{opportunity.match}%</span><button className="smallButton" onClick={() => action(opportunity.id, "save")}>{opportunity.saved ? t("dashboard.saved") : t("dashboard.save")}</button><button className="smallButton" onClick={() => action(opportunity.id, "apply")}>{opportunity.applied ? t("dashboard.applied") : t("dashboard.apply")}</button></div>)}</div></div>;
}

function Roadmap({ data, athleteId, onUpdate, t }) {
  const toggle = async (task) => { await api(`/api/athletes/${athleteId}/roadmap/${task.id}`, { method: "PATCH", body: JSON.stringify({ done: !task.done }) }); await onUpdate(); };
  return <div className="panel roadmap"><div className="panelHead"><div><div className="eyebrow">06 • {t("dashboard.roadmap")}</div><h2>{t("dashboard.roadmapTitle")}</h2></div><TrendingUp /></div><div className="roadmapGrid">{data.roadmap.map((task) => <label className={task.done ? "road done" : "road"} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggle(task)} /><div className="roadNo">{task.done ? <Check size={22} /> : ""}</div><small>{task.phase}</small><h3>{task.text}</h3><span>{task.done ? t("dashboard.completed") : "Next action"}</span></label>)}</div></div>;
}

function Opportunities({ athleteId, onRefresh, onToast }) {
  const { t } = useI18n(); const [data, setData] = useState([]); const [search, setSearch] = useState(""); const [category, setCategory] = useState(""); const [remote, setRemote] = useState(false);
  const load = async () => setData(await api(`/api/opportunities?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&remote=${remote}`));
  useEffect(() => { load().catch(() => {}); }, [search, category, remote]);
  const action = async (id, type) => { if (!athleteId) return; const next = await api(`/api/athletes/${athleteId}/opportunities/${id}/${type}`, { method: "POST" }); setData(next.opportunities || data); await onRefresh(); onToast(type === "save" ? t("toast.saved") : t("dashboard.applied")); };
  return <main className="listing"><div className="pageHero"><div className="eyebrow">OPPORTUNITY BOARD</div><h1>{t("opps.title")}</h1><p>{t("opps.body")} <span className="demoLabel">DEMO OPPORTUNITIES</span></p></div><div className="filters"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("opps.search")} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">{t("opps.all")}</option><option>Coaching</option><option>Analytics</option><option>Content</option><option>Sports management</option><option>Volunteering</option></select><label className="filterCheck"><input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} /> Remote</label></div><div className="oppGrid">{data.map((opportunity) => <article className="oppCard" key={opportunity.id}><span className="tag">{opportunity.type}</span><h3>{opportunity.title}</h3><p>{opportunity.organisation}</p><div className="oppMeta"><span>{opportunity.location}</span><strong>{opportunity.match}% match</strong></div><div className="cardTags">{opportunity.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="cardActions"><button className="secondary" onClick={() => action(opportunity.id, "save")} disabled={!athleteId}>{opportunity.saved ? t("dashboard.saved") : t("dashboard.save")}</button><button className="primary" onClick={() => action(opportunity.id, "apply")} disabled={!athleteId}>{opportunity.applied ? t("dashboard.applied") : t("dashboard.apply")}</button></div></article>)}</div></main>;
}

function How({ onStart, onDemo }) { const { t } = useI18n(); return <main className="how"><div className="pageHero"><div className="eyebrow">THE NEXTLAP MODEL</div><h1>{t("how.title")}</h1><p>{t("how.body")} NextLap is designed around a simple idea: your future should begin before your sporting career ends.</p></div><div className="howSteps"><HowStep n="01" icon={<Trophy />} title="Build your athlete profile" text="Capture sport, level, experience, interests and goals." /><HowStep n="02" icon={<Sparkles />} title="Map transferable skills" text="Turn captaincy, competition and training into a professional skill passport." /><HowStep n="03" icon={<Wallet />} title="Build financial awareness" text="Understand irregular income, savings goals and practical financial resilience." /><HowStep n="04" icon={<BriefcaseBusiness />} title="Explore opportunities" text="Discover careers, internships, coaching and projects that fit your strengths." /><HowStep n="05" icon={<TrendingUp />} title="Create your NextLap plan" text="Move from awareness to action with a personalised 30/60/90-day roadmap." /></div><div className="centerCta"><button className="primary" onClick={onStart}>{t("nav.build")} <ArrowRight /></button><button className="secondary" onClick={onDemo}>{t("nav.demo")}</button></div></main>; }
function HowStep({ n, icon, title, text }) { return <div className="howStep"><div className="howNo">{n}</div><div className="howIcon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div><ChevronRight /></div>; }

function Root() { const [language, setLanguage] = useState(localStorage.getItem("nextlapLanguage") || "en"); const updateLanguage = (next) => { setLanguage(next); localStorage.setItem("nextlapLanguage", next); }; return <I18nProvider language={language} setLanguage={updateLanguage}><App /></I18nProvider>; }
createRoot(document.getElementById("root")).render(<Root />);
