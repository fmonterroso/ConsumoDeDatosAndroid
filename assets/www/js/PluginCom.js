window.validar = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('¡Nada que validar!'); },
    "JPluginCom",
    "isclaro",
    [str]
  );
};