# health_app/__init__.py

import os
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from authlib.integrations.flask_client import OAuth

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'main.login'
oauth = OAuth()

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)
    login_manager.init_app(app)
    oauth.init_app(app)

    # Register Google OAuth client
    oauth.register(
        name='google',
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        client_kwargs={'scope': 'openid email profile'}
    )


    with app.app_context():
        from . import routes, models
        app.register_blueprint(routes.main)

        db.create_all()

    return app
