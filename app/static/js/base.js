function alteraLogin()
{
    fetch(`${window.origin}/login/verificausuariologado`,{
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
      .then (function (dadosObj) {
          if (dadosObj.operacao)
          {
              document.getElementById('sign').innerHTML = `<i class="fa fa-fw fa-sign-out-alt"></i>Sair`
              document.getElementById('sign').href = "/sign-out"

              if (dadosObj.usuario == "cassia@unoeste.br" || dadosObj.usuario == "francisco@unoeste.br")
              {
                  document.getElementById('tipo').style.display = 'block'
                  document.getElementById('tc').style.display = 'block'
                  document.getElementById('perg').style.display = 'block'
                  document.getElementById('ling').style.display = 'block'
                  var a = document.querySelectorAll('div.dropdown-divider');
                  for (i = 0;i < a.length; i++)
                  {
                     a[i].style.display = 'block'
                  }
                  
                  document.getElementById('emp').href = 'empresa'
              }
          }
          else
          {
                document.getElementById('sign').innerHTML = `<i class="fa fa-fw fa-user"></i>Logar`
                document.getElementById('sign').href = "/sign-in"
          }
      })
}
alteraLogin();