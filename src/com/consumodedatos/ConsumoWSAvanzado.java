package com.consumodedatos;

import org.ksoap2.SoapEnvelope;
import org.ksoap2.serialization.SoapObject;
import org.ksoap2.serialization.SoapPrimitive;
import org.ksoap2.serialization.SoapSerializationEnvelope;
import org.ksoap2.transport.HttpTransportSE;
import org.w3c.dom.Document;

import android.util.Log;

public class ConsumoWSAvanzado {
	// Metodo que queremos ejecutar en el servicio web
    private static final String Metodo = "user_claro";
    private static final String Metodo2 = "test";
    private static final String Metodo3 = "user_phone";
    private static final String Metodo4 = "user_claro_type";
    private static final String Metodo5 = "user_phone_activated_package_list";
    // Namespace definido en el servicio web
    private static final String namespace = "http://internet.claro.com.gt/soap/ServiceBus/";
    // namespace + metodo
    private static final String accionSoap = "http://internet.claro.com.gt/sbus/bus.php/user_claro";
    private static final String accionSoap2 = "http://internet.claro.com.gt/sbus/bus.php/test";
    private static final String accionSoap3 = "http://internet.claro.com.gt/sbus/bus.php/user_phone";
    private static final String accionSoap4 = "http://internet.claro.com.gt/sbus/bus.php/user_claro_type";
    private static final String accionSoap5 = "http://internet.claro.com.gt/sbus/bus.php/user_phone_activated_package_list";
    // Fichero de definicion del servcio web
    private static final String url = "http://internet.claro.com.gt/sbus/bus.php?wsdl";
    //tag para interpretacion de xml 
    public static final String TAG = "Resultado";
	
	
	public String ValidarNumero2(String numero){
    	try {
       	    // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo);
            //Preparando parametro config necesario en todos los metodos:
            GenerarXML g = new GenerarXML();
            String d = g.generaDocumentoXML();
            Log.d("Visor", "config:"+d);
            request.addProperty("config", d); // Paso parametros al WS
            request.addProperty("country", "502"); // Paso parametros al WS
            request.addProperty("phone", numero); // Paso parametros al WS
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap, sobre);
            Log.d("Visor", "Respuesta Directa:"+sobre.getResponse());
         
            // Resultado
            //SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();            
         
            //Log.i("Resultado", resultado.toString());
            return sobre.getResponse().toString();
         
        } catch (Exception e) {
            Log.e("ERROR", e.getMessage());
            return e.getMessage();
        }    	
    }
	
	public String Test(){
    	try {
       	 
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo2);
            //request.addProperty("Param", "valor"); // Paso parametros al WS
            //request.addProperty("user", "c1@R025m5"); // Paso parametros al WS
            //request.addProperty("pass", "5m52c1@R0"); // Paso parametros al WS
            //request.addProperty("to_phone", numero); // Paso parametros al WS
            //request.addProperty("text", datos); // Paso parametros al WS
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap2, sobre);
         
            // Resultado
            Log.d("Visor de test", "Valor devuelto:"+sobre.getResponse());
            //SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
         
            //Log.i("Resultado", resultado.toString());
            return sobre.getResponse().toString();
         
        } catch (Exception e) {
            Log.e("ERROR", e.getMessage());
            return e.getMessage();
        }
    }
	
	public String ObtenerDatos(String numero){
    	try {
       	 
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo3);
            //Agregando parametros necesarios
            GenerarXML g = new GenerarXML();
            String d = g.generaDocumentoXML();
            Log.d("Visor", "config:"+d);
            request.addProperty("config", d); // Paso parametros al WS
            request.addProperty("country", "502"); // Paso parametros al WS
            request.addProperty("phone", numero); // Paso parametros al WS
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap3, sobre);
         
            // Resultado
            Log.d("Visor de obtiene datos", "Datos: "+sobre.getResponse());
            //SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
         
            //Log.i("Resultado", resultado.toString());
            return sobre.getResponse().toString();
         
        } catch (Exception e) {
            Log.e("ERROR", e.getMessage());
            return e.getMessage();
        }
    }
	
	public String ValidarDispositivo(String numero){
    	try {
       	 
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo4);
            //Agregando parametros necesarios
            GenerarXML g = new GenerarXML();
            String d = g.generaDocumentoXML();
            //Log.d("Visor", "config:"+d);
            request.addProperty("config", d); // Paso parametros al WS
            request.addProperty("country", "502"); // Paso parametros al WS
            request.addProperty("phone", numero); // Paso parametros al WS
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap4, sobre);
         
            // Resultado
            //Log.d("Visor de obtiene datos", "Datos: "+sobre.getResponse());
            //SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
         
            //Log.i("Resultado", resultado.toString());
            return sobre.getResponse().toString();
         
        } catch (Exception e) {
            Log.e("ERROR", e.getMessage());
            return e.getMessage();
        }
    }
	
	public String ObtenerHistorial(String numero, String inicio, String fin){
    	try {
       	 
            // Modelo el request
            SoapObject request = new SoapObject(namespace, Metodo5);
            //Agregando parametros necesarios
            GenerarXML g = new GenerarXML();
            String d = g.generaDocumentoXML();
            Log.d("Visor", "config:"+d);
            request.addProperty("config", d); // Paso parametros al WS
            request.addProperty("country", "502"); // Paso parametros al WS
            request.addProperty("phone", numero); // Paso parametros al WS
            request.addProperty("start", inicio); // Paso parametros al WS
            request.addProperty("end", fin); // Paso parametros al WS
            
            // Modelo el Sobre
            SoapSerializationEnvelope sobre = new SoapSerializationEnvelope(SoapEnvelope.VER11);
            sobre.dotNet = true;
            sobre.setOutputSoapObject(request);
         
            // Modelo el transporte
            HttpTransportSE transporte = new HttpTransportSE(url);
         
            // Llamada
            transporte.call(accionSoap5, sobre);
         
            // Resultado
            Log.d("Visor de obtiene historial", "Datos: "+sobre.getResponse());
            //SoapPrimitive resultado = (SoapPrimitive) sobre.getResponse();
         
            //Log.i("Resultado", resultado.toString());
            return sobre.getResponse().toString();
         
        } catch (Exception e) {
            Log.e("ERROR", e.getMessage());
            return e.getMessage();
        }
    }
	
	
}
