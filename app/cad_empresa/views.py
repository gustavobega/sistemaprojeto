from . import cad_empresa
from app import conn
from flask import render_template,request,redirect,flash,url_for

@cad_empresa.route("/cadempresa",methods=["GET", "POST"])
def cadempresa():
    return render_template('cad_empresa.html')

@cad_empresa.route("/insert",methods=['POST', 'GET'])
def insert():
    if request.method == "POST":
       nome = request.form['nome'] 
       email = request.form['email'] 
       cnpj = request.form['cnpj'] 
       senha = request.form['senha'] 
       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.empresa (Emp_Nome,Emp_Email,Emp_CNPJ,Emp_Senha) VALUES (%s,%s,%s,%s)",(nome,email,cnpj,senha))
       conn.commit()
       flash("Cadastrado com Sucesso!")
       cursor.close()

       return redirect(url_for('cad_empresa.cadempresa'))