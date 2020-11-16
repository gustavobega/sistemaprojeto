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
            document.getElementById('sair').innerHTML = `
                                          <li class="nav-item dropdown">
                                              <a class="nav-link dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="sign-out"><i class="fa fa-fw fa-user"></i>Empresa</a>
                                              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a class="dropdown-item" href="/sign-out"><i class="fa fa-fw fa-sign-out-alt"></i>Sair</a>
                                              </div>
                                          </li>`
            
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