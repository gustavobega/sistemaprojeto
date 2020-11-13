from . import contagemT
from app import conn
from flask import render_template,request,redirect,flash,url_for
from flask import jsonify, make_response,json
from flask import session

@contagemT.route("/contagemTela", methods=["GET"])
def contagemBancoTela():
    if session.get("USERNAME", None) is not None: 
        cursor = conn.cursor()
        if session.get('USERNAME') == 'cassia@unoeste.br' or session.get('USERNAME') == 'francisco@unoeste.br':
            cursor.execute("SELECT * FROM bancoprojeto2020.projeto")
        else:
            cursor.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Emp_Cod=%s", (session.get('ID')))
                
        results = cursor.fetchall()

        return render_template('contTela.html', results=results)
    else:
        return redirect(url_for("login.sign_in"))

@contagemT.route("/contagemTela/retornaFuncao/<string:codProj>", methods=["GET"])
def retornaFuncao(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Fun_Cod,Fun_Nome FROM bancoprojeto2020.funcao WHERE Proj_Cod=%s AND Fun_Tipo='T'", (codProj))
    results = cursor.fetchall()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        dado=results
    )

@contagemT.route("/contagemTela/retornaFoto/<string:codF>", methods=["GET"])
def retornaFoto(codF):
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

@contagemT.route("/contagemTela/retornaTipoCont/<string:codProj>", methods=["GET"])
def retornaTipo(codProj):
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

@contagemT.route("/contagemTela/adicionaContagem", methods=["POST"])
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

    return jsonify (
        operacao=True
    )

@contagemT.route("/contagemTela/calculaPontos/<string:codProj>", methods=["GET"])
def calculaPontos(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Contribuicao FROM bancoprojeto2020.contagem AS c INNER JOIN bancoprojeto2020.funcao AS f ON c.Fun_Cod = f.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'T'", (codProj))
    results = cursor.fetchall()
    dadosJson = json.dumps(results)

    return dadosJson

@contagemT.route("/contagemTela/retornaFatorAjuste/<string:codProj>", methods=["GET"])
def retornaFatorAjuste(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT FA_Valor FROM bancoprojeto2020.fatorajuste WHERE Proj_Cod=%s", (codProj))
    results = cursor.fetchall()
    dadosJson = json.dumps(results)

    return dadosJson

@contagemT.route("/contagemTela/alterarContagem/<string:contCod>", methods=["GET"])
def alterarContagem(contCod):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Cod,Cont_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao,TP_Cod FROM bancoprojeto2020.contagem WHERE Cont_Cod=%s", (contCod))
    results = cursor.fetchone()
    dadosJson = json.dumps(results)

    return dadosJson

@contagemT.route("/contagemTela/deletarContagem/<string:contCod>", methods=["DELETE"])
def deletarContagem(contCod):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.contagem WHERE Cont_Cod=%s", (contCod))
    conn.commit()
    cursor.close()

    return jsonify(
        msg = 'Deletado'
    )

@contagemT.route("/contagemTela/retornaContagem/<string:codF>/<string:codProj>", methods=["GET"])
def retornaContagem(codF,codProj):
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