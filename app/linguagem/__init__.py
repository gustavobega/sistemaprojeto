from flask import Blueprint

linguagem = Blueprint("linguagem", __name__)

from . import views