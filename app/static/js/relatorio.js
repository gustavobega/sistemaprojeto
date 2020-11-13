var pontosNajustado = 0
var total = 0

function getEscopo() {
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/relatorio/getEscopo/` + codProj,{
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
    })
    .then(function (dadosJson) {
        var obj = dadosJson.json()
        return obj
    })
    .then(function (dadosObj) {
        var escopo = document.getElementById('escopo')
        escopo.innerHTML = dadosObj.escopo
        gerarelatorioDado();
    })   
}

function retornaComplexibilidade(td, registro){
    listaAux = []
    if ((registro == 1 && td < 20) ||( registro == 1 && td >= 20 && td <= 50) || (registro >= 2 && registro <= 5 && td < 20)){//baixa
      listaAux.push('Baixa')
      listaAux.push(7)
    } 
    else if ((registro == 1 && td > 50) || (registro >= 2 && registro <= 5 && td >= 20 && td <= 50) || (registro > 5 && td < 20)){//media
      listaAux.push('Média')
      listaAux.push(10)
    }
    else if((registro >= 2 && registro <= 5 && td > 50) || (registro > 5 && td >= 20 && td <= 50) || (registro > 5 && td > 50)){//alta
      listaAux.push('Alta')
      listaAux.push(15)
    }  
    
    return listaAux
}

function gerarelatorioDado()
{
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/relatorio/getContagemDado/` + codProj,{
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
    })
    .then(function (dadosJson) {
        var obj = dadosJson.json()
        return obj
    })
    .then(function (dadosObj) {
        var itens = document.getElementById('dados')
        if (dadosObj.operacao)
        {
            var funCod = dadosObj.results[0][0]
            var conteudo = `
                        <h3>Modelo - ${dadosObj.results[0][1]}</h3>
                        
                        <div class="menu1">
                            <img src="../static/uploads/${dadosObj.results[0][3]}"/>
                        </div>
                        <div class="menu2">
                        <table class="table table-striped" id="tbContagem">
                            <thead>
                            <tr>
                                <td><b>Descrição</b></td>
                                <td><b>Tipo</b></td>
                                <td><b>TD</b></td>
                                <td><b>TR</b></td>
                                <td><b>Complex.</b></td>
                                <td><b>Contribuição</b></td>
                            </tr>
                            </thead>
                            <tbody id="tbodyContagem">
            `
            var i = 0
            while (i < dadosObj.results.length)
            {   
                j = i
                while (j < dadosObj.results.length && dadosObj.results[j][0] == funCod)
                {
                    if (dadosObj.operacaoScript)
                    {
                        var TD = 0,TR = 0
                        var descricao = dadosObj.results[j][2]
                        var tipo = dadosObj.results[j][4]
                        var contribuicao = 0
                        var listaAux = []
                        while (j < dadosObj.results.length && dadosObj.results[j][0] == funCod)
                        {
                          TD += dadosObj.results[j][5]
                          TR += dadosObj.results[j][6]
                          j++
                        }
                        listaAux = retornaComplexibilidade(TD,TR)
                        contribuicao += listaAux[1]

                        conteudo += `
                        <tr>
                            <td>${descricao}</td>
                            <td>${tipo}</td>
                            <td>${TD}</td>
                            <td>${TR}</td>
                            <td>${listaAux[0]}</td>
                            <td>${contribuicao}</td>
                        </tr>
                        ` 
                        pontosNajustado += contribuicao
                    }
                    else
                    {
                        conteudo += `
                        <tr>
                            <td>${dadosObj.results[j][2]}</td>
                            <td>${dadosObj.results[j][4]}</td>
                            <td>${dadosObj.results[j][5]}</td>
                            <td>${dadosObj.results[j][6]}</td>
                            <td>${dadosObj.results[j][7]}</td>
                            <td>${dadosObj.results[j][8]}</td>
                        </tr>
                        ` 
                        pontosNajustado += dadosObj.results[j][8]

                        j++
                    } 
                }
                conteudo += "</tbody></table></div>";
                if (j < dadosObj.results.length)
                {
                    conteudo += `
                    <h3>Modelo - ${dadosObj.results[j][1]}</h3>
                    <div class="menu1">
                        <img src="../static/uploads/${dadosObj.results[j][3]}"/>
                    </div>
                    
                    <div class="menu2">
                    <table class="table table-striped" id="tbContagem">
                        <thead>
                        <tr>
                            <td><b>Descrição</b></td>
                            <td><b>Tipo</b></td>
                            <td><b>TD</b></td>
                            <td><b>TR</b></td>
                            <td><b>Complex.</b></td>
                            <td><b>Contribuição</b></td>
                        </tr>
                        </thead>
                        <tbody id="tbodyContagem">
                
                    `
               
                    funCod = dadosObj.results[j][0]
                }
                i = j
            }

            itens.innerHTML += conteudo;
            gerarelatorioTransacao();
        }    
        else 
        {
            var linhas = ""
            var descricao = ""
            var tipo = ""
            var TD,TR
            var fun_cod = dadosObj.results[0][0]
            var listaAux = []
            i = 0
            while (i < dadosObj.dados.length) {
                  descricao = dadosObj.dados[i][0]
                  tipo = dadosObj.dados[i][1]
                  TD = TR = 0
                  j = i
                  while (j < dadosObj.dados.length && dadosObj.dados[j][6] == fun_cod)
                  {
                    TD += dadosObj.dados[j][2]
                    TR += dadosObj.dados[j][3]
                    j++
                  }
                  listaAux = retornaComplexibilidade(TD,TR)
                  contribuicao += listaAux[1]
                  var template = 
                  `
                  <tr>
                    <td>${descricao}</td>
                    <td>${tipo}</td>
                    <td>${TD}</td>
                    <td>${TR}</td>
                    <td>${listaAux[0]}</td>
                    <td>${listaAux[1]}</td>
                  </tr>
                ` 
                i = j
                if (i < dadosObj.dados.length)
                  fun_cod = dadosObj.dados[i][6]
    
                linhas += template;
            }
    
            tabela.innerHTML = linhas;
            calculaTipoTransacao();
        }
    })
}

function gerarelatorioTransacao()
{
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/relatorio/getContagemTransacao/` + codProj,{
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
    })
    .then(function (dadosJson) {
        var obj = dadosJson.json()
        return obj
    })
    .then(function (dadosObj) {
        if (dadosObj.operacao)
        {
            var funCod = dadosObj.results[0][0]
            //para aquela funcao colocar apenas uma foto
            var itens = document.getElementById('transacao')
            var conteudo = `
                        <h3>Tela - ${dadosObj.results[0][1]}</h3>
                        
                        <div class="menu1">
                            <img src="../static/uploads/${dadosObj.results[0][3]}"/>
                        </div>
                        <div class="menu2">
                        <table class="table table-striped" id="tbContagem">
                            <thead>
                            <tr>
                                <td><b>Descrição</b></td>
                                <td><b>Tipo</b></td>
                                <td><b>TD</b></td>
                                <td><b>TR</b></td>
                                <td><b>Complex.</b></td>
                                <td><b>Contribuição</b></td>
                            </tr>
                            </thead>
                            <tbody id="tbodyContagem">
            `
            var i = 0
            while (i < dadosObj.results.length)
            {   
                j = i
                while (j < dadosObj.results.length && dadosObj.results[j][0] == funCod)
                {
                    conteudo += `
                    <tr>
                        <td>${dadosObj.results[j][2]}</td>
                        <td>${dadosObj.results[j][4]}</td>
                        <td>${dadosObj.results[j][5]}</td>
                        <td>${dadosObj.results[j][6]}</td>
                        <td>${dadosObj.results[j][7]}</td>
                        <td>${dadosObj.results[j][8]}</td>
                    </tr>
                    ` 
                    pontosNajustado += dadosObj.results[j][8]
                    j++
                }
                conteudo += "</tbody></table></div>";
                if (j < dadosObj.results.length)
                {
                    conteudo += `
                    <h3>Tela - ${dadosObj.results[j][1]}</h3>
                    <div class="menu1">
                        <img src="../static/uploads/${dadosObj.results[j][3]}"/>
                    </div>
                    
                    <div class="menu2">
                    <table class="table table-striped" id="tbContagem">
                        <thead>
                        <tr>
                            <td><b>Descrição</b></td>
                            <td><b>Tipo</b></td>
                            <td><b>TD</b></td>
                            <td><b>TR</b></td>
                            <td><b>Complex.</b></td>
                            <td><b>Contribuição</b></td>
                        </tr>
                        </thead>
                        <tbody id="tbodyContagem">
                
                `
               
                funCod = dadosObj.results[j][0]
                }
                i = j
            }

            itens.innerHTML += conteudo;
            geraFatorAjuste();
        }    
    })
}

function geraFatorAjuste()
{
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/relatorio/geraFatorAjuste/` + codProj,{
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
    })
    .then(function (dadosJson) {
        var obj = dadosJson.json()
        return obj
    })
    .then(function (dadosObj) {
        if (dadosObj.operacao)
        {
            var fator = document.getElementById('tbodyFatorAjuste')
            var linhas = ""
            for (i = 0;i < dadosObj.results.length; i++)
            {
                linhas += `
                    <tr>
                        <td>${dadosObj.results[i][0]}</td>
                        <td>${dadosObj.results[i][1]}</td>
                    </tr>
                `
                total += parseInt(dadosObj.results[i][1])
            }
            linhas += `
                    <tr style="background: darkslategrey; color: white;">
                        <td><strong>Total</strong></td>
                        <td><strong>${total}</strong></td>
                    </tr>
            `
        
            fator.innerHTML += linhas;
            geraContagem();
        }    
    })
}

function geraContagem() {

    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/relatorio/getContagem/` + codProj,{
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
        credentials: "include",
    })
    .then(function (dadosJson) {
        var obj = dadosJson.json()
        return obj
    })
    .then(function (dadosObj) {
        if (dadosObj.operacao)
        {
            var contagem = document.getElementById('dadosContagem')
            contagem.innerHTML += `
                <p><strong>Total de pontos não ajustados:</strong> ${pontosNajustado}</p>
                <p><strong>Fator de Ajuste:</strong> ${total * 0.01 + 0.65}</p>
                <p><strong>Pontos de função ajustados:</strong> ${(pontosNajustado * (total * 0.01 + 0.65)).toFixed(2)} </p>
                <hr />
                <p><strong>Modelo:</strong> ${dadosObj.results[0]}</p>
                <p><strong>Modo:</strong> ${dadosObj.results[1]}</p>
                <p><strong>LOC:</strong> ${dadosObj.results[2]} linhas</p>
                <p><strong>KLOC:</strong> ${dadosObj.results[3]}</p>
                <p><strong>Esforço:</strong> ${dadosObj.results[4]} homens-mês</p>
                <p><strong>Prazo:</strong> ${dadosObj.results[5]} meses</p>
                <p><strong>Produtividade:</strong> ${dadosObj.results[6]} pessoa-dia</p>
                <p><strong>Tamanho da Equipe:</strong> ${dadosObj.results[7]} pessoas</p>
            `
        }    
    })
}
getEscopo();