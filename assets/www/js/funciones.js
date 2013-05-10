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

	$("#leerxml").click(function(){
		alert("xml");
		/*
		window.echo($("#pais").val(), function(echoValue) {
		  console.log("AQUI 2");
		  //navigator.notification.alert(echoValue == "echome"); // should alert true.
		  //navigator.notification.alert(echoValue); // should alert true.
		  var n=echoValue.replace(/Table/g,"estudiante");
		  //xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+echoValue;
		  xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+n;

		});
		*/
		
	});// fin de click (function(){

	$("body").on("click","#btnConfirmar",function(){
        alert("Confirmaste");
        return false;
    });

	$("body").on("click","#btnValidar",function(){
        window.validar($("#phone").val(), function(echoValue) {
		  console.log("AQUI 2");
		  alert(echoValue);
		  //navigator.notification.alert(echoValue);
		});		
        return false;
    });



});//fin de document ready