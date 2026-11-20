"""Regenerate the static portfolio pages from the Flask routes."""
from pathlib import Path
from app import app


def write_static(client, route, output_name):
    response = client.get(route)
    if response.status_code != 200:
        raise RuntimeError(f"{route} returned {response.status_code}")
    html = response.get_data(as_text=True)
    html = html.replace('="/static/', '="static/')
    html = html.replace('href="/recruiter"', 'href="recruiter.html"')
    html = html.replace('href="/"', 'href="index.html"')
    html = "\n".join(line.rstrip() for line in html.splitlines()) + "\n"
    Path(__file__).with_name(output_name).write_text(html)


if __name__ == "__main__":
    with app.test_client() as client:
        write_static(client, "/", "index.html")
        write_static(client, "/recruiter", "recruiter.html")
