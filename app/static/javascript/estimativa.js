var fatorajuste;
var pontos = 0;
var linguagem = 0;
var kloc = 0;
var contribuicao = 0
var script = false;
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

function calculaTipoDado(){
    var codProj = document.getElementById('selProjeto').value
    var tabela = document.getElementById('tbodyTipoDado')
    fetch(`${window.origin}/estimativa/obtemContagemTipoDado/${codProj}`,{

      method: "GET",
      credentials: "include",
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
    .then(function (dadosJson) {
      var obj = dadosJson.json()
      return obj
    })
    .then(function (dadosObj) {
      if (dadosObj.operacaoModelo){
        var linhas = ""
        for (var i = 0; i < dadosObj.dados.length; i++) {
  
              var template = 
              `
              <tr>
                <td>${dadosObj.dados[i][0]}</td>
                <td>${dadosObj.dados[i][1]}</td>
                <td>${dadosObj.dados[i][2]}</td>
                <td>${dadosObj.dados[i][3]}</td>
                <td>${dadosObj.dados[i][4]}</td>
                <td>${dadosObj.dados[i][5]}</td>
              </tr>
            ` 
            linhas += template;
        }

        tabela.innerHTML = linhas;
        contribuicao = 0
        calculaTipoTransacao();
      }
      else if (dadosObj.operacaoScript)
      {
        script = true;
        var linhas = ""
        var descricao = ""
        var tipo = ""
        var TD,TR
        var fun_cod = dadosObj.dados[0][6]
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
      else
      {
        linhas = `<tr><td colspan="6">Sem resultado.</td></tr>`
        contribuicao = 0
        tabela.innerHTML = linhas;
        calculaTipoTransacao();
      }
    })
}

function calculaTipoTransacao(){
  var codProj = document.getElementById('selProjeto').value
  var tabela = document.getElementById('tbodyTipoTransacao')
  fetch(`${window.origin}/estimativa/obtemContagemTipoTransacao/${codProj}`,{

    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json()
    return obj
  })
  .then(function (dadosObj) {
    if (dadosObj.operacao){
      var linhas = ""
      funcao = ""
      nomeFuncao = ""
      if (dadosObj.dados.length > 0)
      {
          nomeFuncao = dadosObj.dados[0][6]
          linhas += `<tr class="nameTable"><td colspan="6">${nomeFuncao}</td></tr>`
      }

      for (var i = 0; i < dadosObj.dados.length; i++) {
            
            if (nomeFuncao != dadosObj.dados[i][6])
            {
                nomeFuncao = dadosObj.dados[i][6]
                linhas += `<tr class="nameTable"><td colspan="6">${nomeFuncao}</td></tr>`   
            }
              
            var template = 
            `
            <tr>
              <td>${dadosObj.dados[i][0]}</td>
              <td>${dadosObj.dados[i][1]}</td>
              <td>${dadosObj.dados[i][2]}</td>
              <td>${dadosObj.dados[i][3]}</td>
              <td>${dadosObj.dados[i][4]}</td>
              <td>${dadosObj.dados[i][5]}</td>
            </tr>
          ` 
          contribuicao += dadosObj.dados[i][5];
          linhas += template;
      }
      
      tabela.innerHTML = linhas;
      obtemFatorAjuste();
    }
    else
    {
      linhas = `<tr><td colspan="6">Sem resultado.</td></tr>`

      tabela.innerHTML = linhas;
      obtemFatorAjuste();
    }

  })
}

function obtemPontos(){
  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/estimativa/retornaPontos/` + codProj,{

    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json()
    return obj
  })
  .then(function (dadosObj) {
    if (dadosObj.operacao){

      var total = 0
      if (!script)
      {
        for (i = 0;i < dadosObj.results.length; i++)
        total += parseInt(dadosObj.results[i])
      }
      else
      {
        total = contribuicao
      }
        
    
      document.getElementById('pontosFuncao').innerHTML = 'Total de Pontos Não Ajustados - ' + total
      pontos = (total * fatorajuste).toFixed(2)
      document.getElementById('pontosFuncaoAjustado').innerHTML = 'Total de Pontos Ajustados - ' + pontos

      retornaLinguagem()
    }
    else
    {
      document.getElementById('pontosFuncao').innerHTML = 'Total de Pontos Não Ajustados - 0' 
      document.getElementById('pontosFuncaoAjustado').innerHTML = 'Total de Pontos Ajustados - 0'
    }
  })
 
}

function obtemFatorAjuste(){
    
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/contagemTela/retornaFatorAjuste/` + codProj,{

        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers: new Headers({
          "content-type": "application/json"
        })
      })
      .then(function (response){
        if(response.status !== 200) {
          console.log(`Response status não é 200: ${response.status}`)
          return ;
        }
        response.json().then(function (data) {
          var total2 = 0
          for (i = 0;i < data.length; i++){
            total2 += parseInt(data[i])
          }
          fatorajuste = parseFloat(total2 * 0.01 + 0.65)
          document.getElementById('fatorajuste').innerHTML = 'Fator de Ajuste: ' + fatorajuste.toFixed(2)

          obtemPontos() 
        })
      })
}

function retornaLinguagem(){
  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/estimativa/retornaLinguagem/` + codProj,{

    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json()
    return obj
  })
  .then(function (dadosObj) {
    if (dadosObj.operacao){
      linguagem = parseInt(dadosObj.results[0]) 
      calculaEstimativa()
    }
  })
}

function calculaEstimativa() {
  if (pontos > 0)
  {
    var loc = document.getElementById('loc')
    var klocinput = document.getElementById('kloc')
  
    loc.value = (parseFloat(pontos) * linguagem).toFixed(2)
    kloc = loc.value / 1000
    loc.value += ' linhas'
    klocinput.value = kloc.toFixed(2)
  
    retornaEstimativa()
  }  
}

function retornaEstimativa() {
  var esforco = document.getElementById('esforco')
  var prazo = document.getElementById('prazo')
  var produtividade = document.getElementById('produtividade')  
  var tam = document.getElementById('tam')

  var modelo = document.getElementById('modelo')
  var tipoModelo = modelo.options[modelo.selectedIndex].label

  var modo = document.getElementById('modo')
  var tipoModo = modo.options[modo.selectedIndex].label

  if (tipoModelo == 'Básico')
  {
    if (tipoModo == 'Orgânico')
    {
      esforco.value = Math.round(2.4 * Math.pow(parseFloat(kloc),1.05))
      prazo.value = Math.round(2.5 * Math.pow(parseFloat(esforco.value),0.38))
    }  
    else if (tipoModelo == 'Semi-Destacado')
    {
      esforco.value = Math.round(3 * Math.pow(parseFloat(kloc),1.12))
      prazo.value = Math.round(2.5 * Math.pow(parseFloat(esforco.value),0.35))
    } 
    else
    {
      esforco.value = Math.round(3.6 * Math.pow(parseFloat(kloc),1.20))
      prazo.value = Math.round(2.5 * Math.pow(parseFloat(esforco.value),0.32))
    }    
  }
  else if (tipoModelo == 'Intermediário')
  {
    if (tipoModo == 'Orgânico')
    {
      esforco.value = Math.round(3.2 * Math.pow(parseFloat(kloc),1.05))
      prazo.value = Math.round(2.5 * Math.pow(parseFloat(esforco.value),0.38))
    } 
    else if (tipoModelo == 'Semi-Destacado')
    {
      esforco.value = Math.round(3 * Math.pow(parseFloat(kloc),1.12))
      prazo.value = Math.round(2.5 * Math.pow(parseFloat(esforco.value),0.35))
    }  
    else
    {
      esforco.value = Math.round(2.8 * Math.pow(parseFloat(kloc),1.20))
      prazo.value = Math.round(2.5 * Math.pow(parseFloat(esforco.value),0.32))
    }    
  }

  tam.value = Math.round(esforco.value / prazo.value)
  tam.value += ' pessoas'
  esforco.value += ' homens-mês'
  produtividade.value = (kloc / prazo.value).toFixed(2)
  produtividade.value += ' pessoa-dia'
  prazo.value += ' meses'
 
}

function trocaModelo() {
  var modelo = document.getElementById('modelo')
  var tipoModelo = modelo.options[modelo.selectedIndex].label

  if (tipoModelo == 'Básico'){
    document.getElementById('basico').style.display = 'block';
    document.getElementById('intermediario').style.display = 'none';
  }
  else if (tipoModelo == 'Intermediário'){
    document.getElementById('basico').style.display = 'none';
    document.getElementById('intermediario').style.display = 'block';
  }
  calculaEstimativa()
}

function trocaModo() {
  var modo = document.getElementById('modo')
  var tipoModo = modo.options[modo.selectedIndex].label

  if (tipoModo == 'Orgânico'){
    document.getElementById('organico').style.display = 'block';
    document.getElementById('semi').style.display = 'none';
    document.getElementById('embutido').style.display = 'none';
  }
  else if (tipoModo == 'Semi-Destacado'){
    document.getElementById('organico').style.display = 'none';
    document.getElementById('semi').style.display = 'block';
    document.getElementById('embutido').style.display = 'none';
  }
  else if (tipoModo == 'Embutido'){
    document.getElementById('organico').style.display = 'none';
    document.getElementById('semi').style.display = 'none';
    document.getElementById('embutido').style.display = 'block';
  }
  calculaEstimativa
}

function salvarEstimativa() {
  var carrega = document.getElementById('carrega')
  carrega.innerHTML = `<tr><td colspan="3"><img src=\"../static/img/ajax-loader.gif"\ /> salvando...</td></tr>`
  carrega.style.display = "block";

  var codProj = document.getElementById('selProjeto').value
  var modelo = document.getElementById('modelo').value
  var modo = document.getElementById('modo').value

  var loc = document.getElementById('loc').value.split(' ')[0]
  var kloc = document.getElementById('kloc').value
  var esforco = document.getElementById('esforco').value.split(' ')[0]
  var prazo = document.getElementById('prazo').value
  var produtividade = document.getElementById('produtividade').value.split(' ')[0]
  var tam = document.getElementById('tam').value.split(' ')[0]

  var dados = {
    modelo,
    modo,
    loc,
    kloc,
    esforco,
    prazo,
    produtividade,
    tam
  }
  fetch(`${window.origin}/estimativa/salvaEstimativa/` + codProj,{

    method: "POST",
    credentials: "include",
    body: JSON.stringify(dados),
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    }),
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json()
    return obj
  })
  .then(function (dadosObj) {
    if (dadosObj.operacao){
      var msgSucess = document.getElementById('MsgSucesso')
      msgSucess.innerHTML = "Estimativa Salva com Sucesso!";
      msgSucess.style.display = 'block';
    }
  })
  .finally (function () {
    carrega.style.display = 'none'
  })
}

$(document).ready(function () {
    calculaTipoDado();
});