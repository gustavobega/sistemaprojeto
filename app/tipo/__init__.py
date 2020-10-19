from flask import Blueprint

tipo = Blueprint("tipo", __name__)

from . import views