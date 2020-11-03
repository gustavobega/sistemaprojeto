function cadFuncao(){
    
    nome = document.getElementById('nome').value
    opcaos = document.getElementsByName('options')
    tipo = ''
    for (var i = 0; i < opcaos.length; i++) {
        if (opcaos[i].checked) {
            tipo = opcaos[i].value
            i = opcaos.length
        }
    }
    codProj = document.getElementById('proj').value

    var dados = {
        nome,
        tipo,
        codProj
    }

    fetch(`${window.origin}/funcao/cadFuncao`,{
          method: "POST",
          credentials: "include",
          body: JSON.stringify(dados),
          cache: "no-cache",
          headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function(response){

        response.json().then(function (data) {
            
            var fd = new FormData()
            var cod = data.cod
            var imagem = document.getElementById('imagemcad').files[0]
            fd.append('imagem', imagem)
            fd.append('cod', cod)

            fetch(`${window.origin}/funcao/cadImagem`,{
                    method: "POST",
                    headers: new Headers({
                        "accept" :  "application/json"
                    }),
                    body: fd        
            })
            .then(function (response){
                if(response.status !== 200) {
                console.log(`Response status não é 200: ${response.status}`)
                return ;
                }
        
                response.json().then(function (data) 
                {
                    console.log(data)
                    
                    window.location.href = '/cadastroFuncao'
                })
            }) 
        })
    })
}

function carregaFuncoes() {
    var codProj = document.getElementById('proj').value

    fetch(`${window.origin}/funcao/getFuncoes/${codProj}`,{
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
      .then (function (dadosObj) {
        var tbodyFuncoes = document.getElementById('tbodyFuncoes')
        tbodyFuncoes.innerHTML = ""
          if (dadosObj.operacao)
          {
              var linhas = ""
              for (i = 0;i < dadosObj.results.length; i++)
              {
                  var image
                  if (dadosObj.results[i][4] == null)
                  {image = 'Não possui'}    
                  else
                  {image = dadosObj.results[i][4]}
                  
                   linhas += `
                   <tr>
                    <td>${dadosObj.results[i][0]}</td>
                    <td>${dadosObj.results[i][2]}</td>
                    <td>${dadosObj.results[i][5]}</td>
                    
                    <td>${image}</td>
                    <td>
                      <a href="/deletarfuncao/${dadosObj.results[i][0]}" onclick="return confirm('Confirmar Exclusão?')">
                        <img class="fa fa-fw fa-trash-alt" />
                      </a>
                    </td>
                   </tr>
                   ` 
              }

              tbodyFuncoes.innerHTML = linhas
          }
          else
          {
            tbodyFuncoes.innerHTML = `<tr><td colspan="4">sem resultados...</td></tr>`
          }
      })
}