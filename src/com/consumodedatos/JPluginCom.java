package com.consumodedatos;

import java.util.List;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.consumodedatos.ServicioAlarmas;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.telephony.TelephonyManager;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.Toast;


public class JPluginCom extends CordovaPlugin {
	private enum Metodo {
		isclaro, sendSMS, isclaro2, userphone,clarotype,activatedpackagelist,devicenumber,devicetype,registeralarms,removealarms;
	}
	Context mContext;
	private ServicioAlarmas servicio;
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        
		Metodo met = Metodo.valueOf(action);
		String num, message, alarmas = "";
		
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
		    case devicenumber:
		    	this.numero_dispositivo(callbackContext);
			    break;
		    case devicetype:
		    	this.tipo_dispositivo(callbackContext);
			    break;
		    case registeralarms:
		    	alarmas = args.getString(0);
		    	this.registrar_alarmas(alarmas, callbackContext);
			    break;
		    case removealarms:
		    	alarmas = args.getString(0);
		    	this.remover_alarmas(alarmas, callbackContext);
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
	
	private void numero_dispositivo(CallbackContext callbackContext) {
		TelephonyManager mTelephonyManager;
		mTelephonyManager = (TelephonyManager) Configuracion.context.getSystemService(Context.TELEPHONY_SERVICE);
		callbackContext.success(mTelephonyManager.getLine1Number());
    }
	
	private void tipo_dispositivo(CallbackContext callbackContext){
		boolean tabletSize = Configuracion.context.getResources().getBoolean(R.bool.isTablet);
		if (tabletSize) {
		    // do something
			callbackContext.success("TABLET");
		} else {
		    // do something else
			callbackContext.success("SMARTPHONE");
		}
		
		/*
		DisplayMetrics metrics = new DisplayMetrics();
		Configuracion.context.getWindowManager().getDefaultDisplay().getMetrics(metrics);
		int width = metrics.widthPixels;
		int height = metrics.heightPixels;
		
		float yInches= metrics.heightPixels/metrics.ydpi;
		float xInches= metrics.widthPixels/metrics.xdpi;
		
		if (width > 1023 || height > 599){
		   //code for big screen (like tablet)
			callbackContext.success("TABLET");
		}else{
		   //code for small screen (like smartphone)
			callbackContext.success("SMARTPHONE");
		}
		*/
	}
	
	private void registrar_alarmas(String numeros, CallbackContext callbackContext) {
		Log.d("ServicioLocal", "Agregando:"+numeros);		
		String[] alarms = numeros.split(",");
		for (int i=0;i<alarms.length;i=i+3){
			String[] alarm = {alarms[i],alarms[i+1],alarms[i+2]};
			Configuracion.list.add(alarm);
		}
		callbackContext.success("EXITO");
    }
	
	private void remover_alarmas(String numeros, CallbackContext callbackContext) {
		Log.d("ServicioLocal", "Eliminando:"+numeros);		
		String[] alarms = numeros.split(",");
		for (int i=0;i<alarms.length;i++){
			Configuracion.blacklist.add(alarms[i]);			
		}		
		callbackContext.success("EXITO");
    }	

}
