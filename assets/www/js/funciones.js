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
        if (versionplataforma != "1.0" && versionplataforma != "1.1" && versionplataforma != "1.5" && versionplataforma != "1.6" && versionplataforma != "2.0" && versionplataforma != "2.1"  && versionplataforma.substring(0,3) != "2.2" && versionplataforma.substring(0,3) != "2.3" ){
            //Version valida de Android
            
            //Codigo para Gaugue Chart
            rotarGaugeDatos(porcentaje);
            $("#progressbar").css( "height", "0px" );
        }else{
            //No es una version valida de Android
            //Codigo para grafico comun (proressbar)                                
            /*TolitoProgressBar('progressbar')
            .setOuterTheme('d')
            .setInnerTheme('b')
            .isMini(true)
            .setMax(100)
            .setStartFrom(porcentaje)
            .setInterval(50)
            .showCounter(true)
            .logOptions()
            .build();
            $("#totalpercentage").empty();
            $("#totalpercentage").append("100%"); */  
            var valoractual = porcentaje;
            valoractual = 80;
            rotarGaugeDatos(valoractual);
            $("#progressbar").css( "height", "0px" );         
        }
    }else{
        //No es Android

    }

    //conversion de fecha de vigencia
    $("#dateVigenciaDetalle").empty();
    if (bandera_paquete == "1"){
        fech = parseDate(vigencia);
        fech2 = new Date(fech);
        fech3 = mostrarFechaCompuesta(fech2);
        hora3 = mostrarHoraCompuesta(fech2);                            
        $("#dateVigenciaDetalle").append(fech3 + " a las " + hora3);
    }else
        $("#dateVigenciaDetalle").append("N/A");

    $("#txtimginc").empty();
    $("#txtimginc").append(mbtotales+" MB");
    $("#txtimgcons").empty();
    $("#txtimgcons").append(mbconsumidos+" MB");
    $("#mbConsumedBar").empty();
    $("#mbConsumedBar").append(mbconsumidos+"MB");
    
    var dispo = parseInt(mbtotales)-parseInt(mbconsumidos);
    $("#txtimgdisp").empty();
    $("#txtimgdisp").append(dispo+" MB");
    $("#txtimgporc").empty();
    $("#txtimgporc").append(porcentaje+"%");
    $("#mensajeMBDisp").empty();
    $("#mensajeMBDisp").append("Te quedan "+dispo+" MB de descarga");
    
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
    var message = "No se ha reconocido ningun número valido en tu dispositivo. ¿Quieres configurarlo en tu teléfono y volver a intentarlo o proceder y configurarlo dentro de la aplicación?";
    var title = "Confirmación de avance";

    //The first element of this list is the label for positive 
    var buttonLabels = "Proceder,Regresar";

    var callback = function(yes){
        if(yes){
            $.mobile.changePage("listado.html", { transition: "slide" });
        }else{
            navigator.app.exitApp();
        }
    };

    showConfirm(message, callback, buttonLabels, title);    
}

function showConfirm(message, callback, buttonLabels, title){
    //Set default values if not specified by the user.
    buttonLabels = buttonLabels || 'OK,Cancel';
    title = title || "Alerta";

    //Use Cordova version of the confirm box if possible.
    if(navigator.notification && navigator.notification.confirm){

            var _callback = function(index){
                if(callback){
                    callback(index == 1);
                }
            };

            navigator.notification.confirm(
                message,      // message
                _callback,    // callback
                title,        // title
                buttonLabels  // buttonName
            );

    //Default to the usual JS confirm method.
    }else{
        invoke(callback, confirm(message));
    }
}

function slideDownUp(id) {
  if(eventMenu === 'up') {
    $(id).slideUp('fast');
    eventMenu = 'down';
    $("ul#mainmenu").css( "height", 0);
  } else {
    $(id).slideDown('fast');
    eventMenu = 'up';
    $("ul#mainmenu").css( "height", $(window).height() + "px !important" );
    $("a.submenuitem").css( "width", $(window).width() + "px !important" );
  }
}

function rotarGaugeDatos(angulo) {
    var anguloGauge = ((gaugeDatos_totalA*angulo)/100)-57;
    jQuery('#porcentaje_gauge').html(angulo.toFixed(0)+'%');
    jQuery('#gauge_datos #gauge_pointer').rotate({
        duration: 10000,
        angle: gaugeDatos_inicio,
        animateTo: anguloGauge
    });
}


// Aqui se carga la funcion cuando se carga completament el arbol DOm de nuestra pagina index.html
$(document).ready(function(){

    $("body").on("click","#btnEditarNumeros",function(){
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
            $.mobile.changePage("configurar.html", { transition: "slide"});            
        }else{
            //abriendo listado
            numtelefonico = $(this).attr("numero");
            $.mobile.changePage("index.html", { transition: "slide"});
            //Consulta buscando el numero principal si no fue establecido al inicio             
            if (currentId == ""){
                //no se inserto un numero al inicio
                //realizando busqueda del principal
                consultaPrincipal();                    
            }else{
                consultaDatosPaquete();
            }
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
                    showAlert("Hubo un error al validar tu número de telefono. Verifica tu conexión a internet.","¡Validació fallida!","OK");
                    console.log("Error al validar número.");
                }else{
                    showAlert("El número ingresado no es un número Claro.","¡Número Inválido!","OK");//mensaje 1
                    console.log("El número ingresado no es un número Claro.");
                }
              }    		  
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
            showAlert("No has ingresado el código de confirmación.","Código Inválido","OK");
        return false;
    });

    $("body").on("click","#goDetalleComsumo",function(){
        $.mobile.changePage("detalleConsumo.html", { transition: "slide" });
        return false;
    });

    $("body").on("click","#btnEditarUsuario",function(){
        $.mobile.changePage("editarUsuario.html", { transition: "slide" });
        return false;
    });

    $("body").on("click","#btnGuardarUsuario",function(){
        //boton para actualizar los datos del usuario
        if ($.trim($("#user_name_edit").val()) != ""){
            actualizarUsuario();
            showAlert("Tus datos han sido actualizados correctamente.","Exito","OK");
            $.mobile.changePage("listado.html", { transition: "slide" });
        }else{
            showAlert("Debes escribir tu nombre.","Nombre Inválido","OK");
        }
        
        return false;
    });

    //Boton para ir a la pagina de configuracion de alarmas donde se pueden eliminar y agregar
    $("body").on("click","#btnEditarAlarmas",function(){
        $.mobile.changePage("configurar_alarma.html", { transition: "slide" });
        return false;
    });

    $("body").on("click","#btnGuardarAlarma",function(){
        //boton para actualizar los datos del usuario
        var numSeleccionado = $("#cmbNumeroTel option:selected").val();
        if (numSeleccionado != "-1"){
            agregarAlarma();
            showAlert("Tu alarma fue programada exitosamente.","¡Exito!","OK");
            consultarTelefonosAlarmasBD();
        }else{
            showAlert("Debes seleccionar un numero telefónico.","¡Número Inválido!","OK");
        }
        
        return false;
    });
    
    //funcion para hacer click en cada boton de eliminar alarma
    $("body").on("click",".eliminaralarma",function(){
        currentIdAlarm = $(this).attr("id");        
        if (currentIdAlarm != ""){
            var message = "Realmente deseas eliminar esta alarma";
            var title = "¿Eliminar Alarma?";

            //The first element of this list is the label for positive 
            var buttonLabels = "OK,Cancelar";

            var callback = function(yes){
                if(yes){
                    eliminarAlarma();
                    //showAlert("Tu alarma ha sido eliminada correctamente.","Exito","OK");                    
                    consultarTelefonosAlarmasBD();
                }
            };
            showConfirm(message, callback, buttonLabels, title); 
            
        }else{
            showAlert("Ocurrio un problema al elminar la alarma, inténtalo de nuevo.","Número Inválido","OK");
        }
        return false;
    });

    //funcion para hacer click en cada boton de eliminar alarma
    $("body").on("click",".eliminarnumero",function(){
        currentId = $(this).attr("id");
        if (currentId != ""){
            eliminarBD(currentId);
            showAlert("Tu número ha sido eliminado correctamente.","Exito","OK");
            //Actualizando listado
            consultarTelefonosBorarBD();
        }else
            showAlert("Ocurrio un problema al elminar el número, inténtalo de nuevo.","Número Inválido","OK");
        return false;
    });

    //funcion para hacer click en cada boton de eliminar alarma
    $("body").on("click",".establecerprincipal",function(){
        currentId = $(this).attr("id");
        if (currentId != ""){
            actualizarPrincipal();
            showAlert("Tu número ha sido establecido como principal.","Exito","OK");
            //Actualizando listado
            consultarTelefonosBorarBD();
        }else
            showAlert("Ocurrio un problema al establecer tu el número, inténtalo de nuevo.","Número Inválido","OK");
        return false;
    });

    //funcion para enviar un correo electronico
    $("body").on("click","#enviarCorreo",function(){
        var nombrecorreo = $("#txtNombreMensaje").val();
        var asunto = $("#txtAsunto").val();
        var cuerpocorreo = $("#txtAreaMensaje").val();

        if (nombrecorreo != "" && asunto != "" && cuerpocorreo != ""){
            window.plugins.emailComposer.showEmailComposerWithCallback(null,asunto,"Nombre: "+nombrecorreo+":<br/>"+cuerpocorreo,["fmonterroso.tpp@gmail.com"],[],[],true,[]);
            $("#txtNombreMensaje").val("");
            $("#txtAsunto").val("");
            $("#txtAreaMensaje").val("");
        }else
            showAlert("Debes completar los datos de tu mensaje.","Validación","OK");
        return false;
    });

    //funcion para abrir el link hacia fb
    $("body").on("click","#linkfb",function(){
        location.href="https://www.facebook.com/claroguatemala";
    });

    //funcion para abrir el link hacia twitter
    $("body").on("click","#linktwitter",function(){
        location.href="https://twitter.com/claroguatemala";
    });
    

//-----------------------Funciones del menu-------------
    $("body").on("click",".menuitemMenu",function(){
        
        return false;
    });

    //elementos del menu
    $("body").on("click",".menuitemHistorial",function(){
        $.mobile.changePage("detallePaquete.html", { transition: "slide" });
        return false;
    });
    $("body").on("click",".menuitemContacto",function(){
        $.mobile.changePage("contacto.html", { transition: "slide" });
        return false;
    });
    $("body").on("click",".menuitemTerminos",function(){
        $.mobile.changePage("terminos.html", { transition: "slide" });
        return false;
    });
    $("body").on("click",".menuitemSalir",function(){
        navigator.app.exitApp();
        return false;
    });

    
    $("body").on("click",".menuitemHome",function(){
        eventMenu = 'down';
        $.mobile.changePage("index.html", { transition: "slide" });
        //Consulta buscando el numero principal si no fue establecido al inicio             
        if (currentId == ""){
            //no se inserto un numero al inicio
            //realizando busqueda del principal
            consultaPrincipal();                    
        }else{
            consultaDatosPaquete();
        }
        return false;
    });

    $("body").on("click",".menuitemStore",function(){
        //alert("Iniciando");
        location.href="http://internet.claro.com.gt/";
        
        /*
        window.obtenertipo(function(echoValue) {
            console.log("El tipo reconocido es:"+echoValue);
            showAlert("El tipo del dispositivo reconocido es:"+echoValue,"Tipo","OK");
        });
        
        window.obtenernumero(function(echoValue) {
            console.log("El número reconocido es:"+echoValue);
            showAlert("El número del dispositivo reconocido es:"+echoValue,"Número","OK");
        });
        
        if(navigator.connection.type == Connection.NONE){
            // No tenemos conexión
            alert("No tenemos conexión");
        }else{
            // Si tenemos conexión
            alert("Si tenemos conexión");
        }
*/
        return false;
    });

    $("body").on("click",".menuitemConfig",function(){
        if($.mobile.activePage.attr('id') != 'Listado'){
            $.mobile.changePage("listado.html", { transition: "slide" });            
        }            
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
    showAlert("Error procesando SQL, cod:"+err.code+" desc: "+err.message,"Error Base de datos","OK");
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS alarms (idalarms INTEGER PRIMARY KEY AUTOINCREMENT, percentage INTEGER NOT NULL, state Varchar(15), idphone INTEGER REFERENCES phones(idphone) ON DELETE CASCADE)');
        //insertando usuario por defecto
        tx.executeSql('INSERT INTO user (name, email) VALUES (?,?)',["Usuario","No definido"],fcorrecto_insertUser_exe,errorCB);
        tx.executeSql('INSERT INTO terms_conditions (content) VALUES (?)',["REGLAMENTO DE APLICACIÓN 250,000 fans<br><br>PRIMERO: PROPIEDAD DE LA PROMOCIÓN<br><br>La presente Promoción pertenece en forma exclusiva a Personal CTE, S.A. de C.V., en adelante, el Patrocinador o CLARO EL SALVADOR. El presente documento (el Reglamento) establece los términos y condiciones aplicables a la promoción.<br><br>SEGUNDO: BENEFICIOS, LIMITACIONES<br>La presente es una Promoción EXCLUSIVApara:<br>(i) fans de la fanpage de CLARO El Salvador en Facebook que ingresen al Facebook de CLARO EL SALVADOR, (ii) que residan en El Salvador,  y (iii) que se hayan registrado correctamente en el link de la promoción, con su nombre, apellidos, DUI, fecha de nacimiento, sexo, lugar de residencia, correo electrónico y  número de teléfono fijo o móvil."]);
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
        showAlert("Debemos confirmar que éste número te pertenece, se enviará un código de confirmación a tu teléfono, luego escríbelo en la casilla inferior.","Envío de confirmación exitosa","OK");//mensaje 3
        consultarTelefonosBorarBD();
      }else{
        bandera_eliminar = "1";
        showAlert("Ocurrió un error al solicitar el código de confirmación, por favor inténtalo de nuevo más tarde.","Error en solicitud","OK");//mensaje 2
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
        var subelemento = "";        
        if (results.rows.item(i).principal){
            subelemento = '<span class="ui-li-count">'+results.rows.item(i).principal+'</span>';
        }
        var elemento = '<li class="number_element" id="'+results.rows.item(i).idphone+'" state="'+results.rows.item(i).state+'" numero="'+results.rows.item(i).number+'">'+'<h3>'+results.rows.item(i).number+'</h3><p>'+results.rows.item(i).type+': '+results.rows.item(i).state+'</p>'+subelemento+'</li>';
        $('#listado').append(elemento);
        $('#listado').listview('refresh');
    }

}

function fcorrecto_tran_cons() {
    console.log("Se consulto correctamente");
}


//---------Funcion para Eliminar un registro
function eliminarBD(cod){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    /*db.executePragmaStatement("PRAGMA foreign_keys = ON;", function(res) {
        alert("PRAGMA res: " + JSON.stringify(res));
    });
    */
    db.transaction(eliminar, errorCB, fcorrecto_tran_eli);
    return db;
}

//Funcion para eliminar un registro de la base de datos
function eliminar(tx){    
    tx.executeSql('SELECT idalarms FROM alarms WHERE idphone=?',[currentId],fcorrecto_removeralarmas,errorCB);    
}

function fcorrecto_removeralarmas(tx, results){
    var len = results.rows.length;
    var listaalarmas;
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).idalarms + ", porcentaje =  " + results.rows.item(i).percentage + ", idphone =  " + results.rows.item(i).idphone);
        listaalarmas = listaalarmas + results.rows.item(i).idalarms + ",";
        if (i!=(len-1))
            listaalarmas = listaalarmas + ",";
    }
    window.quitaralarmas(listaalarmas, function(echoValue) {
        //alert("valor devuelto:"+echoValue);
        console.log("se removieron con exito:");
    });    
    tx.executeSql('DELETE FROM alarms WHERE idphone=?',[currentId]);
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
        showAlert("El número ingresado ya esta registrado. Por favor ingresa otro.","¡Número Inválido!","OK")
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
        showAlert("El número ha sido asignado a tu aplicación de monitoreo de consumo de datos.","¡Confirmación exitosa!","OK")
        //Actualizando datos del registro
        tx.executeSql('UPDATE phones SET state = "ACTIVO", activation_date = date("now") WHERE idphone=?',[currentId]);

        //Actualizando listado y regresando
        $.mobile.changePage("listado.html", { transition: "slide" });

    }else{
        //El codigo no es correcto
        showAlert("El código de confirmación ingresado no es válido. Por favor verifica el mismo e intenta de nuevo.","¡Confirmación inválida!","OK")
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
                    }else if (t=="M"){
                        tipodispositivo = "MODEM";                                    
                    }else {
                        tipodispositivo = "NO DEFINIDO";
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
        //no hay numero principal, ni activos
        currentId = "";
        numtelefonico = "";
        if (bandera_existen_numeros == "1")
            $.mobile.changePage("listado.html", { transition: "slide" });
    }
}

function fcorrecto_tran_consultarPrin() {
    console.log("Se consulto en busca del principal correctamente.");
    //alert("Al final de todo el codigo a buscar es:"+currentId);    
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
    $("#user_email").empty();
    $("#user_name_listado").empty();
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " IDUser = " + results.rows.item(i).iduser + ", Nombre =  " + results.rows.item(i).name + ", Email =  " + results.rows.item(i).email);
        nombre_usuario = results.rows.item(i).name;
        $("#user_name").append(nombre_usuario);
        $("#user_email").append("&nbsp;"+results.rows.item(i).email);
        $("#user_name_edit").val(nombre_usuario);
        $("#user_email_edit").val(results.rows.item(i).email);
        $("#user_name_listado").append("&nbsp;"+nombre_usuario);
    }
}

function fcorrecto_tran_consUsua() {
    console.log("Se consulto el usuario correctamente.");
}


//---------Funcion para actualziar los datos del usuario
function actualizarUsuario(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(actualizarDatosUsuario, errorCB, fcorrecto_tran_ActualizarUsu);
    return db;    
}

//Funcion para actualizar los datos del usuario
function actualizarDatosUsuario(tx){
    var nombre = $("#user_name_edit").val();
    var correo = $("#user_email_edit").val();
    tx.executeSql('UPDATE user SET name = ?, email = ? ',[nombre,correo],fcorrecto_actualizarUsuario_exe,errorCB);
}

function fcorrecto_actualizarUsuario_exe(tx, results){
    if (results.rowsAffected) {
        console.log("Usuario actualizado con exito:"+results.rowsAffected);
        return false;
    }else{
        console.log("No se cambio el usuario.");
    }
}

function fcorrecto_tran_ActualizarUsu() {
    console.log("Se actualizo el usuario correctamente.");
}



//---------Funcion para obtener el listado de alarmas de la base de datos
function consultarAlarmasBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarAlarmas, errorCB, fcorrecto_tran_cons_alarm);
    return db;
}

//Funcion para consultar Alarmas de la base de datos
function consultarAlarmas(tx){
    tx.executeSql('SELECT alarms.*, phones.number as numero FROM alarms, phones WHERE alarms.idphone = phones.idphone',[],fcorrecto_cons_alarmas_exe,errorCB);    
}

function fcorrecto_cons_alarmas_exe(tx, results){
    console.log("Filas retornadas en tabla alarms = " + results.rows.length);
    var len = results.rows.length;
    $('.alarm_element').remove();
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).idalarms + ", Porcentaje =  " + results.rows.item(i).percentage + ", Estado =  " + results.rows.item(i).state + ", IdPhone =  " + results.rows.item(i).idphone);
        //Generando codigo html con listado de alarmas
        var elemento = '<li class="alarm_element" id="'+results.rows.item(i).idalarms+'" porcentaje="'+results.rows.item(i).percentage+'" numero="'+results.rows.item(i).numero+'" >'+'<h3>'+results.rows.item(i).percentage+'%</h3><p>Número:&nbsp;'+results.rows.item(i).numero+'</p></li>';
        $('#listado_alarmas').append(elemento);
        //$(".alarm_element#"+results.rows.item(i).idalarms).attr({"porcentaje":results.rows.item(i).percentage});//Agrega una atributo de percentage al elemento
        //$(".alarm_element#"+results.rows.item(i).idalarms).attr({"numero":results.rows.item(i).numero});//agregando atributo de numero para consultar mas facil
        $('#listado_alarmas').listview('refresh');
    }
}

function fcorrecto_tran_cons_alarm() {
    console.log("Se consulto alarmas correctamente");
}


//---------Funcion para insertar una alarma nueva
function agregarAlarma(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(insertarAlarma, errorCB, fcorrecto_tran_insertarAlarma);
    return db;    
}

//Funcion para insertar una alarma
function insertarAlarma(tx){
    var num = $("#cmbNumeroTel option:selected").val();
    var porcentaje = $("#txtporcentaje").val();
    tx.executeSql('INSERT INTO alarms (percentage,state,idphone) VALUES (?,?,?)',[porcentaje,"ACTIVA",num],fcorrecto_insertarAlarma_exe,errorCB);    
}

function fcorrecto_insertarAlarma_exe(tx, results){
    if (results.rowsAffected) {
        var newAlarm = results.insertId+","+$("#txtporcentaje").val()+","+$("#cmbNumeroTel option:selected").html();
        window.poneralarmas(newAlarm, function(echoValue) {
            //alert("valor devuelto:"+echoValue);
            console.log("se inserto con exito:"+results.rowsAffected);
        });
        return false;
    }else{
        console.log("No se guardo la alarma.");
    }
}

function fcorrecto_tran_insertarAlarma() {
    console.log("Se agrego la alarma correctamente.");
}



//---------Funcion para obtener el listado de numeros de la base de datos y ponerlos en un combo
function consultarTelefonosAlarmasBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultar_tels_alarms, errorCB, fcorrecto_tran_consTelsAlarms);
    return db;
}

//Funcion para consultar los numeros de la base de datos para un combo
function consultar_tels_alarms(tx){
    tx.executeSql('SELECT * FROM phones WHERE state=?',["ACTIVO"],fcorrecto_consultarTelsAlarms_exe,errorCB);    
}

function fcorrecto_consultarTelsAlarms_exe(tx, results){
    console.log("Filas retornadas en tabla phones = " + results.rows.length);
    var len = results.rows.length;
    $('.number_element_cmb').remove();
    var elemento = '<option class="number_element_cmb" data-placeholder="true" value="-1">-Selecciona-</option>';
    $('#cmbNumeroTel').append(elemento);
    $('#cmbNumeroTel').selectmenu("refresh");
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).idphone + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date + ", Principal =  " + results.rows.item(i).principal );
        //Generando codigo html con listado de telefonos
        var elemento = '<option class="number_element_cmb" value="'+results.rows.item(i).idphone+'" >'+results.rows.item(i).number+'</option>';
        $('#cmbNumeroTel').append(elemento);
        $('#cmbNumeroTel').selectmenu("refresh");
    }

    //recorrer alarmas
    tx.executeSql('SELECT alarms.*, phones.number as numero FROM alarms, phones WHERE alarms.idphone = phones.idphone',[],fcorrecto_consAlarms_exe,errorCB);       

}

function fcorrecto_consAlarms_exe(tx, results){
    console.log("Filas retornadas en tabla alarms = " + results.rows.length);
    var len = results.rows.length;
    $('.listado_alarmas_delete').remove();
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).idalarms + ", Porcentaje =  " + results.rows.item(i).percentage + ", Estado =  " + results.rows.item(i).state + ", IdPhone =  " + results.rows.item(i).idphone);
        //Generando codigo html con listado de alarmas
        var subelemento = '<span id="'+results.rows.item(i).idalarms+'" class="ui-li-count eliminaralarma"><img src="css/images/app/voteBasura.png" width="30"/><div>Eliminar</div></span>';
        //console.log("subelemto:"+subelemento);
        var elemento = '<li class="listado_alarmas_delete" >'+'<h3>'+results.rows.item(i).percentage+'%</h3><p>Número:&nbsp;'+results.rows.item(i).numero+'</p>'+subelemento+'</li>';
        //console.log("elemto:"+elemento);
        $('#listado_alarmas_config').append(elemento);
        $('#listado_alarmas_config').listview('refresh');
    }
    $('#listado_alarmas_config').listview('refresh');    
}

function fcorrecto_tran_consTelsAlarms() {
    console.log("Se consulto telefonos y alarmas correctamente");
}



//---------Funcion para eliminar una alarma nueva
function eliminarAlarma(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(deleteAlarma, errorCB, fcorrecto_tran_deleteAlarma);
    return db;    
}

//Funcion para insertar una alarma
function deleteAlarma(tx){
    tx.executeSql('DELETE FROM alarms WHERE idalarms=?',[currentIdAlarm],fcorrecto_deleteAlarma_exe,errorCB);
    window.quitaralarmas(currentIdAlarm, function(echoValue) {
        //alert("valor devuelto:"+echoValue);
        console.log("se removio la alarma con exito:");
    });    
}

function fcorrecto_deleteAlarma_exe(tx, results){
    if (results.rowsAffected) {
        console.log("Se Elimino con exito:"+results.rowsAffected);
        return false;
    }else{
        console.log("No se elimino la alarma.");
    }
}

function fcorrecto_tran_deleteAlarma() {
    console.log("Se borro la alarma correctamente.");

}



//---------Funcion para obtener el listado de numeros de la base de datos
function consultarTelefonosBorarBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarTelsDelete, errorCB, fcorrecto_tran_consTelsDelete);
    return db;
}

//Funcion para consultar los registros de la base de datos
function consultarTelsDelete(tx){
    tx.executeSql('SELECT * FROM phones',[],fcorrecto_consTelsDelete_exe,errorCB);    
}

function fcorrecto_consTelsDelete_exe(tx, results){
    console.log("Filas retornadas en tabla phones = " + results.rows.length);
    var len = results.rows.length;
    $('.number_element_delete').remove();
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).idphone + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date + ", Principal =  " + results.rows.item(i).principal );
        //Generando codigo html con listado de telefonos
        var subelmento = "";
        var clasePrincipal = "";
        if (results.rows.item(i).principal){
            subelmento = '<strong>('+results.rows.item(i).principal+')</strong>';
            clasePrincipal = "ui-disabled";
        }
        var elemento = '<li class="number_element_delete"><a href="#">'+'<h3>'+results.rows.item(i).number+' '+subelmento+'</h3><p>'+results.rows.item(i).type+': '+results.rows.item(i).state+' </p></a><span id="'+results.rows.item(i).idphone+'" class="ui-li-count eliminarnumero"><img src="css/images/app/voteBasura.png" width="30"/><div>Eliminar</div></span><a href="#" id="'+results.rows.item(i).idphone+'" data-rel="popup" data-position-to="window" class="establecerprincipal '+clasePrincipal+'">Establecer como principal</a></li>';
        $('#listado_nums_config').append(elemento);
        $('#listado_nums_config').listview('refresh');
    }
}

function fcorrecto_tran_consTelsDelete() {
    console.log("Se consulto numeros para eliminar correctamente");
}


//---------Funcion para actualizar el numero principal del usuario
function actualizarPrincipal(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(updatePrincipal, errorCB, fcorrecto_tran_actualizarPrincipal);
    return db;    
}

//Funcion para actualizar el numero
function updatePrincipal(tx){
    tx.executeSql('UPDATE phones SET principal=?',[""]);
    tx.executeSql('UPDATE phones SET principal=? WHERE idphone=?',["Principal",currentId],fcorrecto_updatePrincipal_exe,errorCB);
}

function fcorrecto_updatePrincipal_exe(tx, results){
    if (results.rowsAffected) {
        console.log("Se Actualizó con exito:"+results.rowsAffected);
        return false;
    }else{
        console.log("No se actualizó el principal.");
    }
}

function fcorrecto_tran_actualizarPrincipal() {
    console.log("Se actualizo el numero principal correctamente.");
}



//---------Funcion para consultar los datos del usuario
function consultaTerminosBD(){
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(consultarTerminos, errorCB, fcorrecto_tran_consTerms);
    return db;
}

//Funcion para consultar el usuario
function consultarTerminos(tx){
    tx.executeSql('SELECT * FROM terms_conditions LIMIT 1',[],fcorrecto_consultarTerminos_exe,errorCB);    
}

function fcorrecto_consultarTerminos_exe(tx, results){
    console.log("Cantidad de terminos retornadas:" + results.rows.length);
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        $("#terminos_condiciones").empty();
        $("#terminos_condiciones").append(results.rows.item(i).content);
    }
}

function fcorrecto_tran_consTerms() {
    console.log("Se consulto los terminos correctamente.");
}


//---------Funcion para remover alarmas disparadas de la base de datos
function quitarAlarmasDisparadas(lista){
    var lalarmas = lista.split(",");
    for(var i = 0; i < lalarmas.length; i++) {
        currentIdAlarm = lalarmas[i];
        if (currentIdAlarm != ""){
            eliminarAlarma();
            console.log("Eliminada alarma:"+currentIdAlarm);
        }else{
            console.log("Error al eliminar alarmas disparadas");
        }
    }    
}






//--------------------Funciones para manejo de XML--------------

//Parser de xml de respuesta para consultar datos del paquete de internet
function leerxml(texto){
    bandera_paquete = "0";    
    //alert(texto);
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
                        var original = parseFloat($(this).find('CONSUMOMB').text());
                        mbconsumidos = Math.round(original);
                    }
                    cont_paquetes++;
                    //return false;
               }
               
               //console.log("Paquete (NODE: "+cont_paquetes+") reconocido: vigencia="+$(this).find('FIN').text()+", MB consumidos="+$(this).find('CONSUMOMB').text()+", nombre="+$(this).find('NOMBRE').text()+", MB totales="+$(this).find('LIMITEDATOSMB').text()+", Banda="+$(this).find('BANDA').text()+", Codigo="+codigopaquete);               
            });
            
        });

    });
    return false;
}

//Parser de xml de respuesta para obtener el tipo de dispositivo (modem o telefono)
function leerxmltipodispositivo(texto){
    //Comenzamos a recorrer el xml
    var tipo = "NO DEFINIDO";
    $(texto).find("RESPONSE").each(function () {
        tipo = $(this).text();
        return false;
    });
    return tipo;
}





