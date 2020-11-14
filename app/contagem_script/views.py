from . import contagemS
from app import conn
from flask import render_template,request, url_for, redirect
from flask import jsonify, make_response,json
from flask import session
from werkzeug.utils import secure_filename

@contagemS.route("/contagemScript", methods=["GET"])
def contagemScript():
    if session.get("USERNAME", None) is not None: 
        cursor = conn.cursor()
        if session.get('USERNAME') == 'cassia@unoeste.br' or session.get('USERNAME') == 'francisco@unoeste.br':
            cursor.execute("SELECT * FROM bancoprojeto2020.projeto")
        else:
            cursor.execute("SELECT * FROM bancoprojeto2020.projeto WHERE Emp_Cod=%s", (session.get('ID')))
        results = cursor.fetchall()

        cursor.close()
        return render_template('contScript.html', results=results)
    else:
        return redirect(url_for("login.sign_in"))

@contagemS.route("/contagemScript/retornaFuncao/<string:codProj>", methods=["GET"])
def retornaFuncao(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Fun_Cod,Fun_Nome FROM bancoprojeto2020.funcao WHERE Proj_Cod=%s AND Fun_Tipo='S'", (codProj))
    results = cursor.fetchall()
    cursor.close()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        dado=results
    )

@contagemS.route("/contagemScript/geraContagem/<string:codProj>", methods=["POST"])
def geraContagem(codProj):
    fileScript = request.files['fileScript']

    file_contents = fileScript.stream.read().decode("utf-8")
    script = file_contents.split(";")
    lista = []
    listareferencia = []
    listaPrimary = []

    for tabela in script:
        auxiliar = False
        primary = False
        foreign = False

        #pegando o nome da tabela
        contador = len(tabela)
        i = 0
        palavra = ""
        while i < contador and tabela[i] != '(':
            palavra += tabela[i]
            i = i + 1

        tabelinha = palavra.split(' ')
        if (len(tabelinha) > 1):
            if (len(tabelinha) == 5):
                if (tabelinha[1].strip() == "CREATE"):
                    auxiliar = True
            else:
                if (tabelinha[0].strip() == "CREATE"):
                    auxiliar = True 
            
            if auxiliar == True:
                if (len(tabelinha) == 5):
                    lista.append(tabelinha[3])
                else:
                    lista.append(tabelinha[2])

                #pula '('
                i = i + 1

                atributos = []
                listRef = []
                listaPri = []

                while i < contador:
                    palavra = ""
                    while i < contador and tabela[i] != ',':
                        palavra += tabela[i]
                        i = i + 1

                    atributo = palavra.strip()
                    atributo = atributo.upper()
                    
                    procura = atributo.split(" ")
                    #verificar se é primary key ou foreign ou apenas um atributo
                    n = 0
                    while n < len(procura) and procura[n] != 'PRIMARY' and procura[n] != 'FOREIGN':
                        n = n + 1

                    if n < len(procura): #encontrou primary ou foreign
                        tamaux = len(atributo)
                        aux = 0
                        while aux < tamaux and atributo[aux] != '(': 
                            aux = aux + 1

                        primaryAtri = ""
                        aux = aux + 1 #pula o '('

                        #quando tem varios atributos compondo a chave primaria uso uma variavel auxiliar para pegar os demais que viram
                        while aux < len(atributo) and atributo[aux] != ')':
                            primaryAtri += atributo[aux]
                            aux = aux + 1

                        if procura[n] == "PRIMARY":
                            listaPri.append(primaryAtri)
                            primary = True
                            foreign = False
                        else:
                            if listRef == []:
                                listRef.append(lista[len(lista)-1])

                            listRef.append(primaryAtri)
                            
                            foreign = True
                            primary = False

                    else: 
                        #podem ser o restante os atributos tanto da chave primary quanto da foreign aqui eu uso as variaveis auxiliares
                        if procura[0][len(procura[0])-1] == ')':
                            procura[0] = procura[0][:-1] #retira o ')' caso for o ultimo atributo

                        if primary:
                            listaPri.append(procura[0])
                        elif foreign and procura[0] != '':
                            listRef.append(procura[0])
                        elif procura[0] != '' and not procura[0][0].isdigit(): #é apenas um atributo 'caso o atributo for number ex number(8,2) o atributo estara com o valor 2'
                            atributos.append(procura[0])

                    i = i + 1

                lista.append(atributos)       
                listaPrimary.append(listaPri)   
                listareferencia.append(listRef)  

    operacao = True
    adicionaTabela(codProj, lista)
    adicionaAtributo(codProj,lista)
    adicionaPrimaryAndForeign(codProj, lista, listaPrimary, listareferencia)
    
    #Pega codigos das tabelas inseridas
    listaCod = getCodTabela(codProj)

    return jsonify (
        operacao=operacao,
        lista=lista,
        listaCod=listaCod
    )

def adicionaTabela(codProj, lista):
    cursor = conn.cursor()
    sql = "INSERT INTO bancoprojeto2020.tabela (Tab_Nome,Proj_Cod) VALUES "

    tam = len(lista)
    i = 0
    while i < tam:
        sql += "(" + "'" + lista[i] + "'" + "," + codProj + "),"
        i = i + 2

    result = sql.rstrip(',')
    linhasAfetadas = cursor.execute(result)
    conn.commit()
    cursor.close()

    operacao = False
    if linhasAfetadas > 0:
        operacao = True

    return operacao

def getCodTabela(codProj):
    cursor = conn.cursor()
    sql = "SELECT Tab_Cod FROM bancoprojeto2020.tabela WHERE Proj_Cod = " + codProj
    cursor.execute(sql)
    results = cursor.fetchall()
    conn.commit()
    cursor.close()

    return results

def adicionaAtributo(codProj, lista):
    sql = "INSERT INTO bancoprojeto2020.atributo (AT_Descricao,Tab_Cod,Proj_Cod) VALUES "
    sql2 = ""
    tam = len(lista)
    i = 1
    while i < tam:
        j = 0
        tam2 = len(lista[i])
        sql2 = "SELECT Tab_Cod FROM bancoprojeto2020.tabela WHERE Tab_Nome = '" + lista[i-1] + "' AND Proj_Cod = " + codProj
        
        cursor = conn.cursor()
        cursor.execute(sql2)
        res = cursor.fetchone()
        cursor.close()
        Tab_Cod = res[0]

        while j < tam2:
            sql += "(" + "'" + lista[i][j] + "'" + "," + str(Tab_Cod) + "," + str(codProj) + "),"
            j = j + 1

        i = i + 2

    result = sql.rstrip(',')
    cursor = conn.cursor()
    linhasAfetadas = cursor.execute(result)
    conn.commit()
    cursor.close()

    operacao = False
    if linhasAfetadas > 0:
        operacao = True

    return operacao

def adicionaPrimaryAndForeign(codProj, lista, listaPrimary, listareferencia):
    tam = len(listareferencia)
    i = 0
    while i < tam:
        j = 0
        tam2 = len(listareferencia[i])
        if tam2 > 0:
            #pega o codigo da tabela onde está o atributo
            cursor = conn.cursor()
            sql = "SELECT Tab_Cod FROM bancoprojeto2020.tabela WHERE Tab_Nome = '" + listareferencia[i][j] + "' AND Proj_Cod = " + str(codProj)
            cursor.execute(sql)
            res = cursor.fetchone()
            cursor.close()
            tab_cod2 = res[0]

            while j+1 < tam2:
                #adiciona o atributo como foreign key
                cursor = conn.cursor()
                sql = "UPDATE bancoprojeto2020.atributo set AT_Foreign = True WHERE Tab_Cod = " + str(tab_cod2) + " AND AT_Descricao = '" + listareferencia[i][j+1] + "' AND Proj_Cod = " + str(codProj)
                cursor.execute(sql)
                conn.commit()
                cursor.close()

                j = j + 1
                
        i = i + 1

    #gera chave primaria de cada tabela
    i = 0
    results = getCodTabela(codProj)
    tam = len(results)
    while i < tam:
        j = 0
        tam2 = len(listaPrimary[i])
        while j < tam2:
            cursor = conn.cursor()
            sql = "UPDATE bancoprojeto2020.atributo set AT_Primary = True WHERE Tab_Cod = " + str(results[i][0]) + " AND AT_Descricao = '" + listaPrimary[i][j] + "' AND Proj_Cod = " + str(codProj)
            cursor.execute(sql)
            conn.commit()
            cursor.close()

            j = j + 1

        i = i + 1

    operacao = True

    return operacao
    

@contagemS.route("/contagemScript/verificaFuncao/<string:codProj>/<string:codFunc>", methods=["GET"])
def verificaFuncao(codProj,codFunc):
    cursor = conn.cursor()

    sql = "SELECT Cont_TD,Cont_TR,Tab_Cod FROM bancoprojeto2020.contagem WHERE Proj_Cod = " + codProj + " AND Fun_Cod = " + codFunc
    cursor.execute(sql)
    results = cursor.fetchall()

    cursor.close()
    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@contagemS.route("/contagemScript/verificaTabela/<string:codProj>", methods=["GET"])
def verificaTabela(codProj):
    cursor = conn.cursor()
    sql = "SELECT Tab_Cod,Tab_Nome FROM bancoprojeto2020.tabela WHERE Proj_Cod = " + codProj  
    cursor.execute(sql)
    results = cursor.fetchall()
    cursor.close()

    operacao = True
    
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@contagemS.route("/contagemScript/obtemContagem/<string:codProj>/<string:Tab_Cod>", methods=["GET"])
def obtemContagem(codProj,Tab_Cod):
    cursor = conn.cursor()
    sql = "SELECT AT_Descricao,AT_Primary,AT_Foreign,Tab_Cod FROM bancoprojeto2020.atributo WHERE Proj_Cod = " + str(codProj) + " AND Tab_Cod = " + str(Tab_Cod)
    cursor.execute(sql)
    results = cursor.fetchall()  
    cursor.close()

    operacao = True
    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@contagemS.route("/contagemScript/obtemTodasContagem", methods=["POST"])
def obtemTodasContagem():
    req = request.get_json()  

    codProj = req['codProj']
    tableJa = req['tableJa']

    auxTab = "Tab_Cod = " + str(tableJa[0])
    i = 1
    tam = len(tableJa)
    while i < tam:
        auxTab += " or Tab_Cod = " + str(tableJa[i])
        i = i + 1

    cursor = conn.cursor()
    sql = "SELECT AT_Descricao,AT_Primary,AT_Foreign,Tab_Cod FROM bancoprojeto2020.atributo WHERE Proj_Cod = " + str(codProj) + " AND " + auxTab
    cursor.execute(sql)
    results = cursor.fetchall()
    cursor.close()

    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@contagemS.route("/contagemScript/SalvacontagemScript", methods=["POST"])
def SalvacontagemScript():
    req = request.get_json()  

    codProj = req['codProj']
    codFunc = req['codFunc']
    descricao =req['descricao']
    funcaoAnalisada = req['funcaoAnalisada']
    tableJa = req['tableJa']
    tableTR = req['tableTR']

    #ajustar aqui
    tp = 24

    cursor = conn.cursor()
    cursor.execute("DELETE FROM bancoprojeto2020.contagem WHERE Fun_Cod = " + codFunc + " AND Proj_Cod = " + codProj)
    conn.commit()
    cursor.close()

    tam = len(tableJa)
    i = 0

    while i < tam:
        TD = 0
        tam2 = len(funcaoAnalisada)
        j = 0
        while j < tam2:
            if str(funcaoAnalisada[j][3]) == str(tableJa[i]):
                TD = TD + 1
            
            j = j + 1

        tab_cod = tableJa[i]  
        TR = tableTR[i]
        cursor = conn.cursor()
        cursor.execute("INSERT INTO bancoprojeto2020.contagem(Fun_Cod,TP_Cod,Proj_Cod,Cont_Descricao,Cont_TD,Cont_TR,Tab_Cod) VALUES(%s,%s,%s,%s,%s,%s,%s)",(codFunc,tp,codProj,descricao,TD,TR,tab_cod))
        conn.commit()
        cursor.close()
        i = i + 1

    operacao = True

    return jsonify (
        operacao=operacao,
    )

@contagemS.route("/contagemScript/calculaPontos/<string:codProj>", methods=["GET"])
def calculaPontos(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Cont_TD,c.Fun_Cod FROM bancoprojeto2020.contagem AS c INNER JOIN bancoprojeto2020.funcao AS f ON c.Fun_Cod = f.Fun_Cod and c.Proj_Cod = %s and f.Fun_Tipo = 'S'", (codProj))
    results = cursor.fetchall()
    cursor.close()

    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
        results=results
    )

@contagemS.route("/contagemScript/verificaExistenciaContagem/<string:codProj>", methods=["GET"])
def verificaExistenciaContagem(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bancoprojeto2020.contagem as c INNER JOIN bancoprojeto2020.funcao as f ON c.Fun_Cod = f.Fun_Cod AND c.Proj_Cod=%s AND Fun_Tipo='S'", (codProj))
    results = cursor.fetchall()
    cursor.close()

    operacao = True

    if results == ():
        operacao = False

    return jsonify (
        operacao=operacao,
    )

@contagemS.route("/contagemScript/deletarScript/<string:codProj>", methods=["DELETE"])
def deletarScript(codProj):
    cursor = conn.cursor()
    cursor.execute("SELECT Tab_Cod FROM bancoprojeto2020.tabela WHERE Proj_Cod=%s",(codProj))
    results = cursor.fetchall()
    cursor.close()

    for tabelaCod in results:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM bancoprojeto2020.atributo WHERE Tab_Cod = %s", (tabelaCod))
        conn.commit()
        cursor.close()
    
    cursor = conn.cursor()
    linhasAfetadas = cursor.execute("DELETE FROM bancoprojeto2020.tabela WHERE Proj_Cod = %s", (codProj))
    conn.commit()
    cursor.close()

    operacao = True
    if linhasAfetadas == 0:
        operacao = False

    return jsonify (
        operacao=operacao
    )