import app

def test_home_renders_profile_and_project_links():
    app.app.config['TESTING'] = True
    response = app.app.test_client().get('/')
    assert response.status_code == 200
    text = response.get_data(as_text=True)
    assert app.profile['name'] in text
    for project in app.projects:
        assert project['name'].replace('&', '&amp;') in text
        if project['link']:
            assert project['link'] in text

def test_unknown_page_returns_404():
    assert app.app.test_client().get('/does-not-exist').status_code == 404

def test_home_does_not_accept_post():
    assert app.app.test_client().post('/').status_code == 405


def test_static_export_matches_flask_page():
    from pathlib import Path
    html = app.app.test_client().get('/').get_data(as_text=True)
    expected = html.replace('="/static/', '="static/')
    expected = '\n'.join(line.rstrip() for line in expected.splitlines()) + '\n'
    assert Path(app.__file__).with_name('index.html').read_text() == expected
    assert '{{' not in expected
    assert '{%' not in expected


def test_local_projects_do_not_render_empty_links():
    html = app.app.test_client().get('/').get_data(as_text=True)
    assert 'href="None"' not in html
    assert 'href=""' not in html
    assert 'No public repository' in html
    assert 'Merged contribution' in html
    assert 'Concepts and plans' in html


def test_recruiter_quick_view_renders_selected_information():
    response = app.app.test_client().get('/recruiter')
    assert response.status_code == 200
    text = response.get_data(as_text=True)
    assert app.profile['name'] in text
    assert 'Recruiter Quick View' in text
    assert app.education[0]['school'] in text
    assert 'Multimodal Enterprise RAG' in text
    assert 'Qiskit ket_basis Visualization' in text
    assert app.profile['github'] in text


def test_static_recruiter_page_is_available():
    from pathlib import Path
    path = Path(app.__file__).with_name('recruiter.html')
    assert path.exists()
    text = path.read_text()
    assert 'Recruiter Quick View' in text
    assert 'href="index.html"' in text
    assert '{{' not in text
    assert '{%' not in text
