package com.consumodedatos;

import java.io.ByteArrayInputStream;
import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import android.util.Log;

public class LeerXML {
	
	public boolean leexml(String texto, int porcentajelimite){
		String codigopaquete = ""; 
		String mbtotales = "";
		String mbconsumidos = "";
		int cont_paquetes = 0;
		
		try {
			DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder docBuilder = docBuilderFactory.newDocumentBuilder();
			Document doc = docBuilder.parse(new InputSource(new ByteArrayInputStream(texto.getBytes("utf-8"))));			
			doc.getDocumentElement ().normalize ();
			
			NodeList listaPaqueteCuenta = doc.getElementsByTagName("PAQUETECUENTA");
			int totalPaqueteCuenta = listaPaqueteCuenta.getLength();			 
			for (int i = 0; i < totalPaqueteCuenta ; i ++) {
				Node paqueteCuenta = listaPaqueteCuenta.item(i);
				if (paqueteCuenta.getNodeType() == Node.ELEMENT_NODE){
					NodeList listaNodos = paqueteCuenta.getChildNodes();			 
					int totalNodos = listaNodos.getLength();					
					//Recorriendo los NODE de todo el xml
					for (int j = 0; j < totalNodos ; j ++) {
						Node nodo = listaNodos .item(j);
						if (nodo.getNodeName().equalsIgnoreCase("NODE")){
							NodeList listaElementosNodo = nodo.getChildNodes();
							int totalElementosNodo = listaElementosNodo.getLength();
							codigopaquete = "";
							//recorriendo los elementos internos del tag NODE
							for (int en = 0; en < totalElementosNodo ; en ++) {
								Node paquete = listaElementosNodo.item(en);
								if (paquete.getNodeName().equalsIgnoreCase("PAQUETE")){
									NodeList listaElementosPaquete = paquete.getChildNodes();
									int totalElementosPaquete = listaElementosPaquete.getLength();
									Element elemento = (Element) paquete;
									codigopaquete = getTagValue("CODIGO",elemento );
									Log.d("LectorXML", "Codigo : "+ codigopaquete);
									if (!codigopaquete.equalsIgnoreCase("1")){
				                        if (cont_paquetes<1){
				                            mbtotales = getTagValue("LIMITEDATOSMB",elemento );
				                            Log.d("LectorXML", "Limite MB : "+ mbtotales);
				                        }
				                    }
								}
							}
							if (!codigopaquete.equalsIgnoreCase("1")){
			                    if (cont_paquetes<1){
			                    	Element elemento = (Element) nodo;
			                    	mbconsumidos = getTagValue("CONSUMOMB",elemento );
			                    	Log.d("LectorXML", "Consumo MB : "+ mbconsumidos);
			                    }
			                    cont_paquetes++;
			               }
						}
					}
				}
			}
			//Fin de parseo de XML
			//Calculando porcentaje
			if (cont_paquetes>0){
				float mbtotalesflo = Float.parseFloat(mbtotales);
				float mbconsumidosflo = Float.parseFloat(mbconsumidos);
				
				int porcentaje = Math.round(100-(mbconsumidosflo*100)/mbtotalesflo);
				
				Log.d("LectorXML", "Limite final MB : "+ mbtotalesflo);
				Log.d("LectorXML", "Consumo final MB : "+ mbconsumidosflo);
				Log.d("LectorXML", "Porcentaje calculado: "+ porcentaje);
				Log.d("LectorXML", "Porcentaje limite : "+ porcentajelimite);
				
				return (porcentaje < porcentajelimite);
			}else
				return false;
			
		} catch (Exception e) {
			String err = (e.getMessage()==null)?"SD Card failed":e.getMessage();
			Log.d("LectorXML", "Error : "+ err);
	        return false;
	    }		
	}
	
	public String getTagValue(String tag, Element elemento) {
		NodeList lista = elemento.getElementsByTagName(tag).item(0).getChildNodes();
		Node valor = (Node) lista.item(0);
		return valor.getNodeValue();		 
	}	
}
