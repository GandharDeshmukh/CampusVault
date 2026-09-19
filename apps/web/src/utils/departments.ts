export const departments = {
  ce: {
    slug: "ce",
    name: "Computer Engineering",
    shortName: "CE",
  },

  entc: {
    slug: "entc",
    name: "Electronics and Telecommunication Engineering",
    shortName: "ENTC",
  },

  it: {
    slug: "it",
    name: "Information Technology",
    shortName: "IT",
  },

  aids: {
    slug: "aids",
    name: "Artificial Intelligence and Data Science",
    shortName: "AI&DS",
  },

  ece: {
    slug: "ece",
    name: "Electronics and Computer Engineering",
    shortName: "E&CE",
  },
} as const;

export const departmentOrder = [
  "CE",
  "ENTC",
  "IT",
  "AI&DS",
  "E&CE",
] as const;

export function getDepartmentName(slug?: string) {
  if (!slug) return undefined;

  return (
    Object.values(departments).find(
      (department) =>
        department.slug === slug.toLowerCase()
    )?.name
  );
}

export function getDepartmentShortName(name: string) {
  return (
    Object.values(departments).find(
      (department) => department.name === name
    )?.shortName ?? name
  );
}

export function getDepartmentOrder(
  shortName: string
) {
  const normalized = shortName
    .trim()
    .toUpperCase();

  const aliases: Record<string, string> = {
    AIDS: "AI&DS",
    "AI&DS": "AI&DS",
    ECE: "E&CE",
    "E&CE": "E&CE",
  };

  const canonical =
    aliases[normalized] ?? normalized;

  const index = departmentOrder.indexOf(
    canonical as (typeof departmentOrder)[number]
  );

  return index === -1
    ? Number.MAX_SAFE_INTEGER
    : index;
}