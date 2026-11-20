import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isActivityTab } from "../lib/activityTabs.ts";
import { needsExternalConfirm } from "../lib/externalLinks.ts";
import portfolioData from "../content/portfolio.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pub = (...p: string[]) => path.join(root, "public", ...p);

test("data integrity: all internal images referenced in portfolio.json exist on disk", () => {
  const imagesToCheck: string[] = [];

  // Projects
  portfolioData.projects.forEach((p) => {
    if (p.imageUrl && p.imageUrl.startsWith("/")) imagesToCheck.push(p.imageUrl);
  });

  // Experience
  portfolioData.experience.forEach((e) => {
    if (e.imageUrl && e.imageUrl.startsWith("/")) imagesToCheck.push(e.imageUrl);
    ((e as { media?: { src?: string }[] }).media ?? []).forEach((m) => {
      if (m.src && m.src.startsWith("/")) imagesToCheck.push(m.src);
    });
  });

  // Resources
  portfolioData.resources.forEach((r) => {
    if (r.imageUrl && r.imageUrl.startsWith("/")) imagesToCheck.push(r.imageUrl);
  });

  // Side quests
  portfolioData.activities.sideQuests.forEach((sq) => {
    sq.links?.forEach((l) => {
      assert.ok(l.url.startsWith("http"), `Side quest link ${l.url} must be http`);
    });
  });

  imagesToCheck.forEach((imgPath) => {
    const full = pub(...imgPath.replace(/^\//, "").split("/"));
    assert.ok(
      fs.existsSync(full),
      `Referenced image does not exist: ${imgPath} -> ${full}`
    );
  });
});

test("audio files exist and are loadable", () => {
  assert.ok(fs.existsSync(pub("sounds", "click.ogg")), "click.ogg must exist");
  assert.ok(fs.existsSync(pub("sounds", "thunder.ogg")), "thunder.ogg must exist");
});

test("activity tabs security and edge cases", () => {
  assert.equal(isActivityTab("sideQuests"), true);
  assert.equal(isActivityTab("reading"), true);
  assert.equal(isActivityTab("music"), true);
  assert.equal(isActivityTab("movies"), true);
  assert.equal(isActivityTab("travel"), true);

  // Malicious / invalid params
  assert.equal(isActivityTab(""), false);
  assert.equal(isActivityTab("javascript:alert(1)"), false);
  assert.equal(isActivityTab("__proto__"), false);
  assert.equal(isActivityTab(undefined), false);
  assert.equal(isActivityTab(["sideQuests"]), false);
});

test("external confirmation protects external links but leaves mailto/tel alone", () => {
  assert.equal(needsExternalConfirm("https://scholar.google.com/citations?user=-fnGGHYAAAAJ"), true);
  assert.equal(needsExternalConfirm("https://github.com/DevomB/FoldProof"), true);
  assert.equal(needsExternalConfirm("mailto:someone@example.com"), false);
  assert.equal(needsExternalConfirm("tel:5107147148"), false);
  assert.equal(needsExternalConfirm("/options"), false);
  assert.equal(needsExternalConfirm("/resume.pdf"), true);
});

test("portfolio content has the expected projects, experience and links", () => {
  assert.equal(portfolioData.version, "Portfolio v1.0");
  assert.equal(portfolioData.name, "Krishang Naikar");
  assert.ok(portfolioData.resume.preview.includes("Qiskit"));

  const qiskit = portfolioData.projects.find((p) => p.id === "qiskit-ket-basis");
  assert.ok(qiskit, "Qiskit contribution must be in projects");
  assert.ok(qiskit.scope.includes("16868"));

  const transistor = portfolioData.projects.find((p) => p.id === "transistor-ft");
  assert.ok(transistor, "Transistor fine-tuning study must be in projects");
  assert.ok(transistor.tags.includes("LoRA"));

  const sjsu = portfolioData.experience.find((e) => e.id === "sjsu-research");
  assert.ok(sjsu, "SJSU research must be in experience");

  const ids = portfolioData.projects.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, "project ids must be unique");

  portfolioData.projects.forEach((p) => {
    const urls = [p.demoUrl, (p as { githubUrl?: string }).githubUrl].filter(Boolean) as string[];
    urls.forEach((u) => assert.ok(u === "#" || u.startsWith("https://"), `project ${p.id} url ${u} must be https`));
  });

  assert.ok(portfolioData.activities.sideQuests.length > 0, "at least one side quest");
  assert.ok(portfolioData.contact.github.startsWith("https://github.com/"));
});
