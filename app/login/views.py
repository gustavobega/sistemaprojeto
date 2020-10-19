from . import login
from flask import render_template

@login.route("/Login")
def Logar():
    return render_template('login.html')
