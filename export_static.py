"""Regenerate root index.html from the same data and template as Flask."""
from pathlib import Path
from app import app

if __name__ == "__main__":
    with app.test_client() as client:
        response = client.get("/")
        if response.status_code != 200:
            raise RuntimeError(f"Home page returned {response.status_code}")
        # Relative static paths also work when hosted beneath a repository subpath.
        html = response.get_data(as_text=True).replace('="/static/', '="static/')
        html = "\n".join(line.rstrip() for line in html.splitlines()) + "\n"
        Path(__file__).with_name("index.html").write_text(html)
