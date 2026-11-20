(() => {
  const root = document.querySelector("#project-collection");
  if (!root) return;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  let projects = [];
  try { projects = JSON.parse(root.dataset.projects || "[]"); } catch { projects = []; }
  const searchInput = root.querySelector("[data-world-search]");
  const filterSelect = root.querySelector("[data-world-filter]");
  const list = root.querySelector("[data-world-list]");
  const details = root.querySelector(".mc-world-details__body");
  const count = root.querySelector("[data-world-count]");
  if (!searchInput || !filterSelect || !list || !details || !count) return;

  const categories = [...new Set(projects.map((project) => project.category))];
  const params = new URLSearchParams(location.search);
  let filter = root.dataset.initialFilter || "";
  const queryCategory = categories.find((category) => slug(category) === params.get("category"));
  if (queryCategory) filter = queryCategory;
  let selected = projects.find((project) => slug(project.name) === params.get("project")) || null;
  let search = "";

  const renderDetail = () => {
    if (!selected) {
      details.innerHTML = '<div class="mc-world-empty"><div><strong>Select a world</strong>Choose a project from the list to view its description, tools, and source.</div></div>';
      return;
    }
    details.innerHTML = `
      <div class="mc-world-details__selected">
        <div class="mc-world-details__meta">${escapeHtml(selected.category)} · ${escapeHtml(selected.status)}</div>
        <h2>${escapeHtml(selected.name)}</h2>
        <p class="mc-world-details__description">${escapeHtml(selected.blurb)}</p>
        <h3 class="mc-world-details__section">Tools &amp; Technologies</h3>
        <div class="mc-world-tags">${(selected.tech || []).map((tag) => `<span class="mc-world-tag">${escapeHtml(tag)}</span>`).join("")}</div>
        ${selected.link ? `<a class="mc-world-link" href="${escapeHtml(selected.link)}" target="_blank" rel="noreferrer">Open Project ↗</a>` : '<p class="mc-world-details__meta">No public repository available.</p>'}
      </div>`;
  };

  const render = () => {
    const visible = projects.filter((project) => {
      const matchesCategory = !filter || project.category === filter;
      const searchable = [project.name, project.category, project.status, project.blurb, ...(project.tech || [])].join(" ").toLowerCase();
      return matchesCategory && searchable.includes(search);
    });
    if (selected && !visible.includes(selected)) selected = null;
    count.textContent = `${visible.length} of ${projects.length} projects`;
    list.innerHTML = visible.length ? visible.map((project, index) => {
      const isSelected = selected?.name === project.name;
      return `<button class="mc-world-row${isSelected ? " is-selected" : ""}" type="button" data-world="${escapeHtml(slug(project.name))}" aria-pressed="${isSelected}" style="animation-delay:${Math.min(index * 18, 180)}ms">
        <span class="mc-world-icon" aria-hidden="true">${escapeHtml(project.name.slice(0, 2).toUpperCase())}</span>
        <span class="mc-world-copy"><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.category)} · ${escapeHtml(project.status)}</small></span>
        <span class="mc-world-mark" aria-hidden="true">›</span>
      </button>`;
    }).join("") : '<p class="mc-world-empty">No projects match this search.</p>';
    renderDetail();
    list.querySelectorAll("[data-world]").forEach((button) => button.addEventListener("click", () => {
      selected = projects.find((project) => slug(project.name) === button.dataset.world) || null;
      render();
      const next = new URLSearchParams(location.search);
      if (selected) next.set("project", slug(selected.name));
      else next.delete("project");
      if (filter) next.set("category", slug(filter));
      else next.delete("category");
      history.pushState({}, "", location.pathname + (next.size ? "?" + next : ""));
    }));
  };

  filterSelect.value = filter;
  searchInput.value = search;
  filterSelect.addEventListener("change", () => {
    filter = filterSelect.value;
    render();
    const next = new URLSearchParams(location.search);
    if (filter) next.set("category", slug(filter));
    else next.delete("category");
    history.replaceState({}, "", location.pathname + (next.size ? "?" + next : ""));
  });
  searchInput.addEventListener("input", () => { search = searchInput.value.toLowerCase().trim(); render(); });
  window.addEventListener("popstate", () => {
    const current = new URLSearchParams(location.search);
    filter = categories.find((category) => slug(category) === current.get("category")) || "";
    selected = projects.find((project) => slug(project.name) === current.get("project")) || null;
    filterSelect.value = filter;
    render();
  });

  if (selected && !categories.includes(filter)) filter = selected.category;
  filterSelect.value = filter;
  render();
})();