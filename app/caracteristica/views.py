from . import caracteristica
from app import conn
from flask import render_template,request,redirect,flash,url_for

@caracteristica.route("/cadPergunta",methods=["GET", "POST"])
def cadPergunta():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.fatorajusteperguntas")
    results = cursor.fetchall()
    lista = []

    #pega o codigo do tipo de contagem do banco e adiciona na lista o tipo de contagem daquele codigo
    for row in results:
        cod = row[2]
        cursor2 = conn.cursor()
        cursor2.execute("SELECT * FROM bancoprojeto2020.tipocontagem WHERE TC_Cod=%s", (cod))
        results2 = cursor2.fetchone()
        tc_descricao = results2[1]

        lista.append(tc_descricao)

    #pega os tipos de contagem para utilizar na hora de alterar 
    select = "SELECT * FROM bancoprojeto2020.tipocontagem"
    cursor3 = conn.cursor()
    cursor3.execute(select)
    results3 = cursor3.fetchall()

    tam = len(lista)

    return render_template('cadPergunta.html', results=results, results3=results3, lista=lista, tam=tam)

@caracteristica.route("/insertpergunta",methods=["GET", "POST"])
def insertpergunta():
    if request.method == "POST":
       caracteristica = request.form['caracteristica'] 
       cod = request.form.get('tc')  
       peso = request.form['peso']

       cursor = conn.cursor()
       cursor.execute("INSERT INTO bancoprojeto2020.fatorajusteperguntas (FAP_Caracteristica,TC_Cod,FAP_Peso) VALUES (%s, %s,%s)",(caracteristica,cod,peso))
       conn.commit()
       flash("Cadastrado com Sucesso!")
       cursor.close()
        
    return redirect(url_for('caracteristica.cadPergunta'))

@caracteristica.route("/alterarpergunta",methods=['POST', 'GET'])
def alterarpergunta():
    if request.method == "POST":
       id = request.form['id']
       caracteristica = request.form['caracteristica'] 
       tccod = request.form.get('tc')
       peso = request.form['peso'] 

       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.fatorajusteperguntas SET FAP_Caracteristica=%s, TC_Cod=%s, FAP_Peso=%s  WHERE FAP_Cod=%s",(caracteristica,tccod,peso, id))
       conn.commit()
       flash("Alterado com Sucesso!")
       cursor.close()

       return redirect(url_for('caracteristica.cadPergunta'))

@caracteristica.route("/deletarpergunta/<string:id>",methods=['POST', 'GET'])
def deletarpergunta(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.fatorajusteperguntas WHERE FAP_Cod=%s",(id))
    conn.commit()
    flash("Deletado com Sucesso!")
    cursor.close()

    return redirect(url_for('caracteristica.cadPergunta'))

