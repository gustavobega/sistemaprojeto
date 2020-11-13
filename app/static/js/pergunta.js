function alteraDivPeso(){

    var tipo = document.getElementById("tipo");
    var option = tipo.children[tipo.selectedIndex];
    var texto = option.textContent;
    var divpeso = document.getElementById("divpeso");
    if (texto == "Pontos por Função"){
        
        divpeso.style.display = 'none';
    }
    else{
        divpeso.style.display = 'block';     
    }
}


