package com.consumodedatos;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class JPluginCom extends CordovaPlugin {
	private enum Metodo {
		isclaro, sendSMS, isclaro2, userphone,clarotype,activatedpackagelist;
	}
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        
		Metodo met = Metodo.valueOf(action);
		String message = "";
		String num = "";
		
		switch(met) {
		    case isclaro:
		    	message = args.getString(0); 
	            this.isclaro(message, callbackContext);
		        break;
		    case sendSMS:
		    	num = args.getString(0); 
	            message = args.getString(1);
	            this.sendSMS(num, message, callbackContext);
		        break;
		    case isclaro2:
		    	message = args.getString(0); 
	            this.isclaro2(message, callbackContext);
		    	break;
		    case userphone:
		    	message = args.getString(0); 
	            this.obtenerdatos(message, callbackContext);
			    break;
		    case clarotype:
		    	message = args.getString(0); 
	            this.validarTelefono(message, callbackContext);
			    break;
		    case activatedpackagelist:
		    	num = args.getString(0); 
	            message = args.getString(1);
	            String message2 = args.getString(2);
	            this.obtenerHistorial(num, message, message2, callbackContext);
			    break;
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
	
	private void isclaro2(String message, CallbackContext callbackContext) {
		if (message != null && message.length() > 0) { 
            //callbackContext.success(message);
			ConsumoWSAvanzado consumir = new ConsumoWSAvanzado();
			String resultado = consumir.ValidarNumero2(message);
			//String resultado = consumir.Test();
			callbackContext.success(resultado);
        } else {
            callbackContext.error("Se esperaba un argumento no vacio.");
        }
    }
	
	private void obtenerdatos(String message, CallbackContext callbackContext) {
		if (message != null && message.length() > 0) { 
            //callbackContext.success(message);
			ConsumoWSAvanzado consumir = new ConsumoWSAvanzado();
			String resultado = consumir.ObtenerDatos(message);
			callbackContext.success(resultado);
        } else {
            callbackContext.error("Se esperaba un argumento no vacio.");
        }
    }
	
	private void validarTelefono(String message, CallbackContext callbackContext) {
		if (message != null && message.length() > 0) { 
            //callbackContext.success(message);
			ConsumoWSAvanzado consumir = new ConsumoWSAvanzado();
			String resultado = consumir.ValidarDispositivo(message);
			callbackContext.success(resultado);
        } else {
            callbackContext.error("Se esperaba un argumento no vacio.");
        }
    }
	
	private void obtenerHistorial(String num, String message, String message2, CallbackContext callbackContext) {
		if (message != null && message.length() > 0 && message2.length() > 0) { 
            //callbackContext.success(message);
			ConsumoWSAvanzado consumir = new ConsumoWSAvanzado();
			String resultado = consumir.ObtenerHistorial(num,message,message2);
			callbackContext.success(resultado);
        } else {
            callbackContext.error("Se esperaba un argumento no vacio.");
        }
    }
	
}
