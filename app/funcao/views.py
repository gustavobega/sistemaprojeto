from . import funcao
from app import conn,app
from flask import render_template,request,redirect,flash,url_for
from flask import jsonify, make_response,json
from flask import session
import os
from werkzeug.utils import secure_filename

@funcao.route("/cadastroFuncao", methods=["GET", "POST"])
def cadFuncao():
    if session.get("USERNAME", None) is not None:  
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.funcao")
        results = cursor.fetchall()
        lista = []

        #pega o codigo do projeto do banco e adiciona na lista o projeto daquele codigo
        for row in results:
            cod = row[1]
            cursor2 = conn.cursor()
            cursor2.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Proj_Cod=%s", (cod))
            results2 = cursor2.fetchone()
            tc_nome = results2[3]

            lista.append(tc_nome)
    

        #pega os projetos para utilizar na hora de alterar 
        select = "SELECT * FROM bancoprojeto2020.projeto"
        cursor3 = conn.cursor()
        cursor3.execute(select)
        results3 = cursor3.fetchall()

        tam = len(lista)
        return render_template('cadFuncao.html', results=results, results3=results3, lista=lista, tam=tam)
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
    
    cursor2 = conn.cursor()
    cursor2.execute("SELECT * FROM bancoprojeto2020.funcao ORDER BY Fun_Cod DESC LIMIT 1")
    results = cursor2.fetchone()
    flash("Cadastrado com Sucesso!")
    return jsonify (
        cod=results[0]
    )

@funcao.route("/funcao/cadArquivo",methods=["POST"])
def cadarquivo():

    req = request.form
    cod = req['cod']
    file = request.files['arquivo']
    
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
    file.close()
    caminho = filename

    cursor = conn.cursor()
    cursor.execute("UPDATE bancoprojeto2020.funcao SET Fun_Caminho=%s WHERE Fun_Cod=%s", (caminho,cod))
    conn.commit()
    cursor.close()
    res = make_response(jsonify(req),200)

    return res
    

@funcao.route("/alterarfuncao",methods=['POST', 'GET'])
def alterarfuncao():
    if request.method == "POST":
       id = request.form['id']
       nome = request.form['nome'] 
       tipo = request.form['options']
       caminho = request.form['caminho'] 
       projcod = request.form.get('proj')
       soma = request.form['soma'] 
       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.funcao SET Proj_Cod=%s, Fun_nome=%s, Fun_SomaContagemReal=%s, Fun_Caminho=%s, Fun_Tipo=%s  WHERE Fun_Cod=%s",(projcod,nome,soma,caminho,tipo, id))
       conn.commit()
       flash("Alterado com Sucesso!")
       cursor.close()

       return redirect(url_for('funcao.cadFuncao'))

@funcao.route("/deletarfuncao/<string:id>",methods=['POST', 'GET'])
def deletarfuncao(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.funcao WHERE Fun_Cod=%s",(id))
    conn.commit()
    flash("Deletado com Sucesso!")
    cursor.close()

    return redirect(url_for('funcao.cadFuncao'))
