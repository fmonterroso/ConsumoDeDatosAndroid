package com.consumodedatos;

import org.ksoap2.SoapEnvelope;
import org.ksoap2.serialization.SoapObject;
import org.ksoap2.serialization.SoapPrimitive;
import org.ksoap2.serialization.SoapSerializationEnvelope;
import org.ksoap2.transport.HttpTransportSE;

import android.util.Log;

public class ConsumoWSBasico {
	// Metodo que queremos ejecutar en el servicio web
    private static final String Metodo = "IsClaro_Phone";
    private static final String Metodo2 = "Send_SMS";
    // Namespace definido en el servicio web
    private static final String namespace = "http://tempuri.org/";
    // namespace + metodo
    private static final String accionSoap = "http://tempuri.org/IsClaro_Phone";
    private static final String accionSoap2 = "http://tempuri.org/Send_SMS";
    // Fichero de definicion del servcio web
    private static final String url = "http://200.6.192.205/Send_SMS/Service1.asmx";
    //tag para interpretacion de xml 
    public static final String TAG = "Resultado";
	
	
	public String ValidarNumero(String numero){
    	try {
    		Log.i("proceso", "INICIANDO, namespace:"+namespace+" Metodo:"+Metodo);
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo);
            //request.addProperty("Param", "valor"); // Paso parametros al WS
            request.addProperty("user", "c1@R025m5"); // Paso parametros al WS
            request.addProperty("pass", "5m52c1@R0"); // Paso parametros al WS
            request.addProperty("area", "502"); // Paso parametros al WS
            request.addProperty("phone", numero); // Paso parametros al WS
            //Log.i("proceso", "Parametros agregados, numero:"+numero);
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
            Log.i("proceso", "sobre preparado");
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            //Log.i("proceso", "Antes de llamada. actionSoap:"+accionSoap+" sobre:"+sobre);
            
            transporte.call(accionSoap, sobre);
         
            // Resultado
            //Log.i("proceso", "Resultado RAW:"+sobre.getResponse());
            SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
            //Log.i("proceso", "Resultado parseado string:"+resultado.toString());
         
            //Log.i("Resultado", resultado.toString());            
            return resultado.toString();         
        } catch (Exception e) {
        	String err = (e.getMessage()==null)?"SD Card failed":e.getMessage();
        	Log.e("ERROR", err);
            //return e.getMessage();
            return "ERROR";
        }    	
    }
	
	public String EnviarSMS(String numero, String datos){
    	try {
    		Log.i("proceso", "INICIANDO");
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo2);
            //request.addProperty("Param", "valor"); // Paso parametros al WS
            request.addProperty("user", "c1@R025m5"); // Paso parametros al WS
            request.addProperty("pass", "5m52c1@R0"); // Paso parametros al WS
            request.addProperty("to_phone", numero); // Paso parametros al WS
            request.addProperty("text", datos); // Paso parametros al WS
            //Log.i("proceso", "Parametros agregados");
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
            //Log.i("proceso", "sobre preparado");
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap2, sobre);
         
            // Resultado
            //Log.i("proceso", "Resultado RAW:"+sobre.getResponse());
            SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
            //Log.i("proceso", "Resultado parseado string:"+resultado.toString());
         
            //Log.i("Resultado", resultado.toString());
            return resultado.toString();
         
        } catch (Exception e) {
        	String err = (e.getMessage()==null)?"SD Card failed":e.getMessage();
        	Log.e("ERROR", err );
            //return e.getMessage();
            return "ERROR";
        }
    }	
}
