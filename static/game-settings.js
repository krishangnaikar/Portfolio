(() => {
  const panel = document.getElementById("settings-preferences");
  const toggle = document.getElementById("settings-toggle");
  if (!panel || !toggle) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
  });

  document.querySelectorAll("[data-preference]").forEach((input) => {
    const name = input.dataset.preference;
    const key = `portfolio-${name}`;
    const enabled = localStorage.getItem(key) === "true";
    input.checked = enabled;
    document.body.classList.toggle(name, enabled);
    input.addEventListener("change", () => {
      localStorage.setItem(key, String(input.checked));
      document.body.classList.toggle(name, input.checked);
    });
  });
})();