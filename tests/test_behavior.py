import app


def test_home_has_separate_page_navigation():
    response = app.app.test_client().get('/')
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert app.profile['name'] in html
    for path in ('/projects', '/experience', '/research', '/skills', '/about', '/recruiter'):
        assert path in html


def test_each_portfolio_section_is_a_separate_page():
    client = app.app.test_client()
    expected = {
        '/projects': ('Select Project', 'Multimodal Enterprise RAG'),
        '/experience': ('Experience', 'Zentroq'),
        '/research': ('Research &amp; Ideas', 'Transistor Fine-Tuning and Tool-Use Evaluation'),
        '/skills': ('Skills', 'Languages'),
        '/about': ('About', 'San José State University'),
        '/recruiter': ('Recruiter Quick View', app.profile['email']),
    }
    for path, markers in expected.items():
        response = client.get(path)
        assert response.status_code == 200
        html = response.get_data(as_text=True)
        for marker in markers:
            assert marker in html


def test_static_pages_are_generated_for_each_route():
    from pathlib import Path
    root = Path(app.__file__).parent
    for filename in ('index.html', 'projects.html', 'experience.html', 'research.html', 'skills.html', 'about.html', 'recruiter.html'):
        html = (root / filename).read_text()
        assert '{{' not in html and '{%' not in html
        if filename == 'recruiter.html':
            assert 'Recruiter Quick View' in html
        else:
            assert 'static/game-ui.css' in html


def test_unknown_page_returns_404():
    assert app.app.test_client().get('/does-not-exist').status_code == 404


def test_home_does_not_accept_post():
    assert app.app.test_client().post('/').status_code == 405


def test_no_project_link_is_rendered_empty():
    html = app.app.test_client().get('/projects').get_data(as_text=True)
    assert 'href="None"' not in html
    assert 'href=""' not in html
