# Krishang Naikar - Portfolio

A Minecraft title-screen-inspired portfolio with connected menu pages for Projects, Experience, Skills, About, and Options. The layout takes inspiration from the menu flow and blocky visual language of Minecraft, while using original styling and portfolio content. The home screen features a voxel player preview based on Krishang's supplied Minecraft skin.

Projects are organized by topic, including Research & Ideas. Selecting a project opens its overview, tools, status, and available source in a panel beside the project list. The Recruiter Quick View remains available as a concise, print-friendly page at `/recruiter`.

Project content is maintained in `projects.json`; category and status labels describe the work directly. Public repository links are included where available. Local projects have no source link; private repository details are not published.

## Run locally

```sh
python -m pip install -r requirements.txt
python app.py
```

## Update content and export static pages

Edit `projects.json` or the matching data in `app.py`, then regenerate the static routes:

```sh
python export_static.py
```

The exporter writes `index.html`, `projects.html`, `experience.html`, `research.html`, `skills.html`, `about.html`, `settings.html`, and `recruiter.html`. The `research.html` page remains available as a direct view of the Research & Ideas category; the main menu leads to Projects. Relative asset and page links support hosting under a repository subpath.

## Catalog scope (November 3, 2026)

34 entries cover public project repositories and documented local work. The GitHub profile configuration repository is not a separate software project. The generic `agent` fork is not claimed as original work. Qiskit is represented by the specific merged contribution and a separate optimization investigation, not by claiming authorship of the SDK. Private repositories and personal storage repositories are excluded. A repository listing or historical note establishes scope; it does not establish that every project currently runs.

The title screen uses the vanilla cubemap faces from [Aarav Ghai’s portfolio](https://github.com/ghaiaarav/portfolio/tree/main/public/panorama). The CSS renderer respects system and portfolio reduced-motion preferences.
