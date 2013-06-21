window.validar = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada que validar!'); },
    "JPluginCom",
    "isclaro",
    [str]
  );
};

window.enviarsms = function(str, strcod, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada que enviar!'); },
    "JPluginCom",
    "sendSMS",
    [str,strcod]
  );
};

window.validar2 = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada que validar 2!'); },
    "JPluginCom",
    "isclaro2",
    [str]
  );
};

window.obtenerdatos = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada para quien obtener!'); },
    "JPluginCom",
    "userphone",
    [str]
  );
};

window.tipoclaro = function(strnum, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada que averiguar!'); },
    "JPluginCom",
    "clarotype",
    [strnum]
  );
};

window.obtenerhistorial = function(strnum, strinicio, strfin, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada que averiguar!'); },
    "JPluginCom",
    "activatedpackagelist",
    [strnum,strinicio,strfin]
  );
};

window.obtenernumero = function(callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Error al obtener el número de telefono!'); },
    "JPluginCom",
    "devicenumber",
    []
  );
};

window.obtenertipo = function(callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Error al obtener el tipo de telefono!'); },
    "JPluginCom",
    "devicetype",
    []
  );
};

window.poneralarmas = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Error al registrar las alarmas!'); },
    "JPluginCom",
    "registeralarms",
    [str]
  );
};

window.quitaralarmas = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Error al registrar las alarmas!'); },
    "JPluginCom",
    "removealarms",
    [str]
  );
};