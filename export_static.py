"""Regenerate all static portfolio routes from the Flask app."""
from pathlib import Path
from app import app

ROUTES = {
    "/": "index.html",
    "/projects": "projects.html",
    "/experience": "experience.html",
    "/research": "research.html",
    "/skills": "skills.html",
    "/about": "about.html",
    "/recruiter": "recruiter.html",
}


def write_static(client, route, output_name):
    response = client.get(route)
    if response.status_code != 200:
        raise RuntimeError(f"{route} returned {response.status_code}")
    html = response.get_data(as_text=True).replace('="/static/', '="static/')
    for path, filename in ROUTES.items():
        html = html.replace(f'href="{path}"', f'href="{filename}"')
    html = "\\n".join(line.rstrip() for line in html.splitlines()) + "\\n"
    Path(__file__).with_name(output_name).write_text(html)


if __name__ == "__main__":
    with app.test_client() as client:
        for route, output_name in ROUTES.items():
            write_static(client, route, output_name)
