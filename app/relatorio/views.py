from . import relatorio
from app import conn
from flask import render_template,request,redirect,flash,url_for
from flask import jsonify
from flask import session

@relatorio.route("/relatorio",methods=['GET'])
def report():
    if session.get("USERNAME", None) is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.empresa WHERE Emp_Cod=%s", (session.get('ID')))
        empresa = cursor.fetchall()[0][1]
        cursor.close()

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Emp_Cod=%s", (session.get('ID')))
        projects = cursor.fetchall()
        cursor.close()

        return render_template('relatorio.html', empresa=empresa, projects=projects)
    else:
        return redirect(url_for("login.sign_in"))

@relatorio.route("/relatorio/getContagemDado/<string:codProj>", methods=["GET"])
def getContagemDado(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT f.Fun_Cod,Fun_Nome,Cont_Descricao,Fun_Caminho,TP_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao FROM bancoprojeto2020.funcao as f INNER JOIN bancoprojeto2020.contagem as c ON f.Fun_Cod = c.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'M' INNER JOIN bancoprojeto2020.tipo as p ON p.TP_Cod = c.TP_Cod", (codProj))
    results = cursor.fetchall()

    operacaoScript = False
    operacao = True
    if results == ():
        cursor.execute("SELECT f.Fun_Cod,Fun_Nome,Cont_Descricao,Fun_Caminho,TP_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao FROM bancoprojeto2020.funcao as f INNER JOIN bancoprojeto2020.contagem as c ON f.Fun_Cod = c.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'S' INNER JOIN bancoprojeto2020.tipo as p ON p.TP_Cod = c.TP_Cod", (codProj))
        results = cursor.fetchall()
        operacaoScript = True
        
    if results == ():
        operacao = False

    cursor.close()
    return jsonify (
        operacaoScript=operacaoScript,
        operacao=operacao,
        results=results
    )

@relatorio.route("/relatorio/getContagemTransacao/<string:codProj>",methods=["GET"])
def getContagemTransacao(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT f.Fun_Cod,Fun_Nome,Cont_Descricao,Fun_Caminho,TP_Descricao,Cont_TD,Cont_TR,Cont_Complexidade,Cont_Contribuicao FROM bancoprojeto2020.funcao as f INNER JOIN bancoprojeto2020.contagem as c ON f.Fun_Cod = c.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'T' INNER JOIN bancoprojeto2020.tipo as p ON p.TP_Cod = c.TP_Cod", (codProj))
    results = cursor.fetchall()
    cursor.close()

    operacao = True
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@relatorio.route("/relatorio/geraFatorAjuste/<string:codProj>",methods=["GET"])
def geraFatorAjuste(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT FAP_Caracteristica,FA_Valor FROM bancoprojeto2020.fatorajusteperguntas fp INNER JOIN bancoprojeto2020.fatorajuste as fa ON fa.FAP_Cod = fp.FAP_Cod and Proj_Cod = %s INNER JOIN bancoprojeto2020.tipocontagem as c ON c.TC_Cod = fp.TC_Cod", (codProj))
    results = cursor.fetchall()
    cursor.close()

    operacao = True
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@relatorio.route("/relatorio/getContagem/<string:codProj>",methods=["GET"])
def getContagem(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.estimativa WHERE Proj_Cod = %s", (codProj))
    results = cursor.fetchone()
    cursor.close()

    operacao = True
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@relatorio.route("/relatorio/getEscopo/<string:codProj>",methods=["GET",])
def getEscopo(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Emp_Cod=%s and Proj_Cod=%s", (session.get('ID'),codProj))
    escopo = cursor.fetchone()[13]
    cursor.close()

    return jsonify (
        escopo=escopo
    )