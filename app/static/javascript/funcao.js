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
            var arquivo = document.getElementById('arquivo').files[0]
            fd.append('arquivo', arquivo)
            fd.append('cod', cod)

            console.log(fd)

            fetch(`${window.origin}/funcao/cadArquivo`,{
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
          
                response.json().then(function (data) {
                  console.log(data)
                  
                  window.location.href = '/cadastroFuncao'
          
                })
            })
           
        })
    })
}