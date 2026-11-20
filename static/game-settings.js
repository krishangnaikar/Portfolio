(() => {
  for (const name of ["reduced-motion", "high-contrast"]) {
    const key = "portfolio-" + name;
    const input = document.querySelector('[data-preference="' + name + '"]');
    let enabled = false;
    try { enabled = localStorage.getItem(key) === "true"; } catch {}
    document.body.classList.toggle(name, enabled);
    if (!input) continue;
    input.checked = enabled;
    input.addEventListener("change", () => {
      document.body.classList.toggle(name, input.checked);
      try { localStorage.setItem(key, String(input.checked)); } catch {}
    });
  }
  const panel = document.getElementById("settings-preferences");
  const toggle = document.getElementById("settings-toggle");
  if (panel && toggle) toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
  });
})();
