package com.consumodedatos;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class JPluginCom extends CordovaPlugin {
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("isclaro")) {
            String message = args.getString(0); 
            this.isclaro(message, callbackContext);
            return true;
        }else if (action.equals("sendSMS")) {
            String num = args.getString(0); 
            String message = args.getString(1);
            this.sendSMS(num, message, callbackContext);
            return true;
        }
        return false;
    }
 
	private void isclaro(String message, CallbackContext callbackContext) {
		if (message != null && message.length() > 0) { 
            //callbackContext.success(message);
			ConsumoWSBasico consumir = new ConsumoWSBasico();
			String resultado = consumir.ValidarNumero(message);
			callbackContext.success(resultado);
        } else {
            callbackContext.error("Se esperaba un argumento no vacio.");
        }
    }
	
	private void sendSMS(String num, String message, CallbackContext callbackContext){
		if (num != null && num.length() > 0){
			if (message != null && message.length() > 0) { 
	            //callbackContext.success(message);
				ConsumoWSBasico consumir = new ConsumoWSBasico();
				String resultado = consumir.EnviarSMS(num, message);
				callbackContext.success(resultado);
	        } else {
	            callbackContext.error("Se esperaba un mensaje no vacio.");
	        }
		} else {
            callbackContext.error("Se esperaba un numero no vacio.");
        }
	}
}
