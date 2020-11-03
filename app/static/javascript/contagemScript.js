var lista = []
var tableJa = []
var funcaoAnalisada = []
var listaPrimary = []
var tableTR = []
var chama = true
function carregaFuncoes(){
    codProj = document.getElementById('selProjeto').value
    document.getElementById('selFuncao').selectedIndex = -1
    fetch(`${window.origin}/contagemScript/retornaFuncao/` + codProj,{

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
          if (chama)
            verificaScript();
        }
      })
      .catch(function () {
        alert("erro")
      })
}

function carregaTabelas(){

    fileScript = document.getElementById("filescript").files[0];
    codProj = document.getElementById('selProjeto').value
    var carrega = document.getElementById("carrega");
    document.getElementById("btnImportar").disabled = true;
    document.getElementById("selProjeto").disabled = true;
    document.getElementById("selFuncao").disabled = true;
    document.getElementById("filescript").disabled = true;

    if (document.getElementById("filescript").files.length == 0) {
      document.getElementById("MsgErro").innerHTML = "Selecione um Arquivo";
      document.getElementById("MsgErro").style.display = "block";

      document.getElementById("dadostabela").style.display = 'none';
      document.getElementById("tabelaContagem").style.display = 'none';

      document.getElementById("warning").style.display = 'block';
    }
    else
    {
      var fd = new FormData();
      fd.append("fileScript", fileScript);
      carrega.innerHTML = `<tr><td colspan="3"><img src=\"../static/img/ajax-loader.gif"\ /> verificando...</td></tr>`
      carrega.style.display = 'block'
      fetch(`${window.origin}/contagemScript/geraContagem/${codProj}`,{

          method: "POST",
          headers: {
              "Accept": "application/json",
          },
          body: fd
        })
        .then(function (dadosJson) {
          var obj = dadosJson.json()
          return obj
        })
        .then(function (dadosObj) {

          if (dadosObj.operacao){

              var tabela = "";
              lista = dadosObj.lista;
              for (i = 0,j = 0;i < dadosObj.lista.length; i = i + 2, j++)
              {
                  var linhas = `
                  <label class="container2">${dadosObj.lista[i]}
                    <input type="checkbox" name="item" value="${dadosObj.listaCod[j]}" onclick="contagemScript();">
                    <span class="checkmark"></span>
                  </label>
                  `
                  tabela += linhas;
              } 
              
              //insere o nome de todas as tabela do projeto na tabela 'tabela'
              
              document.getElementById("MsgErro").style.display = "none";
              document.getElementById("dadostabela").style.display = 'block';
              document.getElementById("tabelas").innerHTML = tabela;
              document.getElementById("tabelaContagem").style.display = 'block';
  
              document.getElementById("warning").style.display = 'none';

              var dados = `<tr><td colspan="6">Sem resultado no momento.</td></tr>`
  
              document.getElementById("tbodyContagem").innerHTML = dados;
              document.getElementById("btnsalvar").style.display = "block"

              document.getElementById('tudo').style.display = 'block'

              document.getElementById('tudo').style.display = 'block'
              document.getElementById("buttonDeletar").style.display = 'block'; 
              
              document.getElementById("btnImportar").style.display = 'none';
              document.getElementById("inputfile").style.display = 'none';
              
              document.getElementById("selProjeto").disabled = false;
              document.getElementById("selFuncao").disabled = false;
              calcularPontos()
          } 
          else
          {
            alert('Erro na leitura do script, verifique o arquivo do script.')
          }
        })
        .finally(function () {
          carrega.innerHTML = ""
          carrega.style.display = "none"; 
        });

    }
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

function contagemScript(){
  
  $("#tabelas").find("*").prop("disabled", true);
  var aChk = document.getElementsByName("item");
  var keys = Object.keys(aChk);
  var tamanho = keys.length;
  codProj = document.getElementById('selProjeto').value

  msg = document.getElementById('MsgSucesso')
  msg.style.display = 'none'

  msg2 = document.getElementById('MsgErro2')
  msg2.style.display = 'none'
  for (var i=0,j = 0;i<tamanho;i++, j = 0)
  {
    if (aChk[i].checked == true)
    {
        while (j < tableJa.length && tableJa[j] != aChk[i].value){
              j++
        }
        if (j == tableJa.length)
        {
            tableJa.push(aChk[i].value)
            buscaTipoContagem(aChk[i].value)
            i = tamanho
        }
    }
    else
    {
      k = 0
      while (k < tableJa.length && tableJa[k] != aChk[i].value){
        k++
      }
      if (k < tableJa.length)
      {
          tableJa.splice(k, 1);
          tableTR.splice(k,1);
          //tiro os atributos da lista
          for (n = 0; n < funcaoAnalisada.length; n++)
          {
              if (funcaoAnalisada[n][3] == aChk[i].value)
              {
                  funcaoAnalisada.splice(n,1)
                  n = n - 1
              }      
          }
          //se apenas sobrar uma tabela conta todos
          if (tableJa.length == 1)
          {
            tab_cod = funcaoAnalisada[0][3] //obtenho a funcao que irei contar novamente pois apenas tem ela
            funcaoAnalisada = []
            tableTR = []
            buscaTipoContagem(tab_cod)
          }
          
          i = tamanho
          exibeContagem()
      }
    }
  }
}

function exibeContagem()
{
    var sel = document.getElementById('selFuncao')
    var descricao = sel.options[sel.selectedIndex].text
    var listaAux = []
    TD = funcaoAnalisada.length
    TR = 0
    x = 0
    while (x < tableTR.length)
    {
      TR += tableTR[x]
      x++
    }
      
    //TR = tableJa.length
    //contar os TR para cada chave primary
    /*for (i = 0;i < funcaoAnalisada.length; i++)
    {
      if (funcaoAnalisada[i][1])
        TR++
    }*/
    listaAux = retornaComplexibilidade(TD, TR)

    dados = ""

    if (TD && TR > 0)
    {
        dados = 
        `<tr>
          <td>${descricao}</td>
          <td>ALI</td>
          <td>${TD}</td>
          <td>${TR}</td>
          <td>${listaAux[0]}</td>
          <td>${listaAux[1]}</td>
        </tr>
        `
    }
    else
    {
        dados = `<tr><td colspan="6">Sem resultado no momento.</td></tr>`
    }

    document.getElementById("tbodyContagem").innerHTML = dados;
    $("#tabelas").find("*").prop("disabled", false);
}

function buscaTipoContagem(Tab_Cod)
{
    var l = []
    codProj = document.getElementById('selProjeto').value
    fetch(`${window.origin}/contagemScript/obtemContagem/${codProj}/${Tab_Cod}`,{

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

        //Contar os TDs pelo dadosObj.results
        var l = dadosObj.results
        var TR = 0
        if (funcaoAnalisada.length > 0)
        { 
            //APLICAR AS REGRAS NESSA PARTE
            for (i = 0; i < l.length ; i++)
            {
                primary = l[i][1]
                foreign = l[i][2]
                //verifico se for foreign key (verifica também se é primary pelo fato de poder ter apenas uma tabela e a chave primaria ser a foreign key ta unica tabela sendo contada)
                if (foreign || primary)
                {
                    //regra da parte de TR
                    if (primary)
                        TR += 1

                    //vejo se ja foi contado
                    for (j = 0; j < funcaoAnalisada.length && funcaoAnalisada[j][0] != l[i][0]; j++)
                        j++;

                    if (j-1 == funcaoAnalisada.length)
                    {
                        funcaoAnalisada.push(l[i])
                    }       
                }
                else
                {
                    funcaoAnalisada.push(l[i])
                }        
            }
        }
        else
        {
            for (i = 0; i < l.length ; i++)
            {
              primary = l[i][1]

              //regra da parte de TR
              if (primary)
                TR += 1

              funcaoAnalisada.push(l[i])
            }
               
        }
        tableTR.push(TR)
        exibeContagem()
      } 
    }) 
}

function verificaScript(){

    codProj = document.getElementById('selProjeto').value
    msg = document.getElementById("MsgSucesso")
    msg2 = document.getElementById("MsgErro2")
    msg.style.display = "none"
    msg2.style.display = "none"
    fetch(`${window.origin}/contagemScript/verificaTabela/${codProj}`,{

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
        var tabela = "";
        listaTabela = dadosObj.results
        for (i = 0;i < listaTabela.length; i = i + 1)
        {
            var linhas = `
            <label class="container2">${listaTabela[i][1]}
              <input type="checkbox" name="item" value="${listaTabela[i][0]}" onclick="contagemScript();">
              <span class="checkmark"></span>
            </label>
            `
            console.log(listaTabela[i][1])
            console.log(listaTabela[i][0])
            tabela += linhas;
        } 
        document.getElementById("dadostabela").style.display = "block"
        document.getElementById("tabelaContagem").style.display = "block"
        document.getElementById("tabelas").innerHTML = tabela;
        document.getElementById("btnsalvar").style.display = "block"

        document.getElementById('tudo').style.display = 'block'
        document.getElementById("buttonDeletar").style.display = 'block';

        document.getElementById("warning").style.display = "none"
        document.getElementById("buttonimport").style.display = "none"
        document.getElementById("inputfile").style.display = "none" 

        document.getElementById("selFuncao").disabled = false 

        verificaFuncao() 
      }
      else
      {
        document.getElementById('buttonDeletar').style.display = 'none'
        document.getElementById("warning").style.display = "block"
        document.getElementById("btnImportar").style.display = 'block';
        document.getElementById("buttonimport").style.display = 'block';
        document.getElementById("inputfile").style.display = "block" 

        document.getElementById("pnotajustado").innerHTML = ""

        document.getElementById("btnImportar").disabled = false
        document.getElementById("filescript").disabled = false

        document.getElementById("dadostabela").style.display = "none"
        document.getElementById("tabelaContagem").style.display = "none"
        document.getElementById("btnsalvar").style.display = "none"

        document.getElementById("selFuncao").disabled = true 
      }
    })
}

function verificaFuncao(){

    //SE A FUNÇÃO TIVER CALCULO EXIBE
    codProj = document.getElementById('selProjeto').value
    codFunc = document.getElementById('selFuncao').value

    var sel = document.getElementById('selFuncao')
    var descricao = sel.options[sel.selectedIndex].text
    var dados = ""
    listaAux = []
    var aChk = document.getElementsByName("item");
    var keys = Object.keys(aChk);
    var tamanho = keys.length;

    tableJa = []
    tableTR = []
    msg = document.getElementById('MsgSucesso')
    msg.style.display = 'none'

    msg2 = document.getElementById("MsgErro2")
    msg2.style.display = "none"

    fetch(`${window.origin}/contagemScript/verificaFuncao/${codProj}/${codFunc}`,{

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
        TD = 0
        TR = 0

        //Se não tiver tabelas cadastradas retira as marcações
        if (tableJa.length == 0)
        {
          for (var i=0;i<tamanho;i++)
          {
            aChk[i].checked = false
          }
          funcaoAnalisada = [] 
        }

        for (var j = 0; j < dadosObj.results.length; j ++)
        {
            TD = TD + parseInt(dadosObj.results[j][0])
            TR += parseInt(dadosObj.results[j][1])
            tableJa.push(dadosObj.results[j][2])
            tableTR.push(dadosObj.results[j][1])
        }
            
        listaAux = retornaComplexibilidade(TD,TR)

        dados = 
            `<tr>
              <td>${descricao}</td>
              <td>ALI</td>
              <td>${TD}</td>
              <td>${TR}</td>
              <td>${listaAux[0]}</td>
              <td>${listaAux[1]}</td>
            </tr>
            `
        
        document.getElementById("tbodyContagem").innerHTML = dados;

        //marca os checkbox da tabela correspondente
        for (var i=0;i<tamanho;i++)
        {
            tab_cod = aChk[i].value
            k = 0
            tam = dadosObj.results.length
            while (k < tam){
              if (tab_cod == dadosObj.results[k][2]){
                aChk[i].checked = true
                k = tam
              }
              k++
            }
        }
        document.getElementById("buttonDeletar").style.display = 'block';  
        refazfuncaoAnalisada() 
      }
      else
      {
        for (var i=0;i<tamanho;i++)
        {
          aChk[i].checked = false
        }
        document.getElementById("tbodyContagem").innerHTML = `<tr><td colspan="6">Sem resultado no momento.</td></tr>`;

        funcaoAnalisada = []
        tableJa = []
        tableTR = []
        calcularPontos()
      }  
    })
}

function refazfuncaoAnalisada()
{
  codProj = document.getElementById('selProjeto').value
    
  var dadosConfig = {
    codProj,
    tableJa
  }

  fetch(`${window.origin}/contagemScript/obtemTodasContagem`,{

    method: "POST",
    credentials: "include",
    body: JSON.stringify(dadosConfig),
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
      //Contar os TDs pelo dadosObj.results
      var l = dadosObj.results

      //APLICAR AS REGRAS NESSA PARTE
      for (i = 0; i < l.length ; i++)
      {
          foreign = l[i][2]
          //verifico se for foreign key
          if (foreign)
          {
              //vejo se ja foi contado
              for (j = 0; j < funcaoAnalisada.length && funcaoAnalisada[j][0] != l[i][0]; j++)
                  j++;

              if (j-1 == funcaoAnalisada.length)
              {
                  funcaoAnalisada.push(l[i])
              }       
          }
          else
          {
              funcaoAnalisada.push(l[i])
          }        
      }
    }
    calcularPontos()
  }).
  catch(function (error){
    console.log('There has been a problem with your fetch operation: ' + error.message);
  })
}

function salvaContagemFuncao(){

  codProj = document.getElementById("selProjeto").value
  codFunc = document.getElementById("selFuncao").value
  carrega = document.getElementById("carrega")

  var select = document.getElementById('selFuncao');
  var descricao = select.options[select.selectedIndex].label
  
  msg = document.getElementById('MsgSucesso')
  msg2 = document.getElementById('MsgErro2')

  carrega.innerHTML = `<tr><td colspan="3"><img src=\"../static/img/ajax-loader.gif"\ /> salvando...</td></tr>`
  carrega.style.display = "block";

  var dadosConfig = {
    codProj,
    codFunc,
    descricao,
    funcaoAnalisada,
    tableJa,
    tableTR
  }

  fetch(`${window.origin}/contagemScript/SalvacontagemScript`,{
  
    method: "POST",
    credentials: "include",
    body: JSON.stringify(dadosConfig),
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
    msg2 = document.getElementById('MsgErro2')
    msg2.style.display = 'none'
    
    msg.style.display = 'block'
    msg.innerHTML = 'Cadastrado com Sucesso'
    calcularPontos()
    response.json().then(function (data) {
      console.log(data)
    })
    })
    .finally(function () {
      carrega.innerHTML = ""
      carrega.style.display = "none";
    });
}

function calcularPontos(){

  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/contagemScript/calculaPontos/` + codProj,{

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

    var total = 0
    if (dadosObj.operacao)
    {
      var l = dadosObj.results
      var td,tr
      listaAux = []
      var i = j = 0
      while (i < l.length)
      {
          td = tr = 0
          func_cod = l[i][1]
          j 
          for (;j < l.length && l[j][1] == func_cod; j++)
          {
              td += l[j][0]
              tr++
          }
          listaAux = retornaComplexibilidade(td,tr)
          total += parseInt(listaAux[1])
          i = j
      }
      
      document.getElementById('pnotajustado').innerHTML = 'Total de Pontos Não-Ajustados: ' + total
      document.getElementById('btnDeletar').disabled = true
    }
    else
    {
      document.getElementById('pnotajustado').innerHTML = 'Total de Pontos Não-Ajustados: ' + total
      document.getElementById('btnDeletar').disabled = false
    }
      
  })
}

function deletarScript() {
  var r = confirm("Confirmar Exclusão?");

  if (r == true)
  {
    var codProj = document.getElementById('selProjeto').value
    var carrega = document.getElementById("carrega");
    document.getElementById('btnDeletar').disabled = true
    document.getElementById('selProjeto').disabled = true
    document.getElementById('selFuncao').disabled = true
    $("#tabelas").find("*").prop("disabled", true);
    carrega.innerHTML = `<tr><td colspan="3"><img src=\"../static/img/ajax-loader.gif"\ /> excluindo...</td></tr>`
    carrega.style.display = "block";
    fetch(`${window.origin}/contagemScript/deletarScript/` + codProj,{
  
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
        document.getElementById('buttonDeletar').style.display = 'none'
        document.getElementById('inputfile').style.display = 'block'
        
        document.getElementById('btnImportar').style.display = 'block'
        document.getElementById('buttonimport').style.display = 'block'
        document.getElementById('pnotajustado').innerHTML = ""
        document.getElementById('warning').style.display = 'block'
        document.getElementById('tudo').style.display = 'none'

        document.getElementById('filescript').disabled = false
        document.getElementById('btnImportar').disabled = false

        document.getElementById('selFuncao').disabled = true

        document.getElementById('MsgSucesso').style.display = 'none'
        document.getElementById('MsgErro2').style.display = 'none'
        document.getElementById('btnsalvar').style.display = 'none'  

        lista = []
        tableJa = []
        funcaoAnalisada = []
        listaPrimary = []
        tableTR = []
      }
    })
    .finally( function() {
      carrega.innerHTML = ""
      carrega.style.display = "none";
      document.getElementById('btnDeletar').disabled = false
      document.getElementById('selProjeto').disabled = false
    })
  }
}

$(document).ready(function () {
  var codProj = document.getElementById('selProjeto').value

  fetch(`${window.origin}/contagemModelo/verificaExistenciaContagem/` + codProj,{

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
      document.getElementById('filescript').disabled = true 
      document.getElementById('btnImportar').disabled = true
      document.getElementById('warning2').style.display = 'block'
      document.getElementById('warning').style.display = 'none' 
    }
    else
    {
      carregaFuncoes();
      chama = true
      document.getElementById('selProjeto').disabled = false
      document.getElementById('selFuncao').disabled = false
      document.getElementById('filescript').disabled = false 
      document.getElementById('btnImportar').disabled = false
      document.getElementById('warning2').style.display = 'none' 
    }

  })

});

