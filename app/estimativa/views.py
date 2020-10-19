from . import estimativa
from app import conn
from flask import render_template
from flask import jsonify, make_response,json

@estimativa.route("/estimativa")
def estimar():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.projeto")
    results = cursor.fetchall()
    
    return render_template("estimativa.html", results=results)

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