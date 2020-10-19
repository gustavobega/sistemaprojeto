from . import empresa
from app import conn
from flask import render_template,request,redirect,flash,url_for

@empresa.route("/cadastroEmpresa",methods=["GET", "POST"])
def cadEmpresa():
    select = "SELECT * FROM bancoprojeto2020.empresa"
    cursor = conn.cursor()
    cursor.execute(select)
    results = cursor.fetchall()
    return render_template('cadEmpresa.html', results=results)

@empresa.route("/insertemp",methods=['POST', 'GET'])
def insertemp():
    if request.method == "POST":
       nome = request.form['nome'] 
       email = request.form['email'] 
       cnpj = request.form['cnpj'] 
       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.empresa (Emp_Nome,Emp_Email,Emp_CNPJ) VALUES (%s,%s,%s)",(nome,email,cnpj))
       conn.commit()
       flash("Cadastrado com Sucesso!")
       cursor.close()

       return redirect(url_for('empresa.cadEmpresa'))

@empresa.route("/alteraremp",methods=['POST', 'GET'])
def alteraremp():
    if request.method == "POST":
       id = request.form['id']
       nome = request.form['nome'] 
       email = request.form['email'] 
       cnpj = request.form['cnpj'] 
       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.empresa SET Emp_Nome=%s,Emp_Email=%s,Emp_CNPJ=%s WHERE Emp_Cod=%s",(nome,email,cnpj,id))
       conn.commit()
       flash("Alterado com Sucesso!")
       cursor.close()

       return redirect(url_for('empresa.cadEmpresa'))

@empresa.route("/deletaremp/<string:id>",methods=['POST', 'GET'])
def deletaremp(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.empresa WHERE Emp_Cod=%s",(id))
    conn.commit()
    flash("Deletado com Sucesso!")
    cursor.close()

    return redirect(url_for('empresa.cadEmpresa'))