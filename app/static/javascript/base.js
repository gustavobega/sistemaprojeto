function alteraLogin()
{
    fetch(`${window.origin}/login/verificausuariologado`,{

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
          if (dadosObj.operacao)
          {
              document.getElementById('sign').innerHTML = `<i class="fa fa-fw fa-sign-out-alt"></i>Sair`
              document.getElementById('sign').href = "/sign-out"
          }
          else
          {
                document.getElementById('sign').innerHTML = `<i class="fa fa-fw fa-user"></i>Logar`
                document.getElementById('sign').href = "/sign-in"
          }
      })
}
alteraLogin();