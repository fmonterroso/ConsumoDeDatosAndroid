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

function handleBackButton(){
    if($.mobile.activePage.attr('id') == 'ConsumodeDatos'){
        navigator.app.exitApp();
    }else{
        consultarBD();
        navigator.app.backHistory();
    }
}

function mostrarFechaCompuesta(ahora){
    var nombreMes = new Array ("enero", "febrero", "marzo", "abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");    
    //var ahora = new Date( );
    var anoActual = ahora.getYear()+1900;
    var mesActual = ahora.getMonth( );
    var diaActual = ahora.getDate( );
    var diaSemana = ahora.getDay( );
    var Fecha = diaActual + " de " + nombreMes[mesActual] + " de " + anoActual;
    return Fecha;
}

function mostrarFechaCompuestaDias(ahora){
    var nombreMes = new Array ("enero", "febrero", "marzo", "abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");    
    var nombreDia = new Array ("Domingo","Lunes","Martés","Miércoles","Jueves","Viernes","Sábado","Domingo");
    //var ahora = new Date( );
    var anoActual = ahora.getYear()+1900;
    var mesActual = ahora.getMonth( );
    var diaActual = ahora.getDate( );
    var diaSemana = ahora.getDay( );    

    var Fecha= nombreDia[diaSemana] + " " + diaActual + " de " + nombreMes[mesActual] + " " + anoActual;
    return Fecha;
}

function mostrarHoraCompuesta(ahora){
    hora = ahora.getHours();
    minuto = ahora.getMinutes();
    estado = (hora < 12)? " AM " : " PM ";    
    hora = (hora <= 12)? hora : (hora - 12);
    horaActual = ((hora <= 9)?"0" + hora : hora) + ":";
    horaActual += ((minuto < 9)?"0" + minuto : minuto);
    horaActual += estado;
    return horaActual;
}

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}


// Aqui se carga la funcion cuando se carga completament el arbol DOm de nuestra pagina index.html
$(document).ready(function(){

	$("body").on("click","#btnConfigurar",function(){
        currentId = "";
        $.mobile.changePage("configurar.html", { transition: "slide" });
        return false;
    });

    //funcion para hacer click en cada numero de la lista decide si ir a la configuracion o ir a los detalles
    $("body").on("click",".number_element",function(){
        currentId = $(this).attr("id");
        //validando si el numero ya fue activado o no
        if($(this).attr("state") == "NO VALIDADO"){
            //redireccionando a la pantalla de configuracion
            $.mobile.changePage("configurar.html", { transition: "slide", changeHash: true });            
        }else{
            //abriendo datos
            numtelefonico = $(this).attr("numero");
            $.mobile.changePage("datos.html", { transition: "slide", changeHash: true });
        }

        return false;
    });

    //Funcion para validar si el numero ingresado es o no claro.
	$("body").on("click","#btnValidar",function(){
        //validando si el numero es claro
        window.validar($("#phone").val(), function(echoValue) {
		  if (echoValue != "0"){
            console.log("El número ingresado SI es un número Claro.");
            
            //Validando para luego insetar, si la funcion validar llega al final se llama a la funcion insertar
            validarNumeroBD();

          }else{
            console.log("El número ingresado no es un número Claro.");
            showAlert("El número ingresado no es un número Claro.","Número Inválido","OK");//mensaje 1
          }
		  //alert(echoValue);		  
		});		
        return false;
    });

    $("body").on("click","#btnConfirmar",function(){
        if (currentId != "" && $("#codConfirmacion").val() != ""){
            validarCodigoBD();            
        }else
            alert("Nada que confirmar!");
        
        return false;
    });

    $("body").on("click","#btnElimiar",function(){
        if (currentId != ""){
            alert("Eliminaras el registro:"+currentId);
            eliminarBD(currentId);
            //Actualizando listado y regresando
            consultarBD();
            navigator.app.backHistory();
        }else
            alert("Nada que eliminar!");
        return false;
    });


    $("body").on("click","#btnValidar2",function(){
        
        //validando si el numero es claro
        window.obtenerdatos(numtelefonico, function(echoValue) {
          alert(echoValue);          
        });
        
        
        return false;
    });

    $("body").on("click","#goDetalleComsumo",function(){
        $.mobile.changePage("detalleConsumo.html", { transition: "slide", changeHash: true });
        return false;
    });

    $("body").on("click","#goDetallePaquete",function(){
        $.mobile.changePage("detallePaquete.html", { transition: "slide" });
        return false;
    });

    
    

    

});//fin de document ready

//Funcion para generar codigo de seguridad que sera enviado por sms y guardod en la base de datos
function generar_codigo(numero){
    var today = new Date();
    var d = "f"+today.getFullYear()+today.getMonth()+today.getDate()+today.getHours()+today.getMinutes()+today.getSeconds();
    var r = Math.floor((Math.random()*32767)+1);
    var semilla = d+r+numero;
    var md5 = hex_md5(semilla);
    var cod = md5.substring(0,10);
    return cod;
}

//-------------------------------------Funciones de persistencia de datos------------------------------------

function errorCB(err) {
    alert("Error procesando SQL, cod: "+err.code+" desc: "+err.message);
}

function abrirBD(){
    //var dbShell = window.openDatabase(name, version, display_name, size);
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(iniciar, errorCB, fcorrecto_transac);
    return db;
}

//Funcion para comprobar si la base de datos ya fue creada
function iniciar(tx){
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='phones';",[],fcorrecto_exe,errorCB);
}

function fcorrecto_exe(tx, results){
    console.log("Filas retornadas = " + results.rows.length);
    if(results.rows.length<1){
        //creamos la base de datos
        console.log("SE crea la base de datos");
        tx.executeSql('CREATE TABLE IF NOT EXISTS phones (id INTEGER PRIMARY KEY AUTOINCREMENT, number Varchar(20), type Varchar(15), state Varchar(15), code Varchar(50), register_date DATETIME, activation_date DATETIME)');
        console.log("Se creo la base de datos correctamente");
        return true;
    }else{
        console.log("NO SE crea la base de datos");
        //Pruebas:
        //tx.executeSql('INSERT INTO phones (number, state, code, register_date, activation_date ) VALUES ("55383563","0","12345","13/05/13","13/05/13")');
        //tx.executeSql('SELECT * FROM phones',[],fcorrecto_prue,errorCB);
        return false;
    }
}

function fcorrecto_prue(tx, results){
    console.log("Filas retornadas en phones = " + results.rows.length);
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).id + ", Numero =  " + results.rows.item(i).number + ", Tipo =  " + results.rows.item(i).type + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date );
    }
}

function fcorrecto_transac() {
    //alert("Correcto verificar!");
    console.log("Se verifico la base de datos correctamente!");
}


//------ Insert a la base de datos
function insertarBD(){
    //realizando la insercion
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(insertar, errorCB, fcorrecto_tran_insert);
    return db;
}

function insertar(tx){
    //Pruebas: 50159519
    //realizando inserts
    var codigo = generar_codigo($("#phone").val());
    //showAlert("Codigo enviado:"+codigo,"Mensaje a enviar","OK");
    
    //Averiguando el tipo de dispositivo (consumiendo el web service)
    var tipodispositivo = "NO DEFINIDO";
    window.tipoclaro($("#phone").val(), function(echoValue) {
      //showAlert("El valor devuelto es:'"+echoValue+"'","Tipo de dispositivo","OK");
      //parseando el xml de vuelta
      var t = leerxmltipodispositivo(echoValue);
        if (t == "O"){
            tipodispositivo = "SIM";            
        }else if (t=="NO DEFINIDO"){
            tipodispositivo = "NO DEFINIDO";            
        }else {
            tipodispositivo = "MODEM";            
        }
    });

    
    tx.executeSql('INSERT INTO phones (number, type, state, code, register_date, activation_date ) VALUES (?,?,?,?,date("now"),"")',[$("#phone").val(),tipodispositivo,"NO VALIDADO",codigo],fcorrecto_insert_exe,errorCB);
    //se procede a enviar el codigo
    var mensaje = "El codigo para validar tu telefono es: "+codigo;
    window.enviarsms("502" + $("#phone").val(), mensaje, function(echoValue) {
      //showAlert("El valor devuelto es:'"+echoValue+"'","Mensaje enviado","OK");
      if (echoValue == "ok"){
        bandera_eliminar = "0";
        showAlert("Debemos confirmar que este numero te pertenezca, se ha enviado un código de confirmación a tu teléfono, luego escribelo en la casilla inferior.","Envío de confirmación exitosa","OK");//mensaje 3
      }else{
        bandera_eliminar = "1";
        showAlert("Ocurrio un error al solicitar el código de confirmación, por favor intentalo de nuevo más tarde.","Error en la solicitud","OK");//mensaje 2
      }      
    });
    //alert("Bandera:"+bandera_eliminar);
    if (bandera_eliminar == "1"){
        tx.executeSql('DELETE FROM phones WHERE number=? AND code=?',[$("#phone").val(),codigo]);
        bandera_eliminar = "0";
    }
}

function fcorrecto_insert_exe(tx, results){
    currentId = results.insertId;
    console.log("Se inserto correctamente!");
}

function fcorrecto_tran_insert(){
    console.log("Proceso de inserción y validación terminado correctamente!");
}



//---------Funcion para obtener el listado de numeros de la base de datos
function consultarBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultar, errorCB, fcorrecto_tran_cons);
    return db;
}

//Funcion para consultar los registros de la base de datos
function consultar(tx){
    tx.executeSql('SELECT * FROM phones',[],fcorrecto_consultar_exe,errorCB);    
}

function fcorrecto_consultar_exe(tx, results){
    console.log("Filas retornadas en tabla phones = " + results.rows.length);
    var len = results.rows.length;
    $('.number_element').remove();
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).id + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date );
        //Generando codigo html con listado de telefonos
        var elemento = '<li class="number_element" id="'+results.rows.item(i).id+'" >'+'<h3>'+results.rows.item(i).number+'</h3>'+'<p>'+results.rows.item(i).type+'</p><span class="ui-li-count">'+results.rows.item(i).state+'</span></li>'
        $('#listado').append(elemento);
        $("#"+results.rows.item(i).id).attr({"state":results.rows.item(i).state});//Agrega una atributo al elemento para hacer mas facil la validacion despues al momento de dar click a este elemento
        $("#"+results.rows.item(i).id).attr({"numero":results.rows.item(i).number});//agregando atributo de numero para consultar mas facil
        $('#listado').listview('refresh');
    }

}

function fcorrecto_tran_cons() {
    console.log("Se consulto correctamente");
}


//---------Funcion para Eliminar un registro
function eliminarBD(cod){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(eliminar, errorCB, fcorrecto_tran_eli);
    return db;
}

//Funcion para eliminar un registro de la base de datos
function eliminar(tx){
    tx.executeSql('DELETE FROM phones WHERE id=?',[currentId],fcorrecto_eliminar_exe,errorCB);    
}

function fcorrecto_eliminar_exe(tx, results){
    var len = results.rows.length;
    if (results.rowsAffected>0) {
        console.log('Fila eliminada!');
    }else{
        console.log('No se elimino ninguna fila!');
    }
}

function fcorrecto_tran_eli() {
    console.log("Se elimino correctamente");
    alert("Se elimino correctamente");
    currentId = "";
}


//---------Funcion para consultar los datos del registro actual (currentId)
function consultarActualBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarActual, errorCB, fcorrecto_tran_consAct);
    return db;
}

//Funcion para consultar el registro actual
function consultarActual(tx){
    tx.executeSql('SELECT * FROM phones WHERE id=?',[currentId],fcorrecto_consultarActual_exe,errorCB);    
}

function fcorrecto_consultarActual_exe(tx, results){
    console.log("Cantidad de Filas retornadas:" + results.rows.length);
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).id + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date );
        //Precargando los datos
        $("#phone").val(results.rows.item(i).number);
    }

}

function fcorrecto_tran_consAct() {
    console.log("Se consulto el registro actual correctamente.");
}


//---------Funcion para consultar y validar si ya fue ingresado un numero
function validarNumeroBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarValidarNumero, errorCB, fcorrecto_tran_validarNum);
    return db;
}

//Funcion para consultar
function consultarValidarNumero(tx){
    tx.executeSql('SELECT * FROM phones WHERE number=?',[$("#phone").val()],fcorrecto_validarNumero_exe,errorCB);
}

function fcorrecto_validarNumero_exe(tx, results){
    console.log("Cantidad de Filas retornadas en validacion de numero:" + results.rows.length);
    var len = parseInt(results.rows.length);
    if (len > 0){
        //el numero ya esta en la base de datos
        console.log("El numero ya esta en la BD");
        showAlert("El número ingresado ya esta registrado. Por favor ingresa otro.","Número Inválido","OK")
    }else{
        //Se procede a insertar pues ya fue validado en la base de datos
        insertarBD();
    }
}

function fcorrecto_tran_validarNum() {
    console.log("Se valido el numero correctamente.");
}


//---------Funcion para validar comparacion de codigo de confirmacion con la base de datos
function validarCodigoBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarValidarCodigo, errorCB, fcorrecto_tran_validarCod);
    return db;
}

//Funcion para consultar validando el codigo
function consultarValidarCodigo(tx){
    tx.executeSql('SELECT * FROM phones WHERE id=? AND code=?',[currentId,$("#codConfirmacion").val()],fcorrecto_validarCodigo_exe,errorCB);
}

function fcorrecto_validarCodigo_exe(tx, results){
    console.log("Cantidad de Filas retornadas en validacion de codigo:" + results.rows.length);
    var len = parseInt(results.rows.length);
    if (len > 0){
        //El codigo ingresado coincide con el registrado en la BD
        console.log("El codigo es correcto!");
        showAlert("El número ha sido agregado a tu aplicación de monitoreo de consumo de datos.","Confirmación exitosa!","OK")
        //Actualizando datos del registro
        tx.executeSql('UPDATE phones SET state = "ACTIVO", activation_date = date("now") WHERE id=?',[currentId]);

        //Actualizando listado y regresando
            consultarBD();
            navigator.app.backHistory();
    }else{
        //El codigo no es correcto
        showAlert("El código de confirmación ingresado no es válido. Por favor verifica el mismo e intenta de nuevo.","Confirmación inválida","OK")
    }
}

function fcorrecto_tran_validarCod() {
    console.log("Se valido el numero correctamente.");
}


//--------------------Funciones para manejo de XML--------------

//Parser de xml de respuesta para consultar datos del paquete de internet
function leerxml(texto){
    bandera_paquete = "0";
    //Comenzamos a recorrer el xml
    $(texto).find("PAQUETESACTIVOS").each(function () {
        $(this).find("PAQUETECUENTA").each(function () {
           bandera_paquete = "1";
           vigencia = $(this).find('FIN').text();
           mbconsumidos = $(this).find('CONSUMOMB').text();
           $(this).find("PAQUETE").each(function () {
               nombrepaq = $(this).find('NOMBRE').text();
               mbtotales = $(this).find('LIMITEDATOSMB').text();
            });
        });
        return false;
    });

}


//Parser de xml de respuesta para obtener el tipo de dispositivo (modem o telefono)
function leerxmltipodispositivo(texto){
    //Comenzamos a recorrer el xml
    var tipo = "";
    $(texto).find("RESPONSE").each(function () {
        tipo = $(this).text();
        //alert("Tipo reconocido:"+tipo);        
        return false;
    });
    return tipo;
}
