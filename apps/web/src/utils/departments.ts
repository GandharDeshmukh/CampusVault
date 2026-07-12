export const departments = {
  ce: {
    slug: "ce",
    name: "Computer Engineering",
    shortName: "CE",
  },
  it: {
    slug: "it",
    name: "Information Technology",
    shortName: "IT",
  },
  ece: {
    slug: "ece",
    name: "Electronics and Computer Engineering",
    shortName: "E&CE",
  },
  entc: {
    slug: "entc",
    name: "Electronics and Telecommunication Engineering",
    shortName: "ENTC",
  },
  aids: {
    slug: "aids",
    name: "Artificial Intelligence and Data Science",
    shortName: "AI&DS",
  },
} as const;

export function getDepartmentName(slug?: string) {
  if (!slug) return undefined;

  return departments[
    slug.toLowerCase() as keyof typeof departments
  ]?.name;
}

export function getDepartmentShortName(name: string) {
  const values = Object.values(departments);

  return (
    values.find((d) => d.name === name)?.shortName ??
    name
  );
}