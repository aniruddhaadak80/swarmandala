import { isSwara, parseNote, type Raga, uniqueNotes } from "@repo/core";
import { RAGAS } from "./ragas";

export interface ValidationIssue {
  readonly slug: string;
  readonly field: string;
  readonly message: string;
}

export function validateRagas(ragas: readonly Raga[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const raga of ragas) {
    const flag = (field: string, message: string) =>
      issues.push({ slug: raga.slug, field, message });

    if (!/^[a-z0-9-]+$/.test(raga.slug)) flag("slug", "must be lowercase kebab-case");
    if (seen.has(raga.slug)) flag("slug", "duplicate slug");
    seen.add(raga.slug);

    if (raga.name.trim().length === 0) flag("name", "must not be empty");
    if (raga.devanagari.trim().length === 0) flag("devanagari", "must not be empty");
    if (raga.description.length < 80) flag("description", "needs at least 80 characters");
    if (raga.mood.length < 20) flag("mood", "needs at least 20 characters");
    if (raga.prahar < 1 || raga.prahar > 8) flag("prahar", "must be 1–8");

    for (const note of [...raga.aroha, ...raga.avaroha, ...raga.pakad]) {
      try {
        parseNote(note);
      } catch {
        flag("notes", `unparseable note "${note}"`);
      }
    }

    const available = new Set(uniqueNotes(raga));
    if (raga.vadi && !available.has(raga.vadi)) flag("vadi", "must appear in the raga's scale");
    if (raga.samvadi && !available.has(raga.samvadi))
      flag("samvadi", "must appear in the raga's scale");
    if (raga.vadi && raga.samvadi && raga.vadi === raga.samvadi)
      flag("samvadi", "must differ from vadi");

    if (raga.aroha.length < 4) flag("aroha", "needs at least four notes");
    if (raga.avaroha.length < 4) flag("avaroha", "needs at least four notes");
    if (!uniqueNotes(raga).every(isSwara)) flag("notes", "contains an unknown swara");
  }

  return issues;
}

export function assertValidRagas(ragas: readonly Raga[] = RAGAS): void {
  const issues = validateRagas(ragas);
  if (issues.length > 0) {
    const summary = issues.map((issue) => `${issue.slug}.${issue.field}: ${issue.message}`);
    throw new Error(`Invalid raga dataset:\n${summary.join("\n")}`);
  }
}
