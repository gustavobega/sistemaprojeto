from . import login
from flask import render_template, request, session, redirect, url_for, jsonify, flash
from app import conn

@login.route("/sign-in", methods=['GET'])
def sign_in():
    if request.method == 'POST':
        req = request.form

        email = req.get('email')
        senha = req.get('senha')

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.empresa WHERE Emp_Email=%s AND Emp_Senha=%s", (email,senha))
        user = cursor.fetchone()
 
        if user == None:
            flash("Sessão Inválida!")
        else:
            id = user[0]
            session["USERNAME"] = email
            session["ID"] = id
            return redirect(url_for("default"))

    return render_template('login.html')

@login.route("/sign-out", methods=['GET'])
def sign_out():
    session.pop("USERNAME" , None)
    return redirect(url_for("login.sign_in"))

@login.route("/login/verificausuariologado", methods=['GET'])
def verificausuariologado():
    operacao = True
    usuario = ""
    if session.get("USERNAME", None) is None: 
        operacao = False
    else:
        usuario = session.get('USERNAME')

    return jsonify (
        operacao=operacao,
        usuario=usuario
    )



    
