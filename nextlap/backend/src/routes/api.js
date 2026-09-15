import { Router } from "express";
import { z } from "zod";
import { careers, courses, opportunities } from "../data.js";
import { createAthlete, getDashboard, getDemoAthlete, getRecommendedCourses, updateFinancial, updateCourse, toggleSavedCourse, toggleOpportunity, updateModule, buildRoadmap, updateRoadmapTask, askMardarshak } from "../services/athleteService.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const athleteSchema = z.object({
  name: z.string().min(2).max(80),
  sport: z.string().min(2).max(60),
  level: z.enum(["District", "State", "National", "International"]),
  years: z.coerce.number().int().min(0).max(50),
  role: z.string().max(120).optional().default(""),
  experience: z.string().max(500).optional().default(""),
  achievements: z.string().max(500).optional().default(""),
  interests: z.array(z.string().max(60)).max(12).optional().default([]),
  skillsSelf: z.array(z.string().max(60)).max(12).optional().default([]),
  careerInterests: z.array(z.string().max(80)).max(8).optional().default([]),
  preferredLanguage: z.enum(["en", "hi"]).optional().default("en"),
  financial: z.object({
    monthlyIncome: z.coerce.number().min(0).max(100000000).optional().default(0),
    savings: z.coerce.number().min(0).max(100000000).optional().default(0),
    goals: z.coerce.number().min(0).max(100000000).optional().default(0),
    irregularIncome: z.boolean().optional().default(true),
    emergencyBuffer: z.boolean().optional().default(false),
    financialKnowledge: z.enum(["beginner", "intermediate", "confident"]).optional().default("beginner")
  }).optional().default({})
});

const financialSchema = athleteSchema.shape.financial;

router.get("/health", (_, res) => res.json({ status: "ok", service: "NextLap API" }));
router.get("/careers", (_, res) => res.json(careers));
router.get("/courses", (req, res) => {
  const { career, skill, difficulty, language } = req.query;
  res.json(courses.filter((course) => (!career || course.careerIds.includes(career)) && (!skill || course.skill.toLowerCase().includes(String(skill).toLowerCase())) && (!difficulty || course.difficulty === difficulty) && (!language || course.language === language)));
});
router.get("/opportunities", (req, res) => {
  const { search, category, remote } = req.query;
  const result = opportunities.filter((opportunity) => (!search || `${opportunity.title} ${opportunity.organisation} ${opportunity.location}`.toLowerCase().includes(String(search).toLowerCase())) && (!category || opportunity.category === category) && (remote !== "true" || opportunity.remote));
  res.json(result);
});
router.get("/demo", (_, res) => res.json(getDemoAthlete()));

router.post("/chat", async (req, res) => {
  // Only the question needs strict validation. Profile/dashboard data is client context
  // and may contain nested arrays, nulls, or fields added by future dashboard features.
  const schema = z.object({ athlete: z.any().optional(), dashboard: z.any().optional(), message: z.string().trim().min(1, "Question cannot be empty").max(1200), history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).max(10).optional().default([]), language: z.enum(["en", "hi"]).optional().default("en") });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Please type a question before sending." });
  try { res.json({ reply: await askMardarshak(parsed.data) }); } catch (error) { res.status(502).json({ error: error.message }); }
});

router.post("/athletes", validate(athleteSchema), (req, res) => {
  res.status(201).json(createAthlete(req.body));
});

router.get("/athletes/:id/dashboard", (req, res) => {
  const dashboard = getDashboard(req.params.id);
  if (!dashboard) return res.status(404).json({ error: "Athlete not found" });
  res.json(dashboard);
});

router.post("/athletes/:id/financial-check", validate(financialSchema), (req, res) => {
  const dashboard = updateFinancial(req.params.id, req.body);
  if (!dashboard) return res.status(404).json({ error: "Athlete not found" });
  res.json(dashboard);
});

router.get("/athletes/:id/courses", (req, res) => {
  const result = getRecommendedCourses(req.params.id, req.query.career);
  if (!result) return res.status(404).json({ error: "Athlete not found" });
  res.json(result);
});

router.patch("/athletes/:id/courses/:courseId/progress", validate(z.object({ progress: z.coerce.number().min(0).max(100).optional(), status: z.enum(["Not started", "In Progress", "Completed"]).optional() })), (req, res) => {
  const result = updateCourse(req.params.id, req.params.courseId, req.body);
  if (!result) return res.status(404).json({ error: "Athlete or course not found" });
  res.json(result);
});

router.post("/athletes/:id/courses/:courseId/save", (req, res) => {
  const result = toggleSavedCourse(req.params.id, req.params.courseId);
  if (!result) return res.status(404).json({ error: "Athlete or course not found" });
  res.json(result);
});

router.post("/athletes/:id/opportunities/:opportunityId/:action", (req, res) => {
  if (!["save", "apply"].includes(req.params.action)) return res.status(400).json({ error: "Action must be save or apply" });
  const result = toggleOpportunity(req.params.id, req.params.opportunityId, req.params.action);
  if (!result) return res.status(404).json({ error: "Athlete or opportunity not found" });
  res.json(result);
});

router.post("/athletes/:id/finance/modules/:moduleId", (req, res) => {
  const result = updateModule(req.params.id, req.params.moduleId);
  if (!result) return res.status(404).json({ error: "Athlete or module not found" });
  res.json(result);
});

router.post("/athletes/:id/roadmap", (req, res) => {
  const roadmap = buildRoadmap(req.params.id);
  if (!roadmap) return res.status(404).json({ error: "Athlete not found" });
  res.json(roadmap);
});

router.patch("/athletes/:id/roadmap/:taskId", validate(z.object({ done: z.boolean() })), (req, res) => {
  const result = updateRoadmapTask(req.params.id, req.params.taskId, req.body.done);
  if (!result) return res.status(404).json({ error: "Athlete or roadmap task not found" });
  res.json(result);
});

export default router;
