from . import linguagem
from app import conn
from flask import render_template,request,redirect,flash,url_for

@linguagem.route("/cadastroLinguagem",methods=["GET", "POST"])
def cadLinguagem():
    select = "SELECT * FROM bancoprojeto2020.linguagem"
    cursor = conn.cursor()
    cursor.execute(select)
    results = cursor.fetchall()
    return render_template('cadLinguagem.html', results=results)

@linguagem.route("/insertling",methods=["GET", "POST"])
def insertling():
    if request.method == "POST":
       descricao = request.form['descricao'] 
       peso = request.form['peso'] 
       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.linguagem (Ling_Descricao,Ling_Peso) VALUES (%s,%s)",(descricao,peso))
       conn.commit()
       flash("Cadastrado com Sucesso!")
       cursor.close()

       return redirect(url_for('linguagem.cadLinguagem'))

@linguagem.route("/alterarling",methods=['POST', 'GET'])
def alterarling():
    if request.method == "POST":
       id = request.form['id']
       descricao = request.form['descricao'] 
       peso = request.form['peso']
       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.linguagem SET Ling_Descricao=%s, Ling_Peso=%s WHERE Ling_Cod=%s",(descricao,peso,id))
       conn.commit()
       flash("Alterado com Sucesso!")
       cursor.close()

       return redirect(url_for('linguagem.cadLinguagem'))

@linguagem.route("/deletarling/<string:id>",methods=['POST', 'GET'])
def deletarproj(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.linguagem WHERE Ling_Cod=%s",(id))
    conn.commit()
    flash("Deletado com Sucesso!")
    cursor.close()

    return redirect(url_for('linguagem.cadLinguagem'))