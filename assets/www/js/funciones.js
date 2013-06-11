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
    if($.mobile.activePage.attr('id') == 'Datos'){
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
  return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4]); // months are 0-based
}

function consultaDatosPaquete(){
    //alert("id actual:"+currentId);
    if (currentId != ""){
        //Llamada a la funcion para consumir el web service y establecer los datos en las variables globales
        var resultado = "";
        window.obtenerdatos(numtelefonico, function(echoValue) {
          //alert(echoValue);
          resultado = echoValue;
        });                 
        if (resultado == "ERROR"){
            showAlert("Ocurrio un problema consultando tus datos. Por favor intenta mas tarde.","OK");
        }else{
            leerxml(resultado);
            //validando para saber si se encontro algun paquete:
            if (bandera_paquete != "1"){
                showAlert("El número seleccionado no tiene algun paquete Claro de datos activo.","Consumo de internet","OK");
                vigencia = "";
                mbtotales = "0";
                mbconsumidos = "0";
                nombrepaq = "N/A";
                cont_paquetes = 0;
            }
            //Mostrando datos en la interfaz
            mostrarDatosPaquete();            
        }
    }else{

    }

}

function mostrarDatosPaquete(){
    //conversion de fecha acutal
    var ahora = new Date( );
    var fech = mostrarFechaCompuesta(ahora);
    var hora = mostrarHoraCompuesta(ahora);
    $("#dateAndTime").empty();
    $("#dateAndTime").append(fech+" a las "+hora);

    //Datos obtenidos con WS
    if (parseInt(mbtotales) > 0)
        var porcentaje = 100 - Math.round((parseInt(mbconsumidos)*100)/parseInt(mbtotales));
    else
        var porcentaje = 0;
    
    //haciendo validacion de dispositivo
    var plataforma = device.platform;
    var versionplataforma = device.version;
    if (plataforma == "Android") {
        //Es un Android
        if (versionplataforma != "1.0" && versionplataforma != "1.1" && versionplataforma != "1.5" && versionplataforma != "1.6" && versionplataforma != "2.0" && versionplataforma != "2.1"  && versionplataforma != "2.2" && versionplataforma != "2.3" && versionplataforma != "2.3.3" ){
            //Version valida de Android
            
            //Codigo para Gaugue Chart
            var chart;
            var data;
            var options;
            var valoractual = porcentaje;
            data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                ['Internet', valoractual]              
              ]);

              options = {
                width: 200, height: 150,
                minorTicks: 5, 
                redFrom: 0, redTo: 10,
                yellowFrom:10, yellowTo: 50,
                greenFrom:50, greenTo:100,
                duration:400, easing:'inAndOut',          
                min:0, max: 100

              };
              chart = new google.visualization.Gauge(document.getElementById('chart_div'));
              //chart = new google.visualization.Gauge($("#chart_div")[0]);
              chart.draw(data, options);


        }else{
            //No es una version valida de Android
            //Codigo para grafico comun (proressbar)                                
            TolitoProgressBar('progressbar')
            .setOuterTheme('d')
            .setInnerTheme('b')
            .isMini(true)
            .setMax(100)
            .setStartFrom(porcentaje)
            .setInterval(50)
            .showCounter(true)
            .logOptions()
            .build();                               
        }
    }else{
        //No es Android

    }

    //conversion de fecha de vigencia
    $("#validity").empty();
    if (bandera_paquete == "1"){
        //fech = Date.parse(vigencia);
        fech = parseDate(vigencia);
        //alert("parseada:"+fech);
        fech2 = new Date(fech);
        //alert("como fecha:"+fech2);
        fech3 = mostrarFechaCompuesta(fech2);
        hora3 = mostrarHoraCompuesta(fech2);                            
        //alert("aplicada funcion:"+fech3);
        $("#validity").append(fech3 + " a las " + hora3);
    }else
        $("#validity").append("N/A");

    $("#mbConsumed").empty();
    $("#mbConsumed").append(mbconsumidos);
    $("#mbConsumedBar").empty();
    $("#mbConsumedBar").append(mbconsumidos+"MB");
    
    var dispo = parseInt(mbtotales)-parseInt(mbconsumidos);
    $("#mbAvailable").empty();
    $("#mbAvailable").append(dispo);

    $("#phoneNum").empty();
    $("#phoneNum").append(numtelefonico);
    $("#packName").empty();
    $("#packName").append(nombrepaq);

    $("#numPaqRemaining").empty();
    if (cont_paquetes =="1")
        $("#numPaqRemaining").append((parseInt(cont_paquetes))+" paquete activo restante.");
    else
        $("#numPaqRemaining").append((parseInt(cont_paquetes))+" paquetes activos restantes.");
}

function validarAvance(){
    $.confirm({
        'title'     : 'Confirmación de avance',
        'message'   : 'No se ha reconocido ningun número valido en tu dispositivo. Quieres configurarlo en tu teléfono y volver a intentarlo o proceder y configurarlo dentro de la aplicación?',
        'buttons'   : {
            'Regresar'   : {
                'class' : 'blue',
                'action': function(){
                    //alert("Regresaras");
                    navigator.app.exitApp();
                }
            },
            'Proceder'    : {
                'class' : 'gray',
                'action': function(){
                    //alert("procediste");
                    $.mobile.changePage("listado.html", { transition: "slide" });
                }
            }
        }
    });
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
            //abriendo listado
            numtelefonico = $(this).attr("numero");
            $.mobile.changePage("index.html", { transition: "slide", changeHash: true });
            //Consulta buscando el numero principal si no fue establecido al inicio             
            if (currentId == ""){
                //no se inserto un numero al inicio
                //realizando busqueda del principal
                consultaPrincipal();                    
            }else{
                consultaDatosPaquete();
            }
            
            //Consultando datos del usuario
            consultarUsuarioBD();
        }

        return false;
    });

    //Funcion para validar si el numero ingresado es o no claro.
	$("body").on("click","#btnValidar",function(){
        //validando si el numero es claro
        if ($("#phone").val() != ""){
            //alert("prueba");
            window.validar($("#phone").val(), function(echoValue) {
    		  if (echoValue != "0"  && echoValue !="ERROR"){
                console.log("El número ingresado SI es un número Claro.");
                
                //Validando para luego insetar, si la funcion validar llega al final se llama a la funcion insertar
                validarNumeroBD();

              }else{
                if (echoValue == "ERROR"){
                    showAlert("Hubo un error al validar tu número de telefono. Verifica tu conexión a internet.","Validació fallida","OK");
                    console.log("Error al validar número.");
                }else{
                    showAlert("El número ingresado no es un número Claro.","Número Inválido","OK");//mensaje 1
                    console.log("El número ingresado no es un número Claro.");
                }
              }
    		  //alert(echoValue);		  
    		});
            
        }else{
            showAlert("No has ingresado un número.","Número Inválido","OK");
        }
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

    $("body").on("click","#goDetalleComsumo",function(){
        $.mobile.changePage("detalleConsumo.html", { transition: "slide", changeHash: true });
        return false;
    });

    $("body").on("click","#goDetallePaquete",function(){
        $.mobile.changePage("detallePaquete.html", { transition: "slide" });
        return false;
    });

    //-------------------Funciones del Gauge
    /*
    chart.clearChart()

    data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Internet', valor]
    ]);
    chart.draw(data, options);

    */
    //Fin de funciones de Gauge


    //-----------------------Funciones del menu-------------
    $("body").on("click",".menuitemMenu",function(){
        
        return false;
    });

    $("body").on("click",".menuitemHome",function(){
        $.mobile.changePage("index.html", { transition: "slide" });
        return false;
    });

    $("body").on("click",".menuitemStore",function(){
        //alert("Iniciando");
        /*
        window.obtenertipo(function(echoValue) {
            console.log("El tipo reconocido es:"+echoValue);
            showAlert("El tipo del dispositivo reconocido es:"+echoValue,"Tipo","OK");
        });
        
        window.obtenernumero(function(echoValue) {
            console.log("El número reconocido es:"+echoValue);
            showAlert("El número del dispositivo reconocido es:"+echoValue,"Número","OK");
        });
        */
        //alert("El valor de network:"+navigator.connection.type);
        if(navigator.connection.type == Connection.NONE){
            // No tenemos conexión
            alert("No tenemos conexión");
        }else{
            // Si tenemos conexión
            alert("Si tenemos conexión");
        }
        
        return false;
    });

    $("body").on("click",".menuitemConfig",function(){
        //alert("pag actual:"+$.mobile.activePage.attr('id'));
        if($.mobile.activePage.attr('id') != 'Listado')
            $.mobile.changePage("listado.html", { transition: "slide" });
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS phones (idphone INTEGER PRIMARY KEY AUTOINCREMENT, number Varchar(20) NOT NULL, type Varchar(15) NOT NULL, state Varchar(15) NOT NULL, code Varchar(50), register_date DATETIME NOT NULL, activation_date DATETIME, principal Varchar(10))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user (iduser INTEGER PRIMARY KEY AUTOINCREMENT, name Varchar(100) NOT NULL, email Varchar(80))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS terms_conditions (idterms_conditions INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS alarms (idalarms INTEGER PRIMARY KEY AUTOINCREMENT, percentage INTEGER NOT NULL, state Varchar(15), idphone INTEGER REFERENCES phones(idphone))');
        //insertando usuario por defecto
        tx.executeSql('INSERT INTO user (name, email) VALUES (?,?)',["Usuario","No definido"],fcorrecto_insertUser_exe,errorCB);
        console.log("Se creo la base de datos correctamente");
        return true;
    }else{
        console.log("NO SE crea la base de datos");
        //Pruebas:
        //tx.executeSql('INSERT INTO phones (number, state, code, register_date, activation_date ) VALUES ("55383563","0","12345","13/05/13","13/05/13")');
        //tx.executeSql('SELECT * FROM phones',[],fcorrecto_prue,errorCB);
        //tx.executeSql('UPDATE phones SET principal=? WHERE idphone=?',["","2"]);
        //console.log("Se actualizo correctamente");
        return false;
    }
}

function fcorrecto_insertUser_exe(tx, results){
    console.log("Se inserto el usuario correctamente! Codigo:"+results.insertId);
}

function fcorrecto_prue(tx, results){
    console.log("Filas retornadas en phones = " + results.rows.length);
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " IDphone = " + results.rows.item(i).idphone + ", Numero =  " + results.rows.item(i).number + ", Tipo =  " + results.rows.item(i).type + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date + ", Principal =  " + results.rows.item(i).principal);
    }
}

function fcorrecto_transac() {
    //alert("Correcto verificar!");
    console.log("Se verifico la base de datos correctamente!");
    //realizando al siguiente paso del flujo: Consulta inicial
    //consultaInicial();
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

    
    tx.executeSql('INSERT INTO phones (number, type, state, code, register_date, activation_date) VALUES (?,?,?,?,date("now"),"")',[$("#phone").val(),tipodispositivo,"NO VALIDADO",codigo],fcorrecto_insert_exe,errorCB);
    //se procede a enviar el codigo
    var mensaje = "El codigo para validar tu telefono es: "+codigo;
    window.enviarsms("502" + $("#phone").val(), mensaje, function(echoValue) {
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
        console.log("Fila = " + i + " ID = " + results.rows.item(i).idphone + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date + ", Principal =  " + results.rows.item(i).principal );
        //Generando codigo html con listado de telefonos
        var subelmento = "";        
        if (results.rows.item(i).principal){
            subelmento = '<span class="ui-li-aside">'+results.rows.item(i).principal+'</span>';
        }
        var elemento = '<li class="number_element" id="'+results.rows.item(i).idphone+'" >'+'<h3>'+results.rows.item(i).number+'</h3><p>'+results.rows.item(i).type+'</p><span class="ui-li-count">'+results.rows.item(i).state+'</span>'+subelmento+'</li>'
        $('#listado').append(elemento);
        $("#"+results.rows.item(i).idphone).attr({"state":results.rows.item(i).state});//Agrega una atributo al elemento para hacer mas facil la validacion despues al momento de dar click a este elemento
        $("#"+results.rows.item(i).idphone).attr({"numero":results.rows.item(i).number});//agregando atributo de numero para consultar mas facil
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
    tx.executeSql('DELETE FROM phones WHERE idphone=?',[currentId],fcorrecto_eliminar_exe,errorCB);    
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
    tx.executeSql('SELECT * FROM phones WHERE idphone=?',[currentId],fcorrecto_consultarActual_exe,errorCB);    
}

function fcorrecto_consultarActual_exe(tx, results){
    console.log("Cantidad de Filas retornadas:" + results.rows.length);
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " IDphone = " + results.rows.item(i).idphone + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date + ", Principal =  " + results.rows.item(i).principal );
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
    tx.executeSql('SELECT * FROM phones WHERE idphone=? AND code=?',[currentId,$("#codConfirmacion").val()],fcorrecto_validarCodigo_exe,errorCB);
}

function fcorrecto_validarCodigo_exe(tx, results){
    console.log("Cantidad de Filas retornadas en validacion de codigo:" + results.rows.length);
    var len = parseInt(results.rows.length);
    if (len > 0){
        //El codigo ingresado coincide con el registrado en la BD
        console.log("El codigo es correcto!");
        showAlert("El número ha sido agregado a tu aplicación de monitoreo de consumo de datos.","Confirmación exitosa!","OK")
        //Actualizando datos del registro
        tx.executeSql('UPDATE phones SET state = "ACTIVO", activation_date = date("now") WHERE idphone=?',[currentId]);

        //Actualizando listado y regresando
        $.mobile.changePage("listado.html", { transition: "slide" });

    }else{
        //El codigo no es correcto
        showAlert("El código de confirmación ingresado no es válido. Por favor verifica el mismo e intenta de nuevo.","Confirmación inválida","OK")
    }
}

function fcorrecto_tran_validarCod() {
    console.log("Se valido el numero correctamente.");
}



//---------Funcion para consultar los numeros cuando la aplicacion inicia y realizar el protocolo
function consultaInicial(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarNumerosInicial, errorCB, fcorrecto_tran_consultarIni);
    return db;
}
//Funcion para consultar numeros inicialmente
function consultarNumerosInicial(tx){
    console.log("Antes de consulta inicial");
    tx.executeSql("SELECT * FROM phones",[],fcorrecto_consultaInicial_exe,errorCB);
}

function fcorrecto_consultaInicial_exe(tx, results){
    console.log("Cantidad de Filas retornadas en consulta de inicio:" + results.rows.length);
    var len = parseInt(results.rows.length);
    if (len > 0){
        //Existe alguna fila de numero en la base de datos        
        //alert("Ya hay algun numero en la base de datos");
        bandera_existen_numeros = "1";        
    }else{
        //No hay ningun numero en la bae de datos, se procede a obtener el numero del telefono
        console.log("Iniciando obtencion de número propio");
        
        var numReconocido = "";
        //comunicandose con app nativa
        window.obtenernumero(function(n) {
            console.log("El número reconocido es:"+n);
            numReconocido = n;            
        });

        //SIMULANDO NUMERO RECONOCIDO--------------------
        //numReconocido = "50159519";

        //verificacion de que se haya reconocido un numero en el telefono
        if (numReconocido != ""){
            var numRecoClaro = "0";
            //Validando numero claro y tipo de dispositivo
            window.validar(numReconocido, function(nRC) {
              numRecoClaro = nRC;
              if (numRecoClaro != "0" && numRecoClaro !="ERROR"){
                console.log("El número reconocido SI es un número Claro.");
              }else{
                console.log("El número reconocido no es un número Claro. este era:"+numReconocido);
                //showAlert("El número reconocido en tu teléfono no es un número Claro.","Número Inválido","OK");//mensaje 1
              }
            });

            //verificacion de que el numero reconocido en el telefono sea un numero claro
            if (numRecoClaro !="0" && numRecoClaro !="ERROR"){
                //obteniendo el tipo de dispositivo
                var tipodispositivo = "NO DEFINIDO";
                window.tipoclaro(numReconocido, function(echoValue) {
                    //parseando el xml de vuelta
                    var t = leerxmltipodispositivo(echoValue);
                    if (t == "O"){
                        tipodispositivo = "SIM";            
                    }else if (t=="NO DEFINIDO"){
                        tipodispositivo = "NO DEFINIDO";            
                    }else {
                        tipodispositivo = "MODEM";            
                    }
                    console.log("El número reconocido es del tipo:"+tipodispositivo);
                });

                //insertando el número propio en la BD
                tx.executeSql('INSERT INTO phones (number, type, state, code, register_date, activation_date, principal) VALUES (?,?,?,?,date("now"),date("now"),?)',[numReconocido,tipodispositivo,"ACTIVO","","Principal"],fcorrecto_insertInicial_exe,errorCB);
                console.log("Se ha insertado inicialmente el numero:"+numReconocido+"con tipo:"+tipodispositivo);
            }else{
                if (numRecoClaro == "ERROR"){
                    showAlert("Hubo un error al validar tu número de telefono. Verifica tu conexión a internet.","Validació fallida","OK");
                }else{
                    //mostrar alerta de que el número reconocido no es un numero claro
                    //showAlert("El número reconocido en tu teléfono no es un número Claro.","Número Inválido","OK");//mensaje 1    
                    //Validando para saber si al final se encontro algun dato que mostrar o ir a la pantalla de configurar
                    validarAvance();
                }                
                bandera_existen_numeros = "0";
            }
        }else{
            //mostrar instrucciones de como configurar su numero en su tablet
            //showAlert("No se ha podido reconocer tu número de teléfono. Debes configurarlo manualmente en Entra en AJUSTES/AJUSTES DE LLAMADA/CONFIGURACION ADICIONAL/MI NUMERO DE TELEFONO, se debe escribir con el formato de 10 digitos 55XXXXXXXX.","Número no reconocido","OK");//mensaje 1
            //Validando para saber si al final se encontro algun dato que mostrar o ir a la pantalla de configurar
            validarAvance();
            bandera_existen_numeros = "0";
        }
    }
}

function fcorrecto_insertInicial_exe(tx, results){
    currentId = results.insertId;
    bandera_existen_numeros = "1";
}

function fcorrecto_tran_consultarIni() {
    console.log("Se consulto al inicio correctamente.");
    //realizando siguiente paso del flujo: Consulta principal
    /*
    if (currentId == ""){
        //no se inserto un numero al inicio
        //realizando busqueda del principal
        consultaPrincipal();                    
    }
    */
}



//---------Funcion para consultar los numeros y encontrar al principal o el primero en la lista para luego cargar datos de paquete
function consultaPrincipal(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarNumeroPrincipal, errorCB, fcorrecto_tran_consultarPrin);
    return db;
}
//Funcion para consultar numeros en busca del principal
function consultarNumeroPrincipal(tx){
    console.log("Antes de consulta principal");
    tx.executeSql("SELECT * FROM phones WHERE principal=?",["Principal"],fcorrecto_consultaPrincipal_exe,errorCB);
}

function fcorrecto_consultaPrincipal_exe(tx, results){
    console.log("Cantidad de Filas retornadas en consulta principal:" + results.rows.length);
    var len = parseInt(results.rows.length);
    if (len > 0){
        //Existe un numero establecido como principal
        //alert("Su numero principal es:"+results.rows.item(0).number);
        console.log("Su numero principal es:" + results.rows.item(0).number);
        currentId = results.rows.item(0).idphone;
        numtelefonico = results.rows.item(0).number;
        for (var i=0; i<len; i++){
            console.log("Fila Principal = " + i + " IDphone = " + results.rows.item(i).idphone + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date + ", Principal =  " + results.rows.item(i).principal );            
        }
        //Aca llamar a funcion de carga datos de paquete
        consultaDatosPaquete();
        
    }else{
        //No hay ningun numero establecido como principal. cargando primer numero en la lista si hay numeros
        //consultando nums a la bd
        tx.executeSql('SELECT * FROM phones WHERE state=?',["ACTIVO"],fcorrecto_consPrinTodos_exe,errorCB);    
        
    }
}

function fcorrecto_consPrinTodos_exe(tx, results){
    console.log("Filas retornadas en tabla phones = " + results.rows.length);
    var len = parseInt(results.rows.length);
    if (len > 0){
        console.log("1ra Fila, fila tomada: ID = " + results.rows.item(0).idphone + ", Numero =  " + results.rows.item(0).number + ", Estado =  " + results.rows.item(0).state + ", Codigo =  " + results.rows.item(0).code + ", Fecha de Ingreso =  " + results.rows.item(0).register_date + ", Fecha de Activacion =  " + results.rows.item(0).activation_date + ", Principal =  " + results.rows.item(0).principal );
        currentId = results.rows.item(0).idphone;
        numtelefonico = results.rows.item(0).number;
        //alert("El número inicialmentel es:"+results.rows.item(0).number);

        //Aca llamar a funcion de carga datos de paquete
        consultaDatosPaquete();
    }else{
        currentId = "";
        numtelefonico = "";
    }
}

function fcorrecto_tran_consultarPrin() {
    console.log("Se consulto en busca del principal correctamente.");
    //alert("Al final de todo el codigo a buscar es:"+currentId);
    //realizando siguiente paso del flujo: Consultando usuario
    //consultarUsuarioBD();
}



//---------Funcion para consultar los datos del usuario
function consultarUsuarioBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarUsuario, errorCB, fcorrecto_tran_consUsua);
    return db;
}

//Funcion para consultar el usuario
function consultarUsuario(tx){
    tx.executeSql('SELECT * FROM user LIMIT 1',[],fcorrecto_consultarUsuario_exe,errorCB);    
}

function fcorrecto_consultarUsuario_exe(tx, results){
    console.log("Cantidad de Filas retornadas:" + results.rows.length);
    var len = results.rows.length;
    $('#user_name').empty();
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " IDUser = " + results.rows.item(i).iduser + ", Nombre =  " + results.rows.item(i).name + ", Email =  " + results.rows.item(i).email);
        nombre_usuario = results.rows.item(i).name;        
        $("#user_name").append(nombre_usuario);
    }
}

function fcorrecto_tran_consUsua() {
    console.log("Se consulto el usuario correctamente.");
}
















//--------------------Funciones para manejo de XML--------------

//Parser de xml de respuesta para consultar datos del paquete de internet
function leerxml(texto){
    bandera_paquete = "0";
    //Comenzamos a recorrer el xml
    $(texto).find("PAQUETESACTIVOS").each(function () {
        $(this).find("PAQUETECUENTA").each(function () {
           var codigopaquete = "";
           cont_paquetes = 0;
           $(this).find("NODE").each(function () {
               $(this).find("PAQUETE").each(function () {
                   codigopaquete = $(this).find('CODIGO').text();
                   if (codigopaquete != "1"){
                        if (cont_paquetes<1){
                            nombrepaq = $(this).find('NOMBRE').text();
                            mbtotales = $(this).find('LIMITEDATOSMB').text();
                        }
                   }                   
               });
               if (codigopaquete != "1" ){
                    if (cont_paquetes<1){
                        bandera_paquete = "1";
                        vigencia = $(this).find('FIN').text();
                        mbconsumidos = $(this).find('CONSUMOMB').text();    
                    }
                    cont_paquetes++;
                    //return false;
               }
               
               console.log("Paquete (NODE: "+cont_paquetes+") reconocido: vigencia="+$(this).find('FIN').text()+", MB consumidos="+$(this).find('CONSUMOMB').text()+", nombre="+$(this).find('NOMBRE').text()+", MB totales="+$(this).find('LIMITEDATOSMB').text()+", Banda="+$(this).find('BANDA').text()+", Codigo="+codigopaquete);               
            });
            
        });

    });
    return false;
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





