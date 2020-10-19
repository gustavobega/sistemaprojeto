from flask import Blueprint

estimativa = Blueprint("estimativa", __name__)

from . import views