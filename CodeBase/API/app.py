from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from ml_models import load_models
import os


def create_app():
    app = Flask(__name__)
    app.config["API_TITLE"] = "Legal Search Models REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = (
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    )

    # Enable CORS
    CORS(app, resources={r"/search/*": {"origins": "*"}})

    # Load models before the first request
    with app.app_context():
        load_models()

    api = Api(app)
    from resources.search import blp as search_blp

    api.register_blueprint(search_blp)

    return app


if __name__ == "__main__":
    app = create_app()
    # Bind to all interfaces to allow access over network
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
