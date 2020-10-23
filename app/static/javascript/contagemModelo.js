var linhas = ""
var chama = true
function carregaFuncoes(){

    codProj = document.getElementById('selProjeto').value
    document.getElementById('selFuncao').selectedIndex = -1
    fetch(`${window.origin}/contagemModelo/retornaFuncao/` + codProj,{

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

          var selFuncao = document.getElementById("selFuncao");
          var opts
          for (var i = 0; i < dadosObj.dado.length; i++) {
  
              opts += `<option 
                      value="${dadosObj.dado[i][0]}">
                      ${dadosObj.dado[i][1]}</option>`;
          }
          selFuncao.innerHTML = opts; 
          var select = document.getElementById('selFuncao')
          var descricao = select.options[select.selectedIndex].label
          document.getElementById('descricao').value = descricao
        } 
        if (chama)
        {
          carregaTipoCont() 
          retiraCalculo()
        }     
    }) 
}

function carregaFoto(){
    var codF = document.getElementById('selFuncao').value
    document.getElementById('selProjeto').disabled = true
    document.getElementById('selFuncao').disabled = true
    document.getElementById('contCod').value = 0

    foto = document.getElementById('imageoption')
    fetch(`${window.origin}/contagemModelo/retornaFoto/` + codF,{

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
        
        if (dadosObj.operacao)
          foto.src = '../static/img/uploads/' + dadosObj.dado[0]
        else
          foto.src = '../static/img/uploads/notFound.jpg' 

        var select = document.getElementById('selFuncao')
        var descricao = select.options[select.selectedIndex].label
        document.getElementById('descricao').value = descricao
        carregaTabela()
        retiratextos()
    })
    .catch(function () {
      foto.src = '../static/img/uploads/notFound.jpg' 
    })
}


function carregaTipoCont(){
  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/contagemModelo/retornaTipoCont/` + codProj,{

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
    var selTipo = document.getElementById("selTipo");
    var opts
    for (var i = 0; i < dadosObj.dado.length; i++) {

      if (dadosObj.dado[i][1] == 'ALI' || dadosObj.dado[i][1] == 'AIE')
          opts += `<option 
                  value="${dadosObj.dado[i][0]}">
                  ${dadosObj.dado[i][1]}</option>`;
    }
    selTipo.innerHTML = opts;
    carregaFoto()
  })
}


function carregaTabela(){

  linhas = ""
  var codProj = document.getElementById('selProjeto').value
  var codF = document.getElementById('selFuncao').value

  fetch(`${window.origin}/contagemModelo/retornaContagem/${codF}/${codProj}`,{

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
    var tbodyContagem = document.getElementById("tbodyContagem");
      for (i = 0;i < dadosObj.dados.length; i++){

          var template = `
          <tr>
            <td>${dadosObj.dados[i][11]}</td>
            <td>${dadosObj.lista[i]}</td>
            <td>${dadosObj.dados[i][12]}</td>
            <td>${dadosObj.dados[i][13]}</td>
            <td>${dadosObj.dados[i][14]}</td>
            <td>${dadosObj.dados[i][15]}</td>
            <td>
              <a href="javascript:editaContagem(${dadosObj.dados[i][0]});">
              <img class="fa fa-fw fa-edit" />
              </a>
              <a href="javascript:deletarContagem(${dadosObj.dados[i][0]});" onclick="return confirm('Confirmar Exclusão?')">
              <img class="fa fa-fw fa-trash-alt" />
              </a>
            </td>
          </tr>
        ` 
        linhas += template 
      }

      if (linhas == "") {

        linhas = `<tr><td colspan="6">Sem resultado.</td></tr>`
      }

      tbodyContagem.innerHTML = linhas
      calcularPontos()
  })
}

function calcComplexidade(){

  var tipo = document.getElementById('selTipo')

  var textTipo = tipo.options[tipo.selectedIndex].text
  var td = document.getElementById('td').value
  var registro = document.getElementById('registro').value

  if (textTipo == 'ALI' || textTipo == 'AIE'){
      if ((registro == 1 && td < 20) ||( registro == 1 && td >= 20 && td <= 50) || (registro >= 2 && registro <= 5 && td < 20)){//baixa
        document.getElementById('complexidade').value = 'Baixa'
        document.getElementById('pf').value = 7
      } 
      else if ((registro == 1 && td > 50) || (registro >= 2 && registro <= 5 && td >= 20 && td <= 50) || (registro > 5 && td < 20)){//media
        document.getElementById('complexidade').value = 'Média'
        document.getElementById('pf').value = 10
      }
      else if((registro >= 2 && registro <= 5 && td > 50) || (registro > 5 && td >= 20 && td <= 50) || (registro > 5 && td > 50)){//alta
        document.getElementById('complexidade').value = 'Alta'
        document.getElementById('pf').value = 15
      }    
  }
}

function adicionarFuncao(){

    var contCod = document.getElementById('contCod').value
    var fCod = document.getElementById('selFuncao').value
    var pCod = document.getElementById('selProjeto').value
    var tpCod = document.getElementById('selTipo').value
    var desc = document.getElementById('descricao').value
    var td = document.getElementById('td').value
    var tr = document.getElementById('registro').value
    var complexidade = document.getElementById('complexidade').value
    var pf = document.getElementById('pf').value

    if (desc.trim() == "") {
      MsgErro.innerHTML = "Preencha a Descrição";
      MsgErro.style.display = "block";
    }
    else if (td == 0) {
        MsgErro.innerHTML = "Preencha os TD";
        MsgErro.style.display = "block";
    }
    else if (tr == 0) {
        MsgErro.innerHTML= "Preencha os TR </br>";
        MsgErro.style.display = "block";
    }
    else{

      MsgErro.style.display = "none";
        var dados = {
          contCod,
          fCod,
          pCod,
          tpCod,
          desc,
          td,
          tr,
          complexidade,
          pf
      }

      fetch(`${window.origin}/contagemModelo/adicionaContagem`,{

        method: "POST",
        credentials: "include",
        body: JSON.stringify(dados),
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
          msg = document.getElementById('MsgSucesso')

          msg.style.display = 'block'
          msg.innerHTML = 'Cadastrado com Sucesso'

          limpaInput() 
          carregaTabela()
          document.getElementById('contCod').value = dadosObj.cod
      })
  }  
}


function limpaInput(){

    document.getElementById('descricao').value = ''
    document.getElementById('td').value = ''
    document.getElementById('registro').value = ''
    document.getElementById('complexidade').value = ''
    document.getElementById('pf').value = ''
}

function editaContagem(contCod){

    fetch(`${window.origin}/contagemModelo/alterarContagem/${contCod}`,{

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

        var select = document.getElementById('selTipo')
        select.value = data[6]

        document.getElementById('descricao').value = data[1]
        document.getElementById('td').value = data[2]
        document.getElementById('registro').value = data[3]
        document.getElementById('complexidade').value = data[4]
        document.getElementById('pf').value = data[5]

        document.getElementById('contCod').value = data[0]
      })
      })    
}

function deletarContagem(contCod){

  fetch(`${window.origin}/contagemModelo/deletarContagem/${contCod}`,{

    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json(); //deserializando
    return obj;
  })
  .then(function (dadosObj) {
      console.log(dadosObj.msg)
      msg = document.getElementById('MsgSucesso')
      msg.style.display = 'block'
      msg.innerHTML = 'Deletado com Sucesso'
      document.getElementById('contCod').value = 0;
      carregaTabela() 
  })  
}

function calcularPontos(){
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/contagemModelo/calculaPontos/` + codProj,{

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
        var total = 0
        for (i = 0;i < data.length; i++){
          total += parseInt(data[i])
        }
        verificaContagem()
        document.getElementById('pnotajustado').innerHTML = 'Total de Pontos Não-Ajustados: ' + total
      })
    })
}

function verificaContagem(){
  var codProj = document.getElementById('selProjeto').value
  var codFunc = document.getElementById('selFuncao').value

    fetch(`${window.origin}/contagemModelo/verificaContagem/${codProj}/${codFunc}`,{

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
      if (dadosObj.operacao)
      {
        console.log(dadosObj.dado[0])
        document.getElementById('contCod').value = dadosObj.dado[0]
      }  
    })
    .finally(function () {
      document.getElementById('selProjeto').disabled = false
      document.getElementById('selFuncao').disabled = false
    })
}

function retiratextos(){
  document.getElementById('MsgSucesso').style.display = 'none' 
  document.getElementById('MsgErro').style.display = "none";
}

function retiraCalculo(){
  document.getElementById('pnotajustado').innerHTML = 'Total de Pontos Não-Ajustados: ?'
}

function mudaIndo(){

    var seltipo = document.getElementById('selTipo');
    var tipo = seltipo.options[seltipo.selectedIndex].label

    if (tipo == 'ALI'){
      document.getElementById('c2').style.display = 'block';
      document.getElementById('c3').style.display = 'none';
    }
    else if (tipo == 'AIE'){
      document.getElementById('c2').style.display = 'none';
      document.getElementById('c3').style.display = 'block';
    }
}

$(document).ready(function () {
  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/contagemScript/verificaExistenciaContagem/` + codProj,{

    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: new Headers({
      "content-type": "application/json"
    })
  })
  .then (function(dadosJson){
    var obj = dadosJson.json()
    return obj
  })
  .then (function (dadosObj) {
    if (dadosObj.operacao)
    {
      carregaFuncoes();
      chama = false
      document.getElementById('selProjeto').disabled = true
      document.getElementById('selFuncao').disabled = true
      document.getElementById('warning').style.display = 'block' 
      document.getElementById('desabilita').style.display = 'none'  
    }
    else
    {
      carregaFuncoes();
      chama = true
      document.getElementById('selProjeto').disabled = false
      document.getElementById('selFuncao').disabled = false
      document.getElementById('desabilita').style.display = 'block' 
      document.getElementById('warning').style.display = 'none' 
    }

  })

});