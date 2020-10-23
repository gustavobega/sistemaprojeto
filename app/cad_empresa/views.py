from . import cad_empresa
from app import conn
from flask import render_template,request,redirect,flash,url_for

@cad_empresa.route("/cadempresa",methods=["GET", "POST"])
def cadempresa():
    return render_template('cad_empresa.html')