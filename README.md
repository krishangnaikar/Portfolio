# Krishang Naikar - Portfolio

Flask portfolio with a generated static page. Project content is maintained in
`projects.json`; category and status labels distinguish research, contributions,
software projects, coursework, and concepts. Public repository links are included
where available. Local projects have no source link; private repository details
are not published.

## Run locally

```sh
python -m pip install -r requirements.txt
python app.py
```

## Update the catalog

Edit `projects.json` and, when needed, `templates/index.html`. Then regenerate the
static entry point and run the checks:

```sh
python -m pip install -r requirements-test.txt
python export_static.py
python -m pytest
```

`index.html` is generated, not a second template. Its relative `static/` URLs
support hosting under a repository subpath. Flask uses `templates/index.html`.
Keep both entry points in sync by running the export after content changes.

## Catalog scope (November 3, 2026)

34 entries cover public project repositories and documented local work. The
GitHub profile configuration repository is not a separate software project.
The generic `agent` fork is not claimed as original work. Qiskit is represented
by the specific merged contribution and a separate optimization investigation,
not by claiming authorship of the SDK. Private repositories and personal storage
repositories are excluded. A repository listing or historical note establishes
scope; it does not establish that every project currently runs.
