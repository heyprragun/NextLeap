import { athletes, careers, courses, financeModules, opportunities } from "../data.js";

let idSequence = 0;

const skillMap = {
  captain: ["Leadership", "Communication", "Decision Making"],
  team: ["Teamwork", "Communication", "Pressure Handling"],
  discipline: ["Discipline", "Goal Setting", "Consistency"],
  mentor: ["Mentoring", "Communication"],
  tournament: ["Planning", "Pressure Handling", "Decision Making"],
  individual: ["Self Management", "Discipline", "Goal Setting"],
  training: ["Discipline", "Time Management", "Performance Mindset"]
};

const skillDetails = {
  Discipline: ["Structured training and repeated practice show consistency.", "Build a portfolio project with a weekly delivery habit."],
  Leadership: ["Captaincy and taking responsibility show that others trust your decisions.", "Lead a small project and document the result."],
  Teamwork: ["Training and competing with others develops collaboration under pressure.", "Ask for feedback from a teammate after each project."],
  Communication: ["Explaining tactics, giving feedback and representing a team are communication reps.", "Practice a two-minute story about one sporting challenge."],
  "Goal Setting": ["Training cycles and competition targets turn long goals into daily actions.", "Set a measurable 30-day learning milestone."],
  Adaptability: ["Adjusting to opponents, venues and setbacks demonstrates adaptability.", "Write a short retrospective after each new experience."],
  "Time Management": ["Balancing training, study and competition requires prioritisation.", "Plan a weekly schedule and keep one promise to yourself."],
  "Performance Mindset": ["Reviewing performance and returning after setbacks builds a growth mindset.", "Track one metric while completing a project."],
  "Decision Making": ["Fast choices in competition build judgement with incomplete information.", "Explain the trade-offs behind one project decision."],
  "Pressure Handling": ["Competition creates practice staying effective when stakes are high.", "Rehearse interviews or presentations with a peer."],
  Planning: ["Tournament preparation turns a big outcome into a sequence of actions.", "Create a simple project plan with dates and owners."],
  Mentoring: ["Helping newer athletes demonstrates patience and knowledge-sharing.", "Teach one concept and collect learner feedback."],
  "Self Management": ["Individual practice builds ownership of preparation and recovery.", "Use a weekly reflection to identify the next improvement."],
  Consistency: ["Showing up for training over time is evidence of reliability.", "Publish or submit something small every week."]
};

function deriveSkills(profile) {
  const text = `${profile.role || ""} ${profile.experience || ""} ${profile.achievements || ""} ${profile.sport || ""} ${(profile.interests || []).join(" ")}`.toLowerCase();
  const scores = new Map((profile.skillsSelf || []).map((skill) => [skill, 2]));
  for (const [key, skills] of Object.entries(skillMap)) {
    if (text.includes(key)) skills.forEach((skill) => scores.set(skill, (scores.get(skill) || 0) + 2));
  }
  ["Discipline", "Goal Setting", "Adaptability", "Performance Mindset"].forEach((skill) => scores.set(skill, (scores.get(skill) || 0) + 1));
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, score], index) => {
    const [why, strengthen] = skillDetails[name] || ["Your sporting profile points to this transferable strength.", "Use it in a small project and capture evidence."];
    const sportSkill = name === "Leadership" ? `${profile.role || "Team leadership"} in ${profile.sport || "sport"}` : name === "Mentoring" ? "Mentoring younger athletes" : name === "Decision Making" ? "Making fast match-day decisions" : name === "Pressure Handling" ? "Competing in high-stakes tournaments" : name === "Discipline" ? `${profile.years || "Consistent"} years of structured training` : name === "Communication" ? "Explaining tactics and giving teammate feedback" : name === "Goal Setting" ? "Training toward tournament targets" : name === "Teamwork" ? "Coordinating with teammates during competition" : "Recovering and adapting after setbacks";
    return { name, score: Math.min(96, 66 + score * 7 - index * 2), why, strengthen, sportSkill };
  });
}

function financialReadiness(financial = {}) {
  const income = Number(financial.monthlyIncome || 0);
  const savings = Number(financial.savings || 0);
  const goals = Number(financial.goals || 0);
  let score = 40;
  if (income > 0) score += 15;
  if (savings >= income * 2 && income > 0) score += 20;
  else if (savings > 0) score += 10;
  if (goals > 0) score += 10;
  if (financial.irregularIncome) score -= 5;
  if (financial.emergencyBuffer) score += 5;
  return Math.max(20, Math.min(95, score));
}

function financialAssessment(financial = {}) {
  const score = financialReadiness(financial);
  const strong = [];
  const attention = [];
  if (Number(financial.monthlyIncome || 0) > 0) strong.push("Income tracking"); else attention.push("Income tracking");
  if (Number(financial.savings || 0) > 0) strong.push("Savings habit"); else attention.push("Emergency buffer");
  if (financial.goals > 0) strong.push("Goal awareness"); else attention.push("Goal setting");
  if (financial.financialKnowledge === "beginner") attention.push("Money basics");
  if (financial.irregularIncome) attention.push("Irregular income planning");
  return { score, strong: [...new Set(strong)], attention: [...new Set(attention)], modules: financeModules };
}

function profileCompleteness(athlete) {
  const fields = [athlete.name, athlete.sport, athlete.level, athlete.role, athlete.experience, athlete.achievements, athlete.interests?.length, athlete.careerInterests?.length];
  return Math.round(fields.filter(Boolean).length / fields.length * 100);
}

function matchesForAthlete(athlete) {
  const skillNames = athlete.skills.map((skill) => skill.name);
  return careers.map((career) => {
    const overlap = career.skills.filter((skill) => skillNames.includes(skill));
    const requested = (athlete.careerInterests || []).some((interest) => career.title.toLowerCase().includes(String(interest).toLowerCase()));
    const experience = athlete.years ? `${athlete.years} years of ${athlete.sport} experience` : `your ${athlete.sport} experience`;
    const strengths = overlap.length ? overlap.slice(0, 2).join(" and ") : "your sporting profile";
    return { ...career, match: Math.min(98, career.match + overlap.length * 3 + (requested ? 6 : 0)), why: overlap, skillGaps: career.gaps, whySentence: `Matches your ${experience} and strengths in ${strengths}.` };
  }).sort((a, b) => b.match - a.match);
}

function decorateOpportunity(athlete, opportunity) {
  const overlap = opportunity.skills.filter((skill) => athlete.skills.some((item) => item.name === skill));
  return { ...opportunity, match: Math.min(98, opportunity.match + overlap.length * 3), matchedSkills: overlap, saved: athlete.savedOpportunities.includes(opportunity.id), applied: athlete.appliedOpportunities.includes(opportunity.id) };
}

export function createAthlete(profile) {
  const id = `ath-${Date.now()}-${idSequence++}`;
  const athlete = {
    id, ...profile, interests: profile.interests || [], careerInterests: profile.careerInterests || [], skillsSelf: profile.skillsSelf || [], preferredLanguage: profile.preferredLanguage || "en",
    savedCourses: [], courseProgress: {}, savedOpportunities: [], appliedOpportunities: [], completedModules: [], roadmapTasks: {}, skills: deriveSkills(profile), financial: profile.financial || {}, createdAt: new Date().toISOString()
  };
  athletes.set(id, athlete);
  return athlete;
}

export function getRecommendedCourses(id, careerId) {
  const athlete = athletes.get(id);
  if (!athlete) return null;
  const career = careers.find((item) => item.id === careerId) || matchesForAthlete(athlete)[0];
  const skillNames = athlete.skills.map((skill) => skill.name);
  return courses.filter((course) => course.careerIds.includes(career.id)).map((course) => ({ ...course, saved: athlete.savedCourses.includes(course.id), progress: athlete.courseProgress[course.id]?.progress || 0, status: athlete.courseProgress[course.id]?.status || "Not started", recommendedBecause: skillNames.includes(course.skill) ? "Build depth in an existing strength." : `Close the ${course.skill} gap for ${career.title}.` })).sort((a, b) => Number(b.progress > 0) - Number(a.progress > 0));
}

export function getDashboard(id) {
  const athlete = athletes.get(id);
  if (!athlete) return null;
  const careerMatches = matchesForAthlete(athlete);
  const topCareer = careerMatches[0];
  const selectedOpportunities = opportunities.map((opportunity) => decorateOpportunity(athlete, opportunity)).sort((a, b) => b.match - a.match);
  const learning = getRecommendedCourses(id, topCareer.id);
  const roadmap = buildRoadmap(id);
  const financial = financialAssessment(athlete.financial);
  const completedCourses = Object.values(athlete.courseProgress).filter((item) => item.status === "Completed").length;
  const completedModules = athlete.completedModules.length;
  const completedTasks = Object.values(athlete.roadmapTasks).filter(Boolean).length;
  const completeness = profileCompleteness(athlete);
  const mappedSkills = athlete.skills.length;
  const matchedOpportunities = selectedOpportunities.filter((item) => item.matchedSkills.length).length;
  const readiness = {
    career: Math.min(96, Math.round(35 + completeness * 0.35 + mappedSkills * 3)),
    financial: Math.min(96, financial.score + completedModules * 4),
    skills: Math.min(96, Math.round(35 + mappedSkills * 6 + completeness * 0.15)),
    opportunity: Math.min(96, Math.round(35 + matchedOpportunities * 7 + completeness * 0.2)),
    profileCompleteness: completeness,
    mappedSkills,
    completedModules
  };
  return { athlete, financialScore: readiness.financial, financial, careerMatches: careerMatches.slice(0, 6), opportunities: selectedOpportunities.slice(0, 6), courses: learning, roadmap, stats: { completedCourses, savedOpportunities: athlete.savedOpportunities.length, completedTasks, learningStreak: completedCourses ? completedCourses * 3 : 0 }, readiness };
}

export function updateFinancial(id, financial) {
  const athlete = athletes.get(id);
  if (!athlete) return null;
  athlete.financial = { ...athlete.financial, ...financial };
  return getDashboard(id);
}

export function updateCourse(id, courseId, update) {
  const athlete = athletes.get(id);
  const course = courses.find((item) => item.id === courseId);
  if (!athlete || !course) return null;
  const progress = Math.max(0, Math.min(100, Number(update.progress ?? athlete.courseProgress[courseId]?.progress ?? 0)));
  athlete.courseProgress[courseId] = { progress, status: update.status || (progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : "Not started"), updatedAt: new Date().toISOString() };
  return getRecommendedCourses(id);
}

export function toggleSavedCourse(id, courseId) {
  const athlete = athletes.get(id);
  if (!athlete || !courses.some((item) => item.id === courseId)) return null;
  athlete.savedCourses = athlete.savedCourses.includes(courseId) ? athlete.savedCourses.filter((item) => item !== courseId) : [...athlete.savedCourses, courseId];
  return getDashboard(id);
}

export function toggleOpportunity(id, opportunityId, action) {
  const athlete = athletes.get(id);
  if (!athlete || !opportunities.some((item) => item.id === opportunityId)) return null;
  const key = action === "apply" ? "appliedOpportunities" : "savedOpportunities";
  athlete[key] = athlete[key].includes(opportunityId) ? athlete[key].filter((item) => item !== opportunityId) : [...athlete[key], opportunityId];
  return getDashboard(id);
}

export function updateModule(id, moduleId) {
  const athlete = athletes.get(id);
  if (!athlete || !financeModules.some((item) => item.id === moduleId)) return null;
  athlete.completedModules = athlete.completedModules.includes(moduleId) ? athlete.completedModules.filter((item) => item !== moduleId) : [...athlete.completedModules, moduleId];
  return getDashboard(id);
}

export function buildRoadmap(id) {
  const athlete = athletes.get(id);
  if (!athlete) return null;
  const career = matchesForAthlete(athlete)[0];
  const firstCourse = courses.find((course) => course.careerIds.includes(career.id));
  const items = [
    { id: "task-profile", text: "Complete your transferable-skill profile", phase: "Days 01–30" },
    { id: "task-course", text: `Start ${firstCourse?.title || "your first learning resource"}`, phase: "Days 01–30", courseId: firstCourse?.id },
    { id: "task-project", text: `Build a small ${career.title.toLowerCase()} project`, phase: "Days 31–60" },
    { id: "task-network", text: `Speak with one ${career.title.toLowerCase()} professional`, phase: "Days 31–60" },
    { id: "task-opportunity", text: "Apply to 3 relevant opportunities", phase: "Days 61–90" },
    { id: "task-review", text: "Review your progress and choose the next milestone", phase: "Days 61–90" }
  ];
  return items.map((item) => ({ ...item, done: Boolean(athlete.roadmapTasks[item.id]) }));
}

export function updateRoadmapTask(id, taskId, done) {
  const athlete = athletes.get(id);
  if (!athlete || !buildRoadmap(id)?.some((task) => task.id === taskId)) return null;
  athlete.roadmapTasks[taskId] = Boolean(done);
  return getDashboard(id);
}

export function getDemoAthlete() {
  const existing = [...athletes.values()].find((athlete) => athlete.isDemo);
  if (existing) return getDashboard(existing.id);
  const athlete = createAthlete({ name: "Aarav Sharma", sport: "Badminton", level: "National", years: 7, role: "Team captain", experience: "Led my team through a national tournament and mentored younger players.", achievements: "National finalist; academy mentor", interests: ["technology", "teaching"], skillsSelf: ["Leadership", "Discipline", "Teamwork"], careerInterests: ["Sports Management", "Sports Analytics"], preferredLanguage: "en", isDemo: true, financial: { monthlyIncome: 18000, savings: 42000, goals: 100000, irregularIncome: true, emergencyBuffer: true, financialKnowledge: "intermediate" } });
  athlete.courseProgress["excel-foundations"] = { progress: 80, status: "In Progress" };
  athlete.courseProgress["project-management"] = { progress: 100, status: "Completed" };
  athlete.savedOpportunities = ["opp-1", "opp-4"];
  athlete.roadmapTasks = { "task-profile": true, "task-course": true };
  return getDashboard(athlete.id);
}

export async function askMardarshak({ athlete, dashboard, message, history = [], language = "en" }) {
  const profile = athlete || { name: "Athlete", sport: "not provided", level: "not provided", years: 0, skills: [] };
  const fallback = language === "hi"
    ? `${profile.sport === "not provided" ? "अपनी प्रोफाइल बनाकर" : `आपकी ${profile.years} साल की ${profile.sport} यात्रा और ${profile.skills?.slice(0, 2).map((skill) => skill.name).join(" और ")} आपकी बड़ी ताकत हैं।`} इस सवाल पर अगला छोटा कदम तय करने के लिए अपने 90-दिन के प्लान से शुरुआत करें।`
    : `${profile.sport === "not provided" ? "Build your athlete profile so I can personalize this advice." : `Your ${profile.years} years in ${profile.sport} and strengths in ${profile.skills?.slice(0, 2).map((skill) => skill.name).join(" and ")} are strong foundations.`} Start with one small action from your 90-day plan and build evidence as you go.`;
  if (!process.env.GROQ_API_KEY) return fallback;
  const system = `You are Mardarshak, a warm, practical career and financial resilience coach for athletes. Answer in ${language === "hi" ? "Hindi" : "English"}. Give a complete answer in 4-8 short paragraphs or bullets. If comparing financial options, use a compact bullet list rather than a markdown table. End with one clear next action. Personalize advice using the athlete profile below. Never claim to be a financial adviser; for money, give educational guidance and suggest a qualified professional for products, tax, insurance, or investments. Do not invent jobs, credentials, or personal facts. Athlete profile: ${JSON.stringify({ name: profile.name, sport: profile.sport, level: profile.level, years: profile.years, role: profile.role, achievements: profile.achievements, interests: profile.interests, skills: profile.skills?.map((skill) => skill.name), topCareers: dashboard?.careerMatches?.slice(0, 3).map((career) => career.title), readiness: dashboard?.readiness })}`;
  const messages = [{ role: "system", content: system }, ...history.slice(-4).map((item) => ({ role: item.role === "assistant" ? "assistant" : "user", content: String(item.content).slice(0, 900) })), { role: "user", content: String(message).slice(0, 1200) }];
  const configuredModel = (process.env.GROQ_MODEL || "openai/gpt-oss-120b").trim().replace(/^['"]|['"]$/g, "");
  const callModel = async (model) => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` }, body: JSON.stringify({ model, messages, temperature: 0.55, reasoning_effort: "low", max_tokens: 1200 }) });
    const body = await response.json().catch(() => ({}));
    return { response, body };
  };
  let result = await callModel(configuredModel);
  const modelUnavailable = !result.response.ok && /does not exist|do not have access|model_not_found/i.test(result.body.error?.message || "");
  if (modelUnavailable && configuredModel !== "openai/gpt-oss-20b") result = await callModel("openai/gpt-oss-20b");
  if (!result.response.ok) throw new Error(result.body.error?.message || "Mardarshak is unavailable right now");
  return result.body.choices?.[0]?.message?.content?.trim() || fallback;
}
