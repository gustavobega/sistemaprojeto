from . import linguagem
from app import conn
from flask import render_template,request,redirect,flash,url_for

@linguagem.route("/cadastroLinguagem",methods=['GET'])
def cadastroLinguagem():
    cursor = conn.cursor()
    select = "SELECT * FROM bancoprojeto2020.linguagem"
    cursor.execute(select)
    results = cursor.fetchall()
    cursor.close()

    return render_template('cadLinguagem.html', results=results)

@linguagem.route("/insertling",methods=['POST'])
def insertling():
    if request.method == "POST":
       descricao = request.form['descricao'] 
       peso = request.form['peso'] 

       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.linguagem (Ling_Descricao,Ling_Peso) VALUES (%s,%s)",(descricao,peso))
       conn.commit()
       cursor.close()

       flash("Cadastrado com Sucesso!")

       return redirect(url_for('linguagem.cadLinguagem'))

@linguagem.route("/alterarling",methods=['PUT'])
def alterarling():
    if request.method == "POST":
       id = request.form['id']
       descricao = request.form['descricao'] 
       peso = request.form['peso']

       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.linguagem SET Ling_Descricao=%s, Ling_Peso=%s WHERE Ling_Cod=%s",(descricao,peso,id))
       conn.commit()
       cursor.close()

       flash("Alterado com Sucesso!")
       
       return redirect(url_for('linguagem.cadLinguagem'))

@linguagem.route("/deletarling/<string:id>",methods=['DELETE'])
def deletarproj(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.linguagem WHERE Ling_Cod=%s",(id))
    conn.commit()
    cursor.close()

    flash("Deletado com Sucesso!")
    
    return redirect(url_for('linguagem.cadLinguagem'))