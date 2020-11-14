from . import empresa
from app import conn
from flask import render_template,request,redirect,flash,url_for
from flask import session

@empresa.route("/empresa",methods=["GET"])
def exibirempresa():
    if session.get("USERNAME", None) is not None: 
        if session.get('USERNAME') == 'cassia@unoeste.br' or session.get('USERNAME') == 'francisco@unoeste.br':
            cursor = conn.cursor()
            select = "SELECT * FROM bancoprojeto2020.empresa"
            cursor.execute(select)
            results = cursor.fetchall()
            cursor.close()
            return render_template('empresa.html', results=results)
        else:
            return render_template('cad_empresa.html')
    else:
        return render_template('cad_empresa.html')

@empresa.route("/insertemp", methods=['POST'])
def insertemp():
    if request.method == "POST":
       nome = request.form['nome'] 
       email = request.form['email'] 
       cnpj = request.form['cnpj'] 
       senha = request.form['senha'] 

       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.empresa (Emp_Nome,Emp_Email,Emp_CNPJ,Emp_Senha) VALUES (%s,%s,%s,%s)",(nome,email,cnpj,senha))
       conn.commit()
       cursor.close()

       flash("Cadastrado com Sucesso!")

       return redirect(url_for('empresa.exibirempresa'))

@empresa.route("/alteraremp",methods=['PUT'])
def alteraremp():
    if request.method == "POST":
       id = request.form['id']
       nome = request.form['nome'] 
       email = request.form['email'] 
       cnpj = request.form['cnpj'] 

       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.empresa SET Emp_Nome=%s,Emp_Email=%s,Emp_CNPJ=%s WHERE Emp_Cod=%s",(nome,email,cnpj,id))
       conn.commit()
       cursor.close()

       flash("Alterado com Sucesso!")
       
       return redirect(url_for('empresa.exibirempresa'))

@empresa.route("/deletaremp/<string:id>",methods=['GET'])
def deletaremp(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.empresa WHERE Emp_Cod=%s",(id))
    conn.commit()
    cursor.close()

    flash("Deletado com Sucesso!")

    return redirect(url_for('empresa.exibirempresa'))