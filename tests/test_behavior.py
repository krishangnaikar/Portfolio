import re
from pathlib import Path

import app


def test_home_has_separate_page_navigation():
    response = app.app.test_client().get('/')
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert app.profile['name'] in html
    for path in ('/projects', '/experience', '/skills', '/about', '/settings', '/recruiter'):
        assert f'href="{path}"' in html


def test_each_portfolio_section_is_a_separate_page():
    client = app.app.test_client()
    expected = {
        '/projects': ('Select World', 'Research &amp; Ideas', 'Multimodal Enterprise RAG'),
        '/experience': ('Play Multiplayer', 'Zentroq'),
        '/research': ('Research &amp; Ideas', 'Transistor Fine-Tuning and Tool-Use Evaluation'),
        '/skills': ('Advancements', 'Languages'),
        '/about': ('Player Profile', 'San José State University'),
        '/settings': ('Options', 'Player Profile'),
        '/recruiter': ('Recruiter Quick View', app.profile['email']),
    }
    for path, markers in expected.items():
        response = client.get(path)
        assert response.status_code == 200
        html = response.get_data(as_text=True)
        for marker in markers:
            assert marker in html


def test_static_pages_are_generated_for_each_route():
    root = Path(app.__file__).parent
    for filename in ('index.html', 'projects.html', 'experience.html', 'research.html', 'skills.html', 'about.html', 'settings.html', 'recruiter.html'):
        html = (root / filename).read_text()
        assert '{{' not in html and '{%' not in html
        if filename == 'recruiter.html':
            assert 'Recruiter Quick View' in html
        else:
            assert 'static/minecraft-portfolio.css' in html


def test_recruiter_links_to_projects_in_flask_and_static():
    client = app.app.test_client()
    html = client.get('/recruiter').get_data(as_text=True)
    static_html = (Path(app.__file__).parent / 'recruiter.html').read_text()
    for page, destination in ((html, '/projects'), (static_html, 'projects.html')):
        assert re.findall(r'<a\b[^>]*\bhref="([^"]*)"[^>]*>\s*Full project portfolio\s*</a>', page) == [destination]
    assert client.get('/projects').status_code == 200


def test_unknown_page_returns_404():
    assert app.app.test_client().get('/does-not-exist').status_code == 404


def test_home_does_not_accept_post():
    assert app.app.test_client().post('/').status_code == 405


def test_no_project_link_is_rendered_empty():
    html = app.app.test_client().get('/projects').get_data(as_text=True)
    assert 'href="None"' not in html
    assert 'href=""' not in html
