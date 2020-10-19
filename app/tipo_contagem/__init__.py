from flask import Blueprint

tipoc = Blueprint("tipoc", __name__)

from . import views