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