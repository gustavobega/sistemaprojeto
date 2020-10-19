function carregaPerguntas() {

    var codProj = document.getElementById('proj').value
    var tbodyPerguntas = document.getElementById("tbodyPerguntas");
    tbodyPerguntas.innerHTML = `<tr><td colspan="3"><img src=\"../static/img/ajax-loader.gif"\ /> carregando...</td></tr>`
    fetch(`${window.origin}/fatorAjuste/retornaPerguntas/` + codProj,{

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
        var linhas = "";
        for (var i = 0; i < data.length; i++) {

          var template =
              `<tr data-id="${i}">
                  <td id="codPergunta${i}" class="${data[i][0]}">${data[i][1]}</td>
                  <td ><input type="number" min="0" max="5" value="${data[i][3]}" id="Insertpeso${i}" class="pesoNV" onkeypress='return event.charCode >= 48 && event.charCode <= 57' onkeyup="calcFator()" onclick="calcFator()"></td>  
                </tr >                
              ` 
            linhas += template;
        }

        if (linhas == "") {

          linhas = `<tr><td colspan="3">Sem resultado.</td></tr>`
        }

        tbodyPerguntas.innerHTML = linhas;
        msg = document.getElementById('MsgSucesso')
        msg2 = document.getElementById('MsgErro')
        msg.style.display = 'none'
        msg2.style.display = 'none'
        calcFator()
      })
    })
  }

function calcFator() {
    var pesos = document.getElementsByClassName("pesoNV");
    let nivel = 0;
    var peso;
    for (i = 0; i < pesos.length; i++, peso = 0) {
      peso = parseInt(document.getElementById("Insertpeso" + i).value)
      if (!isNaN(peso))
            nivel += peso
    }
    document.getElementById('peso').value = nivel
    let fatorajuste = parseFloat(nivel * 0.01 + 0.65)
    document.getElementById('valorFator').innerHTML = "Fator de Ajuste = " + fatorajuste
  }

function cadFatorAjuste(){
    codProj = document.getElementById('proj').value
    //tamanho da lista
    var pesos = document.getElementsByClassName("pesoNV");
    msg = document.getElementById('MsgSucesso')
    msg2 = document.getElementById('MsgErro')
    entrou = false

    listFAP_Cod = []
    listValor = []
    var peso;
    for (i = 0;i < pesos.length; i++){
      codPerg = document.getElementById('codPergunta' + i).className
      peso = parseInt(document.getElementById('Insertpeso' + i).value)
      if (isNaN(peso))
            peso = 0
      
      if (peso < 0 || peso > 5){
        document.getElementById('Insertpeso' + i).style.borderColor = 'red' 
        document.getElementById('Insertpeso' + i).style.borderWidth = '2px'
        entrou = true
        msg.style.display = 'none'
        msg2.style.display = 'block'
        msg2.innerHTML = 'Erro ao Salvar'
      }
      else{
        document.getElementById('Insertpeso' + i).style.border = 'solid'
        document.getElementById('Insertpeso' + i).style.borderWidth = '1px'
      }

      listFAP_Cod.push(codPerg)
      listValor.push(peso)
    }
    
    if (!entrou){

      var dados = {
        codProj,
        listFAP_Cod,
        listValor
      }
      msg2.style.display = 'none'
      carrega.innerHTML = `<tr><td colspan="3"><img src=\"../static/img/ajax-loader.gif"\ /> salvando...</td></tr>`
      carrega.style.display = "block";
      fetch(`${window.origin}/fatorAjuste/cadFatorAjuste`,{
  
          method: "POST",
          credentials: "include",
          body: JSON.stringify(dados),
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
          msg.style.display = 'block'
          msg.innerHTML = 'Cadastrado com Sucesso'
  
          response.json().then(function (data) {
            console.log(data)
          })
          })
          .finally(function () {
            carrega.innerHTML = ""
            carrega.style.display = "none";
          });

    }  
  }
  
carregaPerguntas();