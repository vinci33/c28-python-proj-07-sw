from sanic import Sanic
from sanic.response import json
from routes import routes

app = Sanic("BAD_project_team7_2023_11_05")



app.blueprint(routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, workers=1)
