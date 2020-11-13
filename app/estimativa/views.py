from . import estimativa
from app import conn
from flask import render_template, redirect, url_for,request
from flask import jsonify, make_response,json
from flask import session

@estimativa.route("/estimativa")
def estimar():
    if session.get("USERNAME", None) is not None:  
        cursor = conn.cursor()
        if session.get('USERNAME') == 'cassia@unoeste.br' or session.get('USERNAME') == 'francisco@unoeste.br':
            cursor.execute("SELECT * FROM bancoprojeto2020.projeto")  
        else:
            cursor.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Emp_Cod=%s", (session.get('ID')))

        results = cursor.fetchall()
        
        return render_template("estimativa.html", results=results)
    else:
        return redirect(url_for("login.sign_in"))

@estimativa.route("/estimativa/obtemContagemTipoDado/<string:codProj>", methods=["GET"])
def obtemContagemTipoDado(codProj):
    cursor = conn.cursor()
    cursor2 = conn.cursor()
    
    cursor.execute("SELECT Cont_Descricao,TP_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao,c.Fun_Cod FROM bancoprojeto2020.contagem AS c INNER JOIN bancoprojeto2020.funcao AS f ON c.Fun_Cod = f.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'M' INNER JOIN bancoprojeto2020.tipo AS t ON c.TP_Cod = t.TP_Cod", (codProj))
    results = cursor.fetchall()
    operacaoModelo = True
    operacaoScript = False
    if results == ():
        operacaoModelo = False
        cursor2.execute("SELECT Cont_Descricao,TP_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao,c.Fun_Cod FROM bancoprojeto2020.contagem AS c INNER JOIN bancoprojeto2020.funcao AS f ON c.Fun_Cod = f.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'S' INNER JOIN bancoprojeto2020.tipo AS t ON c.TP_Cod = t.TP_Cod", (codProj))
        results = cursor2.fetchall()

        if results != ():
            operacaoScript = True

    cursor.close()
    cursor2.close()
    return jsonify (
        operacaoModelo=operacaoModelo,
        operacaoScript=operacaoScript,
        dados=results
    )

@estimativa.route("/estimativa/obtemContagemTipoTransacao/<string:codProj>", methods=["GET"])
def obtemContagemTipoTransacao(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Descricao,TP_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao,f.Fun_Nome FROM bancoprojeto2020.contagem AS c INNER JOIN bancoprojeto2020.funcao AS f ON c.Fun_Cod = f.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'T' INNER JOIN bancoprojeto2020.tipo AS t ON c.TP_Cod = t.TP_Cod", (codProj))
    results = cursor.fetchall()
    operacao = True
    
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        dados=results
    )

@estimativa.route("/estimativa/retornaPontos/<string:codProj>", methods=["GET"])
def retornaPontos(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_Contribuicao FROM bancoprojeto2020.contagem WHERE Proj_Cod=%s", (codProj))
    results = cursor.fetchall()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@estimativa.route("/estimativa/retornaLinguagem/<string:codProj>", methods=["GET"])
def retornaLinguagem(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Ling_Peso FROM bancoprojeto2020.linguagem as l INNER JOIN bancoprojeto2020.projeto as p ON l.Ling_Cod = p.Ling_Cod AND p.Proj_Cod=%s", (codProj))
    results = cursor.fetchall()
    operacao = True
    
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@estimativa.route("/estimativa/salvaEstimativa", methods=["POST"])
def salvaEstimativa():
    req = request.get_json()
    codProj = req['codProj']
    modelo = req['modelo']
    modo = req['modo']

    loc = req['loc']
    kloc = req['kloc']
    esforco = req['esforco']
    prazo = req['prazo']
    produtividade = req['produtividade']
    tam = req['tam']

    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.estimativa WHERE Proj_Cod = %s", (codProj))
    conn.commit()
    cursor.close()

    cursor = conn.cursor()
    cursor.execute("INSERT INTO bancoprojeto2020.estimativa(Est_Modelo,Est_Modo,Est_Loc,Est_Kloc,Est_Esforco,Est_Prazo,Est_Produtividade,Est_TamEquipe,Proj_Cod) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)", (modelo,modo,loc,kloc,esforco,prazo,produtividade,tam,codProj))
    conn.commit()
    cursor.close()

    operacao = True

    return jsonify (
        operacao=operacao
    )