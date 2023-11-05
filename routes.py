from sanic import Blueprint
from sanic.response import json

routes = Blueprint('routes')

@routes.route("/",)
async def test(request):
    return json({"test": "MVC python route set up "})