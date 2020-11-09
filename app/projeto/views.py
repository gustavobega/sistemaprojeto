from . import projeto
from app import conn
from flask import render_template,request,redirect,flash,url_for
from flask import session

@projeto.route("/cadastroProjeto",methods=["GET", "POST"])
def cadProjeto():
    if session.get("USERNAME", None) is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Emp_Cod=%s", (session.get('ID')))
        results = cursor.fetchall()

        lista = []

        #pega o codigo do tipo de contagem do banco e adiciona na lista o tipo de contagem daquele codigo
        for row in results:
            cod = row[1]
            cursor2 = conn.cursor()
            cursor2.execute("SELECT * FROM bancoprojeto2020.tipocontagem WHERE TC_Cod=%s", (cod))
            results2 = cursor2.fetchone()
            tc_descricao = results2[1]

            lista.append(tc_descricao)

        #pega os tipos de contagem para utilizar na hora de alterar 
        select = "SELECT * FROM bancoprojeto2020.tipocontagem"
        cursor4 = conn.cursor()
        cursor4.execute(select)
        results4 = cursor4.fetchall()

        #pega as linguagens para utilizar na hora de alterar 
        select = "SELECT * FROM bancoprojeto2020.linguagem"
        cursor6 = conn.cursor()
        cursor6.execute(select)
        results6 = cursor6.fetchall()

        tam = len(lista)

        return render_template('cadProjeto.html', results=results, results4=results4,results6=results6, lista=lista, tam=tam)
    else:
        return redirect(url_for("login.sign_in"))

@projeto.route("/insertproj",methods=["GET", "POST"])
def insertproj():
    if request.method == "POST":
       nome = request.form['nome'] 
       gerente = request.form['gerente'] 
       empcod = session.get('ID')
       descricao = request.form['descricao'] 
       cod = request.form.get('tc')
       datainicio = request.form['datainicio']
       dataprevista = request.form['dataprevista']
       lingcod = request.form.get('ling')
       escopo = request.form.get('escopo')
       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.projeto (TC_Cod,Emp_Cod,Proj_Nome,Proj_Descricao,Proj_Gerente,Proj_DataInicio,Proj_DataP,Ling_Cod,Proj_Escopo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",(cod,empcod,nome,descricao,gerente, datainicio, dataprevista,lingcod,escopo))
       conn.commit()
       flash("Cadastrado com Sucesso!")
       cursor.close()
        
    return redirect(url_for('projeto.cadProjeto'))

@projeto.route("/alterarproj",methods=['POST', 'GET'])
def alterarproj():
    if request.method == "POST":
       id = request.form['id']
       nome = request.form['nome'] 
       gerente = request.form['gerente'] 
       descricao = request.form['descricao'] 
       cod = request.form.get('tc')
       tempocontagem = request.form['tempocontagem'] 
       temporeal = request.form['temporeal'] 
       datainicio = request.form['datainicio'] 
       dataprevista = request.form['dataprevista'] 
       fct = request.form['fct']
       lingcod = request.form.get('ling')
       escopo = request.form.get('escopo')
       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.projeto SET TC_Cod=%s,Proj_Nome=%s,Proj_Descricao=%s,Proj_TempoContagem=%s,Proj_TempoReal=%s,Proj_Gerente=%s,Proj_DataInicio=%s,Proj_DataP=%s,Proj_FCT=%s, Ling_Cod=%s, Proj_Escopo=%s WHERE Proj_Cod=%s",(cod,nome,descricao,tempocontagem,temporeal,gerente, datainicio, dataprevista,fct,lingcod,escopo, id))
       conn.commit()
       flash("Alterado com Sucesso!")
       cursor.close()

       return redirect(url_for('projeto.cadProjeto'))

@projeto.route("/deletarproj/<string:id>",methods=['POST', 'GET'])
def deletarproj(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.projeto WHERE Proj_Cod=%s",(id))
    conn.commit()
    flash("Deletado com Sucesso!")
    cursor.close()

    return redirect(url_for('projeto.cadProjeto'))