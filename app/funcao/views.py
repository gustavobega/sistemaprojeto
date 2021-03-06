from . import funcao
from app import conn,app
from flask import render_template,request,redirect,flash,url_for
from flask import jsonify, make_response,json
from flask import session
import os
from werkzeug.utils import secure_filename

@funcao.route("/cadastroFuncao", methods=["GET"])
def cadFuncao():
    if session.get("USERNAME", None) is not None:  
        cursor = conn.cursor()
        if session.get('USERNAME') == 'cassia@unoeste.br' or session.get('USERNAME') == 'francisco@unoeste.br':
            select = "SELECT * FROM bancoprojeto2020.projeto"
        else:
            select = "SELECT * FROM bancoprojeto2020.projeto where emp_cod = " + str(session.get('ID'))  

        cursor.execute(select)
        results3 = cursor.fetchall()
        cursor.close()

        codProj = 0
        if results3 != ():
            codProj = results3[0][0]

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.funcao as f INNER JOIN bancoprojeto2020.projeto as p ON f.proj_cod = p.proj_cod and p.proj_cod=%s", (str(codProj)))
        results = cursor.fetchall()
        cursor.close()

        tam = len(results)
        return render_template('cadFuncao.html', results=results, results3=results3, tam=tam)
    else:
         return redirect(url_for("login.sign_in"))

@funcao.route("/funcao/cadFuncao",methods=["POST"])
def insertfuncao():
    req = request.get_json()
    nome = req['nome'] 
    tipo = req['tipo']
    projcod = req['codProj']

    cursor = conn.cursor()
    cursor.execute("INSERT INTO bancoprojeto2020.funcao (Proj_Cod,Fun_nome,Fun_Tipo) VALUES (%s, %s, %s)",(projcod,nome,tipo))
    conn.commit()
    cursor.close()
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.funcao ORDER BY Fun_Cod DESC LIMIT 1")
    results = cursor.fetchone()
    cursor.close()

    flash("Cadastrado com Sucesso!")

    return jsonify (
        cod=results[0]
    )

@funcao.route("/funcao/cadImagem", methods=["POST"])
def cadImagem():

    req = request.form
    cod = req['cod']
    file = request.files['imagem']
    
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    caminho = filename

    cursor = conn.cursor()
    cursor.execute("UPDATE bancoprojeto2020.funcao SET Fun_Caminho=%s WHERE Fun_Cod=%s", (caminho,cod))
    conn.commit()
    cursor.close()

    return jsonify (
        operacao=True
    )
    
@funcao.route("/deletarfuncao/<string:id>", methods=["GET"])
def deletarfuncao(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.funcao WHERE Fun_Cod=%s",(id))
    conn.commit()
    cursor.close()

    flash("Deletado com Sucesso!")

    return redirect(url_for('funcao.cadFuncao'))

@funcao.route("/funcao/getFuncoes/<string:codProj>",methods=['GET'])
def getFuncoes(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.funcao as f INNER JOIN bancoprojeto2020.projeto as p ON f.proj_cod = p.proj_cod and p.proj_cod=%s",(codProj))
    results = cursor.fetchall()
    cursor.close()
    
    operacao = True
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )