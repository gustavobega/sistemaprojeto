from . import tipoc
from app import conn
from flask import render_template,request,redirect,flash,url_for

@tipoc.route("/crudTipoContagem",methods=["GET", "POST"])
def crudTipoContagem():
    cursor = conn.cursor()
    select = "SELECT * FROM bancoprojeto2020.tipocontagem"
    cursor.execute(select)
    results = cursor.fetchall()
    cursor.close()

    return render_template('crudTipoContagem.html', results=results)

@tipoc.route("/inserttc",methods=['POST', 'GET'])
def inserttc():
    if request.method == "POST":
        descricao = request.form['descricao'] 

        cursor = conn.cursor()
        cursor.execute("INSERT INTO bancoprojeto2020.tipocontagem (TC_Descricao) VALUES (%s)",(descricao))
        conn.commit()
        cursor.close()

        flash("Cadastrado com Sucesso!")

        return redirect(url_for('tipoc.crudTipoContagem'))

@tipoc.route("/alterartc",methods=['POST', 'GET'])
def alterartc():
    if request.method == "POST":
       id = request.form['id']
       descricao = request.form['descricao'] 

       cursor = conn.cursor()
       cursor.execute("UPDATE bancoprojeto2020.tipocontagem SET TC_Descricao=%s WHERE TC_Cod=%s",(descricao,id))
       conn.commit()
       cursor.close()

       flash("Alterado com Sucesso!")

       return redirect(url_for('tipoc.crudTipoContagem'))

@tipoc.route("/deletartc/<string:id>",methods=['POST', 'GET'])
def deletartc(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.tipocontagem WHERE TC_Cod=%s",(id))
    conn.commit()
    cursor.close()

    flash("Deletado com Sucesso!")

    return redirect(url_for('tipoc.crudTipoContagem'))