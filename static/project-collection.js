(() => {
  const root = document.querySelector("#project-collection");
  if (!root) return;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const params = new URLSearchParams(location.search);
  let projects = [];
  let activeCategory = "";
  let activeProject = "";
  let searchTerm = "";

  const readUrl = () => {
    const p = new URLSearchParams(location.search);
    const catId = p.get("category");
    activeCategory = categories().find((category) => slug(category) === catId) || activeCategory || (projects[0]?.category ?? "");
    activeProject = p.get("project") || "";
  };
  const writeUrl = (push = true) => {
    const p = new URLSearchParams(location.search);
    p.set("category", slug(activeCategory));
    if (activeProject) p.set("project", activeProject); else p.delete("project");
    const url = location.pathname + "?" + p.toString();
    history[push ? "pushState" : "replaceState"]({}, "", url);
  };
  const findProject = (id) => projects.find((p) => slug(p.name) === id);
  const categories = () => [...new Set(projects.map((p) => p.category))];

  function render() {
    const cats = categories();
    if (!cats.includes(activeCategory)) activeCategory = cats[0] || "";
    const inCategory = projects.filter((p) => p.category === activeCategory);
    const visible = inCategory.filter((p) => (p.name + " " + p.blurb + " " + p.tech.join(" ")).toLowerCase().includes(searchTerm));
    if (!visible.some((p) => slug(p.name) === activeProject)) activeProject = "";
    const chosen = findProject(activeProject);
    root.innerHTML = `
      <div class="collection-toolbar">
        <label class="collection-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search projects" placeholder="Search this collection" value="${escapeHtml(searchTerm)}"></label>
        <span class="collection-count">${projects.length} PROJECTS / ${cats.length} CATEGORIES</span>
      </div>
      <div class="collection-layout">
        <aside class="collection-rail" aria-label="Project categories">
          <p class="collection-rail-label">CATEGORIES</p>
          ${cats.map((cat, i) => `<button class="category-tile ${cat === activeCategory ? "is-active" : ""}" data-category="${escapeHtml(cat)}" aria-pressed="${cat === activeCategory}">
            <span class="category-index">${String(i + 1).padStart(2, "0")}</span><span class="category-name">${escapeHtml(cat)}</span><span class="category-count">${projects.filter((p) => p.category === cat).length}</span>
          </button>`).join("")}
        </aside>
        <section class="collection-inventory" aria-label="Projects in selected category">
          <div class="inventory-heading"><div><p class="inventory-kicker">COLLECTION / PROJECTS</p><h2>${escapeHtml(activeCategory)}</h2></div><span class="inventory-total">${visible.length} ITEMS</span></div>
          <div class="project-skin-grid">
            ${visible.length ? visible.map((p, i) => `<button class="project-skin ${slug(p.name) === activeProject ? "is-selected" : ""}" data-project="${slug(p.name)}" aria-pressed="${slug(p.name) === activeProject}">
              <span class="skin-art" aria-hidden="true"><span class="skin-glyph">${escapeHtml(p.name.slice(0, 2).toUpperCase())}</span><span class="skin-lines"></span></span>
              <span class="skin-label"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.status)}</small></span><span class="skin-number">${String(i + 1).padStart(2, "0")}</span>
            </button>`).join("") : '<p class="collection-empty">No projects match this search.</p>'}
          </div>
        </section>
        <aside class="project-inspection" aria-live="polite">
          ${chosen ? `
            <div class="inspection-banner"><span class="inspection-kicker">${escapeHtml(chosen.category)} / ${escapeHtml(chosen.status)}</span><span class="inspection-mark" aria-hidden="true">${escapeHtml(chosen.name.slice(0, 2).toUpperCase())}</span><h2>${escapeHtml(chosen.name)}</h2></div>
            <div class="inspection-content"><p class="inspection-label">PROJECT INTEL</p><p class="inspection-description">${escapeHtml(chosen.blurb)}</p><p class="inspection-label tools-label">LOADOUT / TOOLS</p><div class="detail-tags">${chosen.tech.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
            ${chosen.link ? `<a class="inspection-link" href="${escapeHtml(chosen.link)}" target="_blank" rel="noreferrer">OPEN PROJECT / CONTRIBUTION <span aria-hidden="true">↗</span></a>` : '<span class="inspection-private">No public repository available</span>'}
            </div>
          ` : `<div class="inspection-idle"><span class="idle-mark" aria-hidden="true">＋</span><p class="inspection-label">PROJECT PREVIEW</p><h2>Choose a project</h2><p>Select a tile to inspect its full brief, current status, tools, and source link.</p></div>`}
        </aside>
      </div>`;
    root.querySelector(".collection-search").addEventListener("input", (event) => { searchTerm = event.target.value.toLowerCase().trim(); render(); const input = root.querySelector(".collection-search input"); input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
    root.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { activeCategory = button.dataset.category; activeProject = ""; render(); writeUrl(); }));
    root.querySelectorAll("[data-project]").forEach((button) => button.addEventListener("click", () => { activeProject = activeProject === button.dataset.project ? "" : button.dataset.project; render(); writeUrl(); }));
  }

  fetch(root.dataset.source || "projects.json")
    .then((response) => { if (!response.ok) throw new Error("Project catalog could not be loaded."); return response.json(); })
    .then((data) => { projects = data; readUrl(); render(); writeUrl(false); })
    .catch(() => { root.innerHTML = '<p class="collection-error">The project collection could not be loaded. Please refresh the page.</p>'; });
  window.addEventListener("popstate", () => { readUrl(); render(); });
})();
