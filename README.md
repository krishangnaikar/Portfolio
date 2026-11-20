# Krishang Naikar - Portfolio

A Flask portfolio with a game lobby landing page and separate screens for Projects, Experience, Research & Ideas, Skills, About, and a dedicated Options menu. Each screen has its own interactions and navigation. The Recruiter Quick View remains available as a concise, print-friendly page at `/recruiter`.

Project content is maintained in `projects.json`; category and status labels distinguish research, contributions, software projects, coursework, and concepts. Public repository links are included where available. Local projects have no source link; private repository details are not published.

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

The exporter writes `index.html`, `projects.html`, `experience.html`, `research.html`, `skills.html`, `about.html`, `settings.html`, and `recruiter.html`. Relative asset and page links support hosting under a repository subpath.

## Catalog scope (November 3, 2026)

34 entries cover public project repositories and documented local work. The GitHub profile configuration repository is not a separate software project. The generic `agent` fork is not claimed as original work. Qiskit is represented by the specific merged contribution and a separate optimization investigation, not by claiming authorship of the SDK. Private repositories and personal storage repositories are excluded. A repository listing or historical note establishes scope; it does not establish that every project currently runs.
