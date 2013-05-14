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
            showAlert("El número ingresado SI es un número Claro.","Número Correcto","OK");
            
            showAlert("Empezando la insersion.","Insercion","OK");
            insertarBD();
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

//-------------------------------------Funciones de persistencia de datos------------------------------------

function errorCB(err) {
    alert("Error procesando SQL: "+err.code);
}

function abrirBD(){
    //var dbShell = window.openDatabase(name, version, display_name, size);
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(iniciar, errorCB, fcorrecto_transac);

    //Recorrer datos y mostrar


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
        tx.executeSql('CREATE TABLE IF NOT EXISTS phones (id INTEGER PRIMARY KEY AUTOINCREMENT, number Varchar(20), state Varchar(10), code Varchar(100), register_date DATETIME, activation_date DATETIME)');
        console.log("Se creo la base de datos correctamente");
        return true;
    }else{
        console.log("NO SE crea la base de datos");
        //Pruebas:
        //tx.executeSql('INSERT INTO phones (number, state, code, register_date, activation_date ) VALUES ("55383563","0","12345","13/05/13","13/05/13")');
        tx.executeSql('SELECT * FROM phones',[],fcorrecto_prue,errorCB);
        return false;
    }
}

function fcorrecto_prue(tx, results){
    console.log("Filas retornadas en phones = " + results.rows.length);
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        console.log("Fila = " + i + " ID = " + results.rows.item(i).id + ", Numero =  " + results.rows.item(i).number + ", Estado =  " + results.rows.item(i).state + ", Codigo =  " + results.rows.item(i).code + ", Fecha de Ingreso =  " + results.rows.item(i).register_date + ", Fecha de Activacion =  " + results.rows.item(i).activation_date );
    }
}

function fcorrecto_transac() {
    alert("Correcto verificar!");
}







function populateDB(tx) {
     //tx es un objeto de tipo SQLTransaction que es pasado a este metodo desde el metodo transaction del objeto Database
     tx.executeSql('DROP TABLE IF EXISTS DEMO');
     tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
     tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Primera fila")');
     tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Segunda fila")');
}



//------ Insert a la base de datos
function insertarBD(){
    //var dbShell = window.openDatabase(name, version, display_name, size);
    var db = window.openDatabase("user_phones", "1.0", "Prueba DB", 3000000);
    db.transaction(insertar, errorCB, fcorrecto_tran_insert);
    
    return db;
}

function insertar(tx){
    //realizando inserts
    tx.executeSql('INSERT INTO phones (number, state, code, register_date, activation_date ) VALUES (?,?,?,date("now"),date("now"))',[$("#phone").val(),"0","123456789"],fcorrecto_insert_exe,errorCB);

}   

function fcorrecto_insert_exe(tx, results){
    console.log("Se inserto correctamente!");
}

function fcorrecto_tran_insert(){
    alert("Correcto insertar!");
}




function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

// Función 'callback' con el resultado de la consulta
//
function querySuccess(tx, results) {
    console.log("Filas retornadas = " + results.rows.length);
    // this will be true since it was a select statement and so rowsAffected was 0
    if (!results.rowsAffected) {
        console.log('Ninguna fila afectada!');
        return false; //impide que avance pues el siguiente log dara error pues ese atributno no esta definido al no haber filas afectadas
    }
    // for an insert statement, this property will return the ID of the last inserted row
    console.log("ID de la ultima fila insertada = " + results.insertId);
}