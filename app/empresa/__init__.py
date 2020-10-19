from flask import Blueprint

empresa = Blueprint("empresa", __name__)

from . import views