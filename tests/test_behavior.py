import app

def test_home_renders_profile_and_project_links():
    app.app.config['TESTING'] = True
    response = app.app.test_client().get('/')
    assert response.status_code == 200
    text = response.get_data(as_text=True)
    assert app.profile['name'] in text
    for project in app.projects:
        assert project['link'] in text

def test_unknown_page_returns_404():
    assert app.app.test_client().get('/does-not-exist').status_code == 404

def test_home_does_not_accept_post():
    assert app.app.test_client().post('/').status_code == 405
