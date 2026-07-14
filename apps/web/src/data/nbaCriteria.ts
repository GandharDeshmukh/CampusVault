export interface NbaSubcategory {
  id: string;
  title: string;
}

export interface NbaCriterion {
  id: number;
  title: string;
  shortTitle: string;
  requiredDocuments: number;
  subcategories: NbaSubcategory[];
}

export const nbaCriteria: NbaCriterion[] = [
  {
    id: 1,
    shortTitle: "Vision, Mission & PEOs",
    title: "Vision, Mission & Program Educational Objectives",
    requiredDocuments: 12,
    subcategories: [
      { id: "vision", title: "Vision" },
      { id: "mission", title: "Mission" },
      { id: "peos", title: "Program Educational Objectives (PEOs)" },
      { id: "psos", title: "Program Specific Outcomes (PSOs)" },
    ],
  },
  {
    id: 2,
    shortTitle: "Curriculum & Teaching",
    title: "Program Curriculum & Teaching Learning Processes",
    requiredDocuments: 20,
    subcategories: [
      { id: "curriculum", title: "Curriculum" },
      { id: "syllabus", title: "Syllabus" },
      { id: "course-files", title: "Course Files" },
      { id: "lesson-plans", title: "Lesson Plans" },
      { id: "calendar", title: "Academic Calendar" },
    ],
  },
  {
    id: 3,
    shortTitle: "COs & POs",
    title: "Course Outcomes & Program Outcomes",
    requiredDocuments: 18,
    subcategories: [
      { id: "co", title: "Course Outcomes" },
      { id: "po", title: "Program Outcomes" },
      { id: "mapping", title: "CO-PO Mapping" },
      { id: "attainment", title: "Attainment Reports" },
    ],
  },
  {
    id: 4,
    shortTitle: "Students",
    title: "Students' Performance",
    requiredDocuments: 15,
    subcategories: [
      { id: "results", title: "Results" },
      { id: "placements", title: "Placements" },
      { id: "higher", title: "Higher Studies" },
      { id: "internships", title: "Internships" },
    ],
  },
  {
    id: 5,
    shortTitle: "Faculty",
    title: "Faculty Information & Contributions",
    requiredDocuments: 24,
    subcategories: [
      { id: "profiles", title: "Faculty Profiles" },
      { id: "qualification", title: "Qualifications" },
      { id: "publications", title: "Publications" },
      { id: "patents", title: "Patents" },
      { id: "projects", title: "Projects" },
      { id: "fdp", title: "FDP / Workshops" },
    ],
  },
    {
    id: 6,
    shortTitle: "Facilities",
    title: "Facilities & Technical Support",
    requiredDocuments: 16,
    subcategories: [
      { id: "labs", title: "Laboratories" },
      { id: "equipment", title: "Equipment" },
      { id: "software", title: "Software" },
      { id: "library", title: "Library" },
    ],
  },
  {
    id: 7,
    shortTitle: "Continuous Improvement",
    title: "Continuous Improvement",
    requiredDocuments: 14,
    subcategories: [
      { id: "feedback", title: "Feedback Analysis" },
      { id: "atr", title: "Action Taken Reports" },
      { id: "quality", title: "Quality Initiatives" },
    ],
  },
  {
    id: 8,
    shortTitle: "First Year",
    title: "First Year Academics",
    requiredDocuments: 10,
    subcategories: [
      { id: "faculty", title: "Faculty" },
      { id: "laboratories", title: "Laboratories" },
      { id: "results", title: "Results" },
    ],
  },
  {
    id: 9,
    shortTitle: "Student Support",
    title: "Student Support Systems",
    requiredDocuments: 12,
    subcategories: [
      { id: "mentoring", title: "Mentoring" },
      { id: "scholarships", title: "Scholarships" },
      { id: "clubs", title: "Student Clubs" },
    ],
  },
  {
    id: 10,
    shortTitle: "Governance",
    title: "Governance, Institutional Support & Financial Resources",
    requiredDocuments: 18,
    subcategories: [
      { id: "governance", title: "Governance" },
      { id: "finance", title: "Financial Resources" },
      { id: "policies", title: "Policies" },
    ],
  },
];