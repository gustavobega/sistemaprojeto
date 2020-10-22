from . import contagemM
from app import conn
from flask import render_template,request,redirect,flash,url_for
from flask import jsonify, make_response,json
from flask import session

@contagemM.route("/contagemModelo", methods=["GET", "POST"])
def contagemBancoModelo():
    if session.get("USERNAME", None) is not None: 
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.projeto")
        results = cursor.fetchall()

        return render_template('contBancoModelo.html', results=results)
    else:
        return redirect(url_for("login.sign_in"))

@contagemM.route("/contagemModelo/retornaFuncao/<string:codProj>", methods=["GET"])
def retornaFuncao(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Fun_Cod,Fun_Nome FROM bancoprojeto2020.funcao WHERE Proj_Cod=%s AND Fun_Tipo='M'", (codProj))
    results = cursor.fetchall()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        dado=results
    )

@contagemM.route("/contagemModelo/verificaContagem/<string:codProj>/<string:codFunc>", methods=["GET"])
def verificaContagem(codProj,codFunc):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Cod FROM bancoprojeto2020.contagem WHERE Proj_Cod=%s AND Fun_Cod=%s", (codProj,codFunc))
    results = cursor.fetchall()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        dado=results
    )

@contagemM.route("/contagemModelo/retornaFoto/<string:codF>", methods=["GET"])
def retornaFoto2(codF):
    cursor = conn.cursor()
    cursor.execute("SELECT Fun_Caminho FROM bancoprojeto2020.funcao WHERE Fun_Cod=%s", (codF))
    results = cursor.fetchall()
    
    operacao = True
    if results == ():
        operacao = False

    return jsonify(
        operacao=operacao,
        dado=results
    )

@contagemM.route("/contagemModelo/retornaTipoCont/<string:codProj>", methods=["GET"])
def retornaTipo2(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT TC_Cod FROM bancoprojeto2020.projeto WHERE Proj_Cod=%s", (codProj))
    results = cursor.fetchall()
    tc = results[0]

    cursor2 = conn.cursor()
    cursor2.execute("SELECT TP_Cod,TP_Descricao FROM bancoprojeto2020.tipo WHERE TC_Cod=%s", (tc))
    results2 = cursor2.fetchall()

    return jsonify (
        dado=results2
    )

@contagemM.route("/contagemModelo/adicionaContagem", methods=["POST"])
def adicionaContagem():
    req = request.get_json()
    contCod = req['contCod']
    fCod = req['fCod']
    pCod = req['pCod']
    tpCod = req['tpCod']
    desc = req['desc']
    td = req['td']
    tr = req['tr']
    complexidade = req['complexidade']
    pf = req['pf']

    if contCod == '0':
        cursor = conn.cursor()
        cursor.execute("INSERT INTO bancoprojeto2020.contagem (Fun_Cod,TP_Cod,Proj_Cod,Cont_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",(fCod,tpCod,pCod,desc,td,tr,complexidade,pf))
        conn.commit()
        cursor.close()
    else:
        cursor2 = conn.cursor()
        cursor2.execute("UPDATE bancoprojeto2020.contagem SET TP_Cod=%s,Cont_Descricao=%s, Cont_TD=%s, Cont_TR=%s, Cont_Complexidade=%s, Cont_Contribuicao=%s WHERE Cont_Cod=%s",(tpCod,desc,td,tr,complexidade,pf,contCod))
        conn.commit()
        cursor2.close

    cursor3 = conn.cursor()
    cursor3.execute("SELECT MAX(Cont_Cod) FROM bancoprojeto2020.contagem WHERE Proj_Cod=%s", (pCod))
    cod = cursor3.fetchall()[0]
    
    return jsonify (
        cod=cod
    )

@contagemM.route("/contagemModelo/calculaPontos/<string:codProj>", methods=["GET"])
def calculaPontos2(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Contribuicao FROM bancoprojeto2020.contagem AS c INNER JOIN bancoprojeto2020.funcao AS f ON c.Fun_Cod = f.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'M'", (codProj))
    results = cursor.fetchall()
    dadosJson = json.dumps(results)

    return dadosJson

@contagemM.route("/contagemModelo/retornaFatorAjuste/<string:codProj>", methods=["GET"])
def retornaFatorAjuste2(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT FA_Valor FROM bancoprojeto2020.fatorajuste WHERE Proj_Cod=%s", (codProj))
    results = cursor.fetchall()
    dadosJson = json.dumps(results)

    return dadosJson

@contagemM.route("/contagemModelo/alterarContagem/<string:contCod>", methods=["GET"])
def alterarContagem2(contCod):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Cod,Cont_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao,TP_Cod FROM bancoprojeto2020.contagem WHERE Cont_Cod=%s", (contCod))
    results = cursor.fetchone()
    dadosJson = json.dumps(results)

    return dadosJson

@contagemM.route("/contagemModelo/deletarContagem/<string:contCod>", methods=["GET"])
def deletarContagem2(contCod):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.contagem WHERE Cont_Cod=%s", (contCod))
    conn.commit()
    cursor.close()

    return jsonify(
        msg = 'Deletado'
    )

@contagemM.route("/contagemModelo/retornaContagem/<string:codF>/<string:codProj>", methods=["GET"])
def retornaContagem2(codF,codProj):
    #ta errado aqui
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.contagem WHERE Fun_Cod=%s AND Proj_Cod=%s", (codF,codProj))
    results = cursor.fetchall()
    lista = []
    cursor2 = conn.cursor()
    for row in results:
        cod = row[2]
        cursor2.execute("SELECT TP_Descricao FROM bancoprojeto2020.tipo WHERE TP_Cod=%s", (cod))
        results2 = cursor2.fetchone()
        tipo = results2[0]

        lista.append(tipo)

    return jsonify(
        dados=results,
        lista=lista
    )

@contagemM.route("/contagemModelo/verificaExistenciaContagem/<string:codProj>", methods=["GET"])
def verificaExistenciaContagem(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.contagem as c INNER JOIN bancoprojeto2020.funcao as f ON c.Fun_Cod = f.Fun_Cod AND c.Proj_Cod=%s AND Fun_Tipo='M'", (codProj))
    results = cursor.fetchall()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
    )