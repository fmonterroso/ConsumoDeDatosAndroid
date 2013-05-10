function alertDismissed() {
	// hacer algo
}

function showAlert(texto,titulo,boton) {
    navigator.notification.alert(
    texto,     // mensaje (message)
    alertDismissed,         // función 'callback' (alertCallback)
    titulo,            // titulo (title)
    boton                // nombre del botón (buttonName)
    );
}


// Aqui se carga la funcion cuando se carga completament el arbol DOm de nuestra pagina index.html
$(document).ready(function(){

	$("body").on("click","#leerxml",function(){
        alert("xml");
        return false;
    });
	
    //Funcion para validar si el numero ingresado es o no claro.
	$("body").on("click","#btnValidar",function(){
        window.validar($("#phone").val(), function(echoValue) {
		  if (echoValue != "0"){
            //Generar el codigo para la validacion
            showAlert("El número ingresado SI es un número Claro.","Número Correcto","OK")
          }else{
            showAlert("El número ingresado no es un número Claro.","Número Inválido","OK")
          }

		  //alert(echoValue);
		  //navigator.notification.alert(echoValue);
		});		
        return false;
    });

    $("body").on("click","#btnConfirmar",function(){
        alert("Confirmaste");
        return false;
    });

});//fin de document ready