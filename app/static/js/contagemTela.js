var linhas = ""

function carregaFuncoes(){

    codProj = document.getElementById('selProjeto').value
    document.getElementById('selFuncao').selectedIndex = -1
    fetch(`${window.origin}/contagemTela/retornaFuncao/` + codProj,{
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "include"
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
          
        } 
          carregaTipoCont() 
          retiraCalculo()
      })
}

function carregaFoto(){
    var codF = document.getElementById('selFuncao').value
    document.getElementById('selProjeto').disabled = true
    document.getElementById('selFuncao').disabled = true

    foto = document.getElementById('imageoption')
    fetch(`${window.origin}/contagemTela/retornaFoto/` + codF,{
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "include"
    })
    .then(function (dadosJson) {
      var obj = dadosJson.json()
      return obj
    })
    .then(function (dadosObj) {

        if (dadosObj.operacao)
          foto.src = '../static/uploads/' + dadosObj.dado[0]
        else
          foto.src = '../static/uploads/notFound.png' 

        carregaTabela()
        retiratextos()
    })
    .catch(function () {
      foto.src = '../static/uploads/notFound.png' 
    })
}

function carregaTipoCont(){
  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/contagemTela/retornaTipoCont/` + codProj,{
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: "include"
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json()
    return obj
  })
  .then(function (dadosObj) {
    var selTipo = document.getElementById("selTipo");
    var opts
    for (var i = 0; i < dadosObj.dado.length; i++) {

      if (dadosObj.dado[i][1] != 'ALI' && dadosObj.dado[i][1] != 'AIE')
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

  fetch(`${window.origin}/contagemTela/retornaContagem/${codF}/${codProj}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: "include"
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

  if (textTipo == 'EE'){
    if (((registro == 0 || registro == 1) && td >= 1 && td <= 4) ||((registro == 0 || registro == 1) && td >= 5 && td <= 15) || (registro == 2 && td >= 1 && td <= 4)){//baixa
      document.getElementById('complexidade').value = 'Baixa'
      document.getElementById('pf').value = 3
    } 
    else if (((registro == 0 || registro == 1) && td >= 16) || (registro == 2  && td >= 5 && td <= 15) || (registro >= 3 && td >= 1 && td <=4)){//media
      document.getElementById('complexidade').value = 'Média'
      document.getElementById('pf').value = 4
    }
    else if((registro == 2 && td >= 16) || (registro >= 3 && td >= 5 && td <= 15) || (registro >= 3 && td >= 16)){//alta
      document.getElementById('complexidade').value = 'Alta'
      document.getElementById('pf').value = 6
    } 
  }
  else if (textTipo == 'SE' || textTipo == 'CE'){
    if (((registro == 0 || registro == 1) && td >= 1 && td <= 5) ||((registro == 0 || registro == 1) && td >= 6 && td <= 19) || (registro >= 2 && registro <= 3 && td >= 2 && td <= 3)){//baixa
      document.getElementById('complexidade').value = 'Baixa'
      if (textTipo == 'SE')
        document.getElementById('pf').value = 4
      else
        document.getElementById('pf').value = 3
    } 
    else if (((registro == 0 || registro == 1) && td >= 20) || (registro >= 2 && registro <= 3 && td >= 6 && td <= 19) || (registro >= 4 && td >= 1 && td <=5)){//media
      document.getElementById('complexidade').value = 'Média'
      if (textTipo == 'SE')
        document.getElementById('pf').value = 5
      else
        document.getElementById('pf').value = 4
    }
    else if((registro >= 2 && registro <= 3 && td >= 20) || (registro >= 4 && td >= 6 && td <= 19) || (registro >= 4 && td >= 20)){//alta
      document.getElementById('complexidade').value = 'Alta'
      if (textTipo == 'SE')
        document.getElementById('pf').value = 7
      else
        document.getElementById('pf').value = 6
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

      fetch(`${window.origin}/contagemTela/adicionaContagem`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            credentials: "include",
            body: JSON.stringify(dados)
        })
        .then (function (dadosJson) {
          var obj = dadosJson.json()
          return obj
        })
        .then(function (dadosObj) {
          if(dadosObj.operacao){
            msg = document.getElementById('MsgSucesso')

            msg.style.display = 'block'
            msg.innerHTML = 'Cadastrado com Sucesso'

            limpaInput() 
            carregaTabela()
            document.getElementById('contCod').value = 0
          }
        });
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

    fetch(`${window.origin}/contagemTela/alterarContagem/${contCod}`,{

      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "include"
    })
    .then(function (dadosJson) {
      var obj = dadosJson.json()
      return obj
    })
    .then(function (dadosObj) {
      var select = document.getElementById('selTipo')
      select.value = dadosObj[6]

      document.getElementById('descricao').value = dadosObj[1]
      document.getElementById('td').value = dadosObj[2]
      document.getElementById('registro').value = dadosObj[3]
      document.getElementById('complexidade').value = dadosObj[4]
      document.getElementById('pf').value = dadosObj[5]

      document.getElementById('contCod').value = dadosObj[0]
    });   
}

function deletarContagem(contCod){

  fetch(`${window.origin}/contagemTela/deletarContagem/${contCod}`,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    credentials: "include"
  })
  .then(function (dadosJson) {
    var obj = dadosJson.json(); //deserializando
    return obj;
  })
  .then(function (dadosObj) {
      msg = document.getElementById('MsgSucesso')
      msg.style.display = 'block'
      msg.innerHTML = 'Deletado com Sucesso'
      carregaTabela() 
  })  
}

function calcularPontos(){
    var codProj = document.getElementById('selProjeto').value

    fetch(`${window.origin}/contagemTela/calculaPontos/` + codProj,{
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "include"
    })
    .then(function (dadosJson) {
      var obj = dadosJson.json(); //deserializando
      return obj;
    })
    .then(function (dadosObj) {
        var total = 0
        for (i = 0;i < dadosObj.length; i++){
          total += parseInt(dadosObj[i])
        }
        document.getElementById('pnotajustado').innerHTML = 'Total de Pontos Não-Ajustados: ' + total
        document.getElementById('selProjeto').disabled = false
        document.getElementById('selFuncao').disabled = false
    });
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

    if (tipo == 'EE'){
      document.getElementById('c2').style.display = 'block';
      document.getElementById('c3').style.display = 'none';
      document.getElementById('c4').style.display = 'none';
    }
    else if (tipo == 'SE'){
      document.getElementById('c2').style.display = 'none';
      document.getElementById('c3').style.display = 'block';
      document.getElementById('c4').style.display = 'none';
    }
    else if (tipo == 'CE'){
      document.getElementById('c2').style.display = 'none';
      document.getElementById('c3').style.display = 'none';
      document.getElementById('c4').style.display = 'block';
    }
}

carregaFuncoes()