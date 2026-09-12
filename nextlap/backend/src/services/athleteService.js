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
    return { name, score: Math.min(96, 66 + score * 7 - index * 2), why, strengthen };
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

function matchesForAthlete(athlete) {
  const skillNames = athlete.skills.map((skill) => skill.name);
  return careers.map((career) => {
    const overlap = career.skills.filter((skill) => skillNames.includes(skill));
    const requested = (athlete.careerInterests || []).some((interest) => career.title.toLowerCase().includes(String(interest).toLowerCase()));
    return { ...career, match: Math.min(98, career.match + overlap.length * 3 + (requested ? 6 : 0)), why: overlap, skillGaps: career.gaps };
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
  const completedTasks = Object.values(athlete.roadmapTasks).filter(Boolean).length;
  return { athlete, financialScore: financial.score, financial, careerMatches: careerMatches.slice(0, 6), opportunities: selectedOpportunities.slice(0, 6), courses: learning, roadmap, stats: { completedCourses, savedOpportunities: athlete.savedOpportunities.length, completedTasks, learningStreak: completedCourses ? completedCourses * 3 : 0 }, readiness: { career: Math.min(96, 55 + athlete.skills.length * 5), financial: financial.score, skills: Math.min(96, 58 + athlete.skills.length * 5), opportunity: Math.min(96, 52 + selectedOpportunities.filter((item) => item.matchedSkills.length).length * 6) } };
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
    { id: "task-profile", text: "Complete your transferable-skill profile", phase: "Days 01–07" },
    { id: "task-course", text: `Start ${firstCourse?.title || "your first learning resource"}`, phase: "Days 08–30", courseId: firstCourse?.id },
    { id: "task-project", text: `Build a small ${career.title.toLowerCase()} project`, phase: "Days 31–60" },
    { id: "task-opportunity", text: "Apply to 3 relevant opportunities", phase: "Days 61–75" },
    { id: "task-review", text: "Review your progress and choose the next milestone", phase: "Days 76–90" }
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
