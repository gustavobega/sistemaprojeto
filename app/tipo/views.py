from . import tipo
from app import conn
from flask import render_template,request,redirect,flash,url_for

@tipo.route("/crudTipo",methods=["GET", "POST"])
def crudTipo():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.tipo")
    results = cursor.fetchall()
    cursor.close()

    lista = []
    #pega o codigo do tipo de contagem do banco e adiciona na lista o tipo de contagem daquele codigo
    for row in results:
        cod = row[2]
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.tipocontagem WHERE TC_Cod=%s", (cod))
        results2 = cursor.fetchone()
        tc_descricao = results2[1]
        cursor.close()

        lista.append(tc_descricao)

    #pega os tipos de contagem para utilizar na hora de alterar 
    cursor = conn.cursor()
    select = "SELECT * FROM bancoprojeto2020.tipocontagem"
    cursor.execute(select)
    results3 = cursor.fetchall()
    cursor.close()

    tam = len(lista)

    return render_template('crudTipo.html', results=results, results3=results3, lista=lista, tam=tam)

@tipo.route("/inserttp",methods=["GET", "POST"])
def inserttp():
    if request.method == "POST":
       descricao = request.form['descricao'] 
       cod = request.form.get('tc')
       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.tipo (TP_Descricao,TC_Cod) VALUES (%s, %s)",(descricao,cod))
       conn.commit()
       cursor.close()

       flash("Cadastrado com Sucesso!")
        
    return redirect(url_for('tipo.crudTipo'))

@tipo.route("/alterartp",methods=['POST', 'GET'])
def alterartp():
    if request.method == "POST":
       id = request.form['id']
       descricao = request.form['descricao'] 
       tccod = request.form.get('tc')

       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.tipo SET TP_Descricao=%s, TC_Cod=%s WHERE TP_Cod=%s",(descricao,tccod, id))
       conn.commit()
       cursor.close()

       flash("Alterado com Sucesso!")

       return redirect(url_for('tipo.crudTipo'))

@tipo.route("/deletartp/<string:id>",methods=['POST', 'GET'])
def deletartp(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.tipo WHERE TP_Cod=%s",(id))
    conn.commit()
    cursor.close()

    flash("Deletado com Sucesso!")

    return redirect(url_for('tipo.crudTipo'))