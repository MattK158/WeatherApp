from flask import Flask, render_template, redirect
        
def create_app(test_config=None):

    app = Flask(__name__)


    @app.route("/")
    def index():
        return redirect('/weather')

    import weather
    app.register_blueprint(weather.bp)

    return app
