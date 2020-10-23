from flask import Blueprint

cad_empresa = Blueprint("cad_empresa", __name__)

from . import views