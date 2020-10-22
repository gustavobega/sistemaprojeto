from . import fatorA
from app import conn
from flask import render_template,request,redirect,flash,url_for
from flask import jsonify, make_response,json
from flask import session

@fatorA.route("/fatorAjuste", methods=["GET", "POST"])
def calcFatorAjuste():
    if session.get("USERNAME", None) is not None:   
        select = "SELECT * FROM bancoprojeto2020.projeto"
        cursor = conn.cursor()
        cursor.execute(select)
        results = cursor.fetchall()

        select2 = "SELECT * FROM bancoprojeto2020.fatorajusteperguntas"
        cursor2 = conn.cursor()
        cursor2.execute(select2)
        results2 = cursor2.fetchall()

        return render_template('cadFatorAjuste.html', results=results, results2=results2)
    else:
        return redirect(url_for("login.sign_in"))

@fatorA.route("/fatorAjuste/retornaPerguntas/<string:codProj>", methods=["GET"])
def retornaPerguntas(codProj):

    select = "SELECT * FROM bancoprojeto2020.projeto WHERE Proj_Cod = " + codProj
    cursor = conn.cursor()
    cursor.execute(select)
    results = cursor.fetchone()

    select2 = "SELECT * FROM bancoprojeto2020.fatorajuste WHERE Proj_Cod = " + codProj
    cursor2 = conn.cursor()
    cursor2.execute(select2)
    results2 = cursor2.fetchall()

    tc = results[1]
    cursor3 = conn.cursor()
    cursor3.execute("SELECT * FROM bancoprojeto2020.fatorajusteperguntas WHERE TC_Cod=%s",(tc))
    results3 = cursor3.fetchall()
    if results2 == ():
        dadosJson = json.dumps(results3)
    else: 
        j = 0
        lista = []
        lista2 = []
        #adiciona o # pois para no html ele exibir correto de acordo com as tabela que retorna do banco fatorajusteperguntas
        for i in results2:
            lista.append(i[2])
            lista.append(results3[j][1])
            lista.append('#')
            lista.append(i[0])
            lista2.append(lista)
            lista = []
            j = j + 1
   
        dadosJson = json.dumps(lista2)

    return dadosJson

@fatorA.route("/fatorAjuste/cadFatorAjuste", methods=["POST"])
def cadFatorAjuste():
    req = request.get_json()

    select = "SELECT * FROM bancoprojeto2020.projeto WHERE Proj_Cod = " + req['codProj']
    cursor = conn.cursor()
    cursor.execute(select)
    results = cursor.fetchone()
    tc = results[1]

    #verifica se é insert ou update
    cursor3 = conn.cursor()
    cursor3.execute('SELECT * FROM bancoprojeto2020.fatorajuste WHERE Proj_Cod=%s',(req['codProj']))
    results3 = cursor3.fetchall()

    cursor2 = conn.cursor()
    tam = len(req['listFAP_Cod'])
    if results3 == ():
        for i in range(tam):
            codproj = req['codProj']
            valor = req['listValor'][i]
            fapcod = req['listFAP_Cod'][i]
            cursor2.execute("INSERT INTO bancoprojeto2020.fatorajuste (FA_Valor, Proj_Cod, FAP_Cod, TC_Cod) VALUES (%s,%s,%s,%s)",(valor,codproj,fapcod,tc))
            conn.commit()
    else:
        for i in range(tam):
            codproj = req['codProj']
            valor = req['listValor'][i]
            fapcod = req['listFAP_Cod'][i]
            cursor2.execute("UPDATE bancoprojeto2020.fatorajuste SET FA_Valor=%s, Proj_Cod=%s, FAP_Cod=%s, TC_Cod=%s WHERE Proj_Cod=%s AND FAP_Cod=%s",(valor,codproj,fapcod,tc,codproj,fapcod))
            conn.commit()

    cursor.close()
    res = make_response(jsonify(req),200)

    return res