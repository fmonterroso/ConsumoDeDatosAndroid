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