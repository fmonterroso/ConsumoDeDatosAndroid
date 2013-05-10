window.validar = function(str, callback) {
  cordova.exec(
    callback,
    function(err) { callback('Nothing to validate.'); },
    "JPluginCom",
    "isclaro",
    [str]
  );
};