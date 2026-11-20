(() => {
  const root = document.querySelector("#project-collection");
  if (!root) return;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let projects = [];
  let activeCategory = "";
  let activeProject = "";
  let searchTerm = "";
  let openCategories = new Set();

  const categories = () => [...new Set(projects.map((p) => p.category))];
  const findProject = (id) => projects.find((p) => slug(p.name) === id);
  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("category");
    activeCategory = categories().find((category) => slug(category) === categoryId) || activeCategory || (projects[0]?.category ?? "");
    activeProject = params.get("project") || "";
    if (activeProject) {
      const project = findProject(activeProject);
      if (project) openCategories.add(project.category);
    }
  };
  const writeUrl = (push = true) => {
    const params = new URLSearchParams(location.search);
    if (activeCategory) params.set("category", slug(activeCategory));
    else params.delete("category");
    if (activeProject) params.set("project", activeProject);
    else params.delete("project");
    history[push ? "pushState" : "replaceState"]({}, "", location.pathname + (params.size ? "?" + params : ""));
  };

  function render() {
    const cats = categories();
    if (!cats.includes(activeCategory)) activeCategory = cats[0] || "";
    const chosen = findProject(activeProject);
    if (chosen) openCategories.add(chosen.category);
    const filteredByCategory = new Map(cats.map((cat) => [cat, projects.filter((p) =>
      p.category === cat && (p.name + " " + p.status + " " + p.blurb + " " + p.tech.join(" ")).toLowerCase().includes(searchTerm)
    )]));
    if (chosen && !filteredByCategory.get(chosen.category)?.some((p) => slug(p.name) === activeProject)) activeProject = "";
    const selected = findProject(activeProject);
    const totalVisible = [...filteredByCategory.values()].reduce((sum, items) => sum + items.length, 0);
    root.innerHTML = `
      <div class="collection-toolbar">
        <label class="collection-search"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search projects" placeholder="Search this collection" value="${escapeHtml(searchTerm)}"></label>
        <span class="collection-count">${projects.length} PROJECTS / ${cats.length} CATEGORIES</span>
      </div>
      <div class="collection-layout">
        <section class="collection-category-grid" aria-label="Project categories">
          ${cats.map((cat, i) => {
            const items = filteredByCategory.get(cat) || [];
            return `<details class="collection-category" data-category-panel="${escapeHtml(cat)}" ${openCategories.has(cat) ? "open" : ""}>
              <summary class="category-header"><span class="category-emblem" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span class="category-title-wrap"><strong>${escapeHtml(cat)}</strong><small>${projects.filter((p) => p.category === cat).length} PROJECTS / COLLECTION</small></span><span class="category-expand" aria-hidden="true">+</span></summary>
              <div class="category-project-grid">
                ${items.length ? items.map((p, n) => `<button class="project-skin ${slug(p.name) === activeProject ? "is-selected" : ""}" data-project="${slug(p.name)}" data-project-category="${escapeHtml(cat)}" aria-pressed="${slug(p.name) === activeProject}">
                  <span class="skin-art" aria-hidden="true"><span class="skin-glyph">${escapeHtml(p.name.slice(0, 2).toUpperCase())}</span><span class="skin-lines"></span></span>
                  <span class="skin-label"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.status)}</small></span><span class="skin-number">${String(n + 1).padStart(2, "0")}</span>
                </button>`).join("") : '<p class="collection-empty">No projects match this search.</p>'}
              </div>
            </details>`;
          }).join("")}
        </section>
        <aside class="project-inspection" aria-live="polite">
          ${selected ? `
            <div class="inspection-banner"><span class="inspection-kicker">${escapeHtml(selected.category)} / ${escapeHtml(selected.status)}</span><span class="inspection-mark" aria-hidden="true">${escapeHtml(selected.name.slice(0, 2).toUpperCase())}</span><h2>${escapeHtml(selected.name)}</h2></div>
            <div class="inspection-content"><p class="inspection-label">PROJECT INTEL</p><p class="inspection-description">${escapeHtml(selected.blurb)}</p><p class="inspection-label tools-label">LOADOUT / TOOLS</p><div class="detail-tags">${selected.tech.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
            ${selected.link ? `<a class="inspection-link" href="${escapeHtml(selected.link)}" target="_blank" rel="noreferrer">OPEN PROJECT / CONTRIBUTION <span aria-hidden="true">↗</span></a>` : '<span class="inspection-private">No public repository available</span>'}
            </div>
          ` : `<div class="inspection-idle"><span class="idle-mark" aria-hidden="true">＋</span><p class="inspection-label">PROJECT PREVIEW / ${totalVisible} ITEMS</p><h2>Choose a project</h2><p>Select a tile to open its full brief, status, tools, and source here.</p></div>`}
        </aside>
      </div>`;
    root.querySelectorAll("[data-category-panel]").forEach((panel) => panel.addEventListener("toggle", () => {
      if (panel.open) openCategories.add(panel.dataset.categoryPanel);
      else openCategories.delete(panel.dataset.categoryPanel);
    }));
    root.querySelector(".collection-search").addEventListener("input", (event) => {
      searchTerm = event.target.value.toLowerCase().trim();
      render();
      const input = root.querySelector(".collection-search input");
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
    root.querySelectorAll("[data-project]").forEach((button) => button.addEventListener("click", () => {
      activeCategory = button.dataset.projectCategory;
      openCategories.add(activeCategory);
      activeProject = activeProject === button.dataset.project ? "" : button.dataset.project;
      render();
      writeUrl();
    }));
  }

  fetch(root.dataset.source || "projects.json")
    .then((response) => { if (!response.ok) throw new Error("Project catalog could not be loaded."); return response.json(); })
    .then((data) => {
      projects = data;
      const first = categories()[0];
      if (first) openCategories.add(first);
      readUrl();
      render();
      writeUrl(false);
    })
    .catch(() => { root.innerHTML = '<p class="collection-error">The project collection could not be loaded. Please refresh the page.</p>'; });
  window.addEventListener("popstate", () => { readUrl(); render(); });
})();
