from flask import Blueprint

caracteristica = Blueprint("caracteristica", __name__)

from . import views