from . import projeto
from app import conn
from flask import render_template,request,redirect,flash,url_for

@projeto.route("/cadastroProjeto",methods=["GET", "POST"])
def cadProjeto():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.projeto")
    results = cursor.fetchall()

    lista = []
    lista2 = []

    #pega o codigo do tipo de contagem do banco e adiciona na lista o tipo de contagem daquele codigo
    for row in results:
        cod = row[1]
        codemp = row[2]
        cursor2 = conn.cursor()
        cursor3 = conn.cursor()
        cursor2.execute("SELECT * FROM bancoprojeto2020.tipocontagem WHERE TC_Cod=%s", (cod))
        cursor3.execute("SELECT * FROM bancoprojeto2020.empresa WHERE Emp_Cod=%s", (codemp))
        results2 = cursor2.fetchone()
        results3 = cursor3.fetchone()
        tc_descricao = results2[1]
        emp_nome = results3[1]

        lista.append(tc_descricao)
        lista2.append(emp_nome)

    #pega os tipos de contagem para utilizar na hora de alterar 
    select = "SELECT * FROM bancoprojeto2020.tipocontagem"
    cursor4 = conn.cursor()
    cursor4.execute(select)
    results4 = cursor4.fetchall()

    #pega as empresas para utilizar na hora de alterar 
    select = "SELECT * FROM bancoprojeto2020.empresa"
    cursor5 = conn.cursor()
    cursor5.execute(select)
    results5 = cursor5.fetchall()

    #pega as linguagens para utilizar na hora de alterar 
    select = "SELECT * FROM bancoprojeto2020.linguagem"
    cursor6 = conn.cursor()
    cursor6.execute(select)
    results6 = cursor6.fetchall()

    tam = len(lista)

    return render_template('cadProjeto.html', results=results, results4=results4, results5=results5,results6=results6, lista=lista, lista2=lista2, tam=tam)

@projeto.route("/insertproj",methods=["GET", "POST"])
def insertproj():
    if request.method == "POST":
       nome = request.form['nome'] 
       gerente = request.form['gerente'] 
       empcod = request.form.get('emp')
       descricao = request.form['descricao'] 
       cod = request.form.get('tc')
       tempocontagem = request.form['tempocontagem'] 
       temporeal = request.form['temporeal'] 
       datainicio = request.form['datainicio']
       dataprevista = request.form['dataprevista']
       datatermino = request.form['datatermino']
       fct = request.form['fct']
       lingcod = request.form.get('ling')
       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.projeto (TC_Cod,Emp_Cod,Proj_Nome,Proj_Descricao,Proj_TempoContagem,Proj_TempoReal,Proj_Gerente,Proj_DataInicio,Proj_DataTermino,Proj_DataP,Proj_FCT,Ling_Cod) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",(cod,empcod,nome,descricao,tempocontagem,temporeal,gerente, datainicio, datatermino, dataprevista,fct,lingcod))
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
       empcod = request.form.get('emp')
       descricao = request.form['descricao'] 
       cod = request.form.get('tc')
       tempocontagem = request.form['tempocontagem'] 
       temporeal = request.form['temporeal'] 
       datainicio = request.form['datainicio'] 
       dataprevista = request.form['dataprevista'] 
       datatermino = request.form['datatermino'] 
       fct = request.form['fct']
       lingcod = request.form.get('ling')
       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.projeto SET TC_Cod=%s, Emp_Cod=%s,Proj_Nome=%s,Proj_Descricao=%s,Proj_TempoContagem=%s,Proj_TempoReal=%s,Proj_Gerente=%s,Proj_DataInicio=%s,Proj_DataTermino=%s,Proj_DataP=%s,Proj_FCT=%s, Ling_Cod=%s WHERE Proj_Cod=%s",(cod,empcod,nome,descricao,tempocontagem,temporeal,gerente, datainicio, datatermino, dataprevista,fct,lingcod, id))
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