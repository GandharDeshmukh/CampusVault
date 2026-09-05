export interface NbaEvidenceRequirement {
  id: string;
  title: string;
  description?: string;
}

export interface NbaSubcategoryRequirement {
  subcategoryId: string;
  requirements: NbaEvidenceRequirement[];
}

export const nbaRequirements: Record<
  number,
  NbaSubcategoryRequirement[]
> = {
  1: [
    {
      subcategoryId: "vision",
      requirements: [
        {
          id: "vision-statement",
          title: "Vision Statement",
        },
        {
          id: "vision-approval",
          title: "Vision Approval / Review Document",
        },
      ],
    },
    {
      subcategoryId: "mission",
      requirements: [
        {
          id: "mission-statement",
          title: "Mission Statement",
        },
        {
          id: "mission-approval",
          title: "Mission Approval / Review Document",
        },
      ],
    },
    {
      subcategoryId: "peos",
      requirements: [
        {
          id: "peo-document",
          title: "Program Educational Objectives Document",
        },
        {
          id: "peo-approval",
          title: "PEO Approval / Review Document",
        },
        {
          id: "peo-process",
          title: "PEO Development and Review Process",
        },
      ],
    },
    {
      subcategoryId: "psos",
      requirements: [
        {
          id: "pso-document",
          title: "Program Specific Outcomes Document",
        },
        {
          id: "pso-approval",
          title: "PSO Approval / Review Document",
        },
        {
          id: "pso-process",
          title: "PSO Development and Review Process",
        },
      ],
    },
  ],

  2: [
    {
      subcategoryId: "curriculum",
      requirements: [
        {
          id: "curriculum-structure",
          title: "Curriculum Structure",
        },
        {
          id: "curriculum-scheme",
          title: "Course Scheme / Structure",
        },
      ],
    },
    {
      subcategoryId: "syllabus",
      requirements: [
        {
          id: "course-syllabus",
          title: "Course Syllabus",
        },
        {
          id: "syllabus-approval",
          title: "Syllabus Approval Document",
        },
      ],
    },
    {
      subcategoryId: "course-files",
      requirements: [
        {
          id: "course-file",
          title: "Course Files",
        },
        {
          id: "course-delivery",
          title: "Course Delivery Records",
        },
      ],
    },
    {
      subcategoryId: "lesson-plans",
      requirements: [
        {
          id: "lesson-plan",
          title: "Lesson Plans",
        },
        {
          id: "teaching-plan",
          title: "Teaching Plan",
        },
      ],
    },
    {
      subcategoryId: "calendar",
      requirements: [
        {
          id: "academic-calendar",
          title: "Academic Calendar",
        },
        {
          id: "teaching-schedule",
          title: "Teaching Schedule",
        },
      ],
    },
  ],

  3: [
    {
      subcategoryId: "co",
      requirements: [
        {
          id: "course-outcomes",
          title: "Course Outcomes",
        },
        {
          id: "co-attainment",
          title: "Course Outcome Attainment",
        },
      ],
    },
    {
      subcategoryId: "po",
      requirements: [
        {
          id: "program-outcomes",
          title: "Program Outcomes",
        },
        {
          id: "po-attainment",
          title: "Program Outcome Attainment",
        },
      ],
    },
    {
      subcategoryId: "mapping",
      requirements: [
        {
          id: "co-po-mapping",
          title: "CO-PO Mapping",
        },
        {
          id: "co-pso-mapping",
          title: "CO-PSO Mapping",
        },
      ],
    },
    {
      subcategoryId: "attainment",
      requirements: [
        {
          id: "attainment-analysis",
          title: "Attainment Analysis",
        },
        {
          id: "attainment-report",
          title: "Attainment Report",
        },
      ],
    },
  ],

  4: [
    {
      subcategoryId: "results",
      requirements: [
        {
          id: "student-results",
          title: "Student Results",
        },
        {
          id: "result-analysis",
          title: "Result Analysis",
        },
      ],
    },
    {
      subcategoryId: "placements",
      requirements: [
        {
          id: "placement-data",
          title: "Placement Data",
        },
        {
          id: "placement-analysis",
          title: "Placement Analysis",
        },
      ],
    },
    {
      subcategoryId: "higher",
      requirements: [
        {
          id: "higher-studies-data",
          title: "Higher Studies Data",
        },
        {
          id: "higher-studies-record",
          title: "Higher Studies Records",
        },
      ],
    },
    {
      subcategoryId: "internships",
      requirements: [
        {
          id: "internship-data",
          title: "Internship Records",
        },
        {
          id: "internship-analysis",
          title: "Internship Analysis",
        },
      ],
    },
  ],

  5: [
    {
      subcategoryId: "profiles",
      requirements: [
        {
          id: "faculty-profiles",
          title: "Faculty Profiles",
        },
        {
          id: "faculty-workload",
          title: "Faculty Workload Records",
        },
      ],
    },
    {
      subcategoryId: "qualification",
      requirements: [
        {
          id: "faculty-qualification",
          title: "Faculty Qualification Records",
        },
      ],
    },
    {
      subcategoryId: "publications",
      requirements: [
        {
          id: "research-publications",
          title: "Research Publications",
        },
      ],
    },
    {
      subcategoryId: "patents",
      requirements: [
        {
          id: "patents",
          title: "Patent Records",
        },
      ],
    },
    {
      subcategoryId: "projects",
      requirements: [
        {
          id: "faculty-projects",
          title: "Faculty Project Records",
        },
      ],
    },
    {
      subcategoryId: "fdp",
      requirements: [
        {
          id: "fdp-records",
          title: "FDP / Workshop Records",
        },
      ],
    },
  ],

  6: [
    {
      subcategoryId: "labs",
      requirements: [
        {
          id: "laboratory-details",
          title: "Laboratory Details",
        },
        {
          id: "lab-utilization",
          title: "Laboratory Utilization Records",
        },
      ],
    },
    {
      subcategoryId: "equipment",
      requirements: [
        {
          id: "equipment-list",
          title: "Equipment Inventory",
        },
      ],
    },
    {
      subcategoryId: "software",
      requirements: [
        {
          id: "software-list",
          title: "Software / Tools List",
        },
      ],
    },
    {
      subcategoryId: "library",
      requirements: [
        {
          id: "library-resources",
          title: "Library Resources",
        },
      ],
    },
  ],

  7: [
    {
      subcategoryId: "feedback",
      requirements: [
        {
          id: "feedback-analysis",
          title: "Feedback Analysis",
        },
        {
          id: "feedback-records",
          title: "Stakeholder Feedback Records",
        },
      ],
    },
    {
      subcategoryId: "atr",
      requirements: [
        {
          id: "action-taken-report",
          title: "Action Taken Reports",
        },
      ],
    },
    {
      subcategoryId: "quality",
      requirements: [
        {
          id: "quality-initiatives",
          title: "Quality Improvement Initiatives",
        },
      ],
    },
  ],

  8: [
    {
      subcategoryId: "faculty",
      requirements: [
        {
          id: "first-year-faculty",
          title: "First Year Faculty Records",
        },
      ],
    },
    {
      subcategoryId: "laboratories",
      requirements: [
        {
          id: "first-year-labs",
          title: "First Year Laboratory Records",
        },
      ],
    },
    {
      subcategoryId: "results",
      requirements: [
        {
          id: "first-year-results",
          title: "First Year Results",
        },
      ],
    },
  ],

  9: [
    {
      subcategoryId: "mentoring",
      requirements: [
        {
          id: "mentoring-records",
          title: "Mentoring Records",
        },
      ],
    },
    {
      subcategoryId: "scholarships",
      requirements: [
        {
          id: "scholarship-records",
          title: "Scholarship Records",
        },
      ],
    },
    {
      subcategoryId: "clubs",
      requirements: [
        {
          id: "student-clubs",
          title: "Student Club Records",
        },
        {
          id: "club-activities",
          title: "Club Activity Records",
        },
      ],
    },
  ],

  10: [
    {
      subcategoryId: "governance",
      requirements: [
        {
          id: "governance-structure",
          title: "Governance Structure",
        },
        {
          id: "committee-records",
          title: "Committee Records",
        },
      ],
    },
    {
      subcategoryId: "finance",
      requirements: [
        {
          id: "financial-records",
          title: "Financial Resource Records",
        },
      ],
    },
    {
      subcategoryId: "policies",
      requirements: [
        {
          id: "institutional-policies",
          title: "Institutional Policies",
        },
      ],
    },
  ],
};