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
    // Namespace definido en el servicio web
    private static final String namespace = "http://tempuri.org/";
    // namespace + metodo
    private static final String accionSoap = "http://tempuri.org/IsClaro_Phone";
    // Fichero de definicion del servcio web
    private static final String url = "http://200.6.192.205/Send_SMS/Service1.asmx";
    //tag para interpretacion de xml 
    public static final String TAG = "Resultado";
	
	
	public String ValidarNumero(String numero){
    	try {
       	 
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo);
            //request.addProperty("Param", "valor"); // Paso parametros al WS
            request.addProperty("user", "c1@R025m5"); // Paso parametros al WS
            request.addProperty("pass", "5m52c1@R0"); // Paso parametros al WS
            request.addProperty("area", "502"); // Paso parametros al WS
            request.addProperty("phone", numero); // Paso parametros al WS
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap, sobre);
         
            // Resultado
            SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
         
            //Log.i("Resultado", resultado.toString());
            return resultado.toString();
         
        } catch (Exception e) {
            Log.e("ERROR", e.getMessage());
            return e.getMessage();
        }    	
    }
	
	public String EnviaCodigo(String numero){
    	return "";	
    }
}
