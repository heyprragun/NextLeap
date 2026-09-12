export const careers = [
  { id: "sports-management", title: "Sports Management", category: "Sports", match: 89, skills: ["Leadership", "Communication", "Planning"], gaps: ["Business fundamentals", "Excel", "Sports operations"], description: "Coordinate teams, events, academies and sporting operations." },
  { id: "sports-analytics", title: "Sports Analytics", category: "Technology", match: 76, skills: ["Decision Making", "Goal Setting", "Discipline"], gaps: ["Excel", "Statistics", "Data visualisation"], description: "Turn performance and event data into better sporting decisions." },
  { id: "coaching", title: "Coaching", category: "Sports", match: 84, skills: ["Mentoring", "Discipline", "Communication"], gaps: ["Feedback frameworks", "Business basics"], description: "Turn sporting experience into structured athlete development." },
  { id: "event-management", title: "Event Management", category: "Business", match: 78, skills: ["Planning", "Teamwork", "Pressure Handling"], gaps: ["Project management", "Budgeting"], description: "Plan and execute tournaments, events and community programmes." },
  { id: "digital-marketing", title: "Digital Marketing", category: "Business", match: 70, skills: ["Communication", "Goal Setting", "Adaptability"], gaps: ["Content strategy", "Analytics", "Campaign planning"], description: "Build audiences and tell compelling stories around sport." },
  { id: "operations", title: "Operations", category: "Business", match: 74, skills: ["Discipline", "Decision Making", "Teamwork"], gaps: ["Excel", "Process improvement"], description: "Run processes and solve problems in fast-moving organisations." },
  { id: "fitness-instructor", title: "Fitness & Wellness", category: "Wellness", match: 71, skills: ["Discipline", "Mentoring", "Goal Setting"], gaps: ["Anatomy basics", "Client communication"], description: "Support people through fitness, wellness and performance routines." }
];

export const opportunities = [
  { id: "opp-1", title: "Sports Operations Intern", organisation: "NextArena", type: "Internship", category: "Sports management", location: "Hybrid", remote: true, match: 91, skills: ["Planning", "Teamwork"] },
  { id: "opp-2", title: "Junior Badminton Coach", organisation: "Campus Racquets", type: "Coaching", category: "Coaching", location: "Jaipur", remote: false, match: 87, skills: ["Mentoring", "Communication"] },
  { id: "opp-3", title: "Tournament Coordinator", organisation: "PlayNation", type: "Part-time", category: "Sports management", location: "Delhi NCR", remote: false, match: 82, skills: ["Leadership", "Pressure Handling"] },
  { id: "opp-4", title: "Community Sports Fellow", organisation: "GroundUp Foundation", type: "Fellowship", category: "Volunteering", location: "Multiple cities", remote: true, match: 76, skills: ["Teamwork", "Communication"] },
  { id: "opp-5", title: "Sports Content Project", organisation: "The Playbook", type: "Project", category: "Content", location: "Remote", remote: true, match: 74, skills: ["Communication", "Adaptability"] },
  { id: "opp-6", title: "Performance Data Volunteer", organisation: "OpenSport Lab", type: "Volunteering", category: "Analytics", location: "Remote", remote: true, match: 72, skills: ["Decision Making", "Goal Setting"] }
];

// Curated, verified landing pages from reputable learning providers. The resource
// layer is deliberately data-driven so it can later be replaced by an API.
export const courses = [
  { id: "excel-foundations", title: "Get started with Microsoft 365", provider: "Microsoft Learn", skill: "Excel", careerIds: ["sports-management", "sports-analytics", "operations"], difficulty: "Beginner", duration: "Self-paced", language: "English", free: true, url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-microsoft-365/", why: "Build the spreadsheet confidence used in planning, budgets and performance tracking." },
  { id: "google-data-analytics", title: "Google Data Analytics Professional Certificate", provider: "Coursera", skill: "Data analytics", careerIds: ["sports-analytics", "operations", "digital-marketing"], difficulty: "Beginner", duration: "6 months at 10 hours/week", language: "English", free: false, url: "https://www.coursera.org/professional-certificates/google-data-analytics", why: "Learn the end-to-end workflow for turning data into decisions." },
  { id: "khan-statistics", title: "Statistics and probability", provider: "Khan Academy", skill: "Statistics", careerIds: ["sports-analytics"], difficulty: "Beginner", duration: "Self-paced", language: "English", free: true, url: "https://www.khanacademy.org/math/statistics-probability", why: "Strengthen the statistics foundation behind performance analysis." },
  { id: "python-science", title: "Scientific Computing with Python", provider: "freeCodeCamp", skill: "Python", careerIds: ["sports-analytics"], difficulty: "Beginner", duration: "Self-paced", language: "English", free: true, url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", why: "Start using code to explore and automate simple datasets." },
  { id: "project-management", title: "Google Project Management Professional Certificate", provider: "Coursera", skill: "Project management", careerIds: ["sports-management", "event-management", "operations"], difficulty: "Beginner", duration: "6 months at 10 hours/week", language: "English", free: false, url: "https://www.coursera.org/professional-certificates/google-project-management", why: "Turn event and team experience into a repeatable project workflow." },
  { id: "digital-marketing", title: "Fundamentals of Digital Marketing", provider: "Google Digital Garage", skill: "Content strategy", careerIds: ["digital-marketing", "sports-management"], difficulty: "Beginner", duration: "Self-paced", language: "English", free: true, url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing", why: "Learn practical audience, content and campaign fundamentals." },
  { id: "communication", title: "Business communication", provider: "Khan Academy", skill: "Communication", careerIds: ["coaching", "sports-management", "digital-marketing"], difficulty: "Beginner", duration: "Self-paced", language: "English", free: true, url: "https://www.khanacademy.org/college-careers-more", why: "Make your sporting stories clearer in interviews, portfolios and pitches." }
];

export const financeModules = [
  { id: "emergency-buffer", title: "Build an emergency buffer", description: "An emergency buffer helps you handle an injury, travel change or quiet month without panic. Start with a small, realistic target.", topic: "Emergency savings" },
  { id: "irregular-income", title: "Plan around irregular income", description: "Separate essential costs from flexible spending and plan from your lowest reliable month.", topic: "Irregular income" },
  { id: "tax-basics", title: "Know your tax basics", description: "Keep records of prize money, sponsorships and coaching income so you can ask a qualified professional the right questions.", topic: "Taxes" },
  { id: "insurance-basics", title: "Understand insurance basics", description: "Learn what health, accident and equipment cover can protect before choosing any product.", topic: "Insurance" }
];

export const athletes = new Map();
