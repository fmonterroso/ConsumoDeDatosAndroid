package com.consumodedatos;

import java.io.ByteArrayOutputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Text;
import java.io.*;
import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;




public class GenerarXML {
	
	public String generaDocumentoXML() {
	    try {
	        // 1. Crear objeto DocumentBuilderFactory
	        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
	        // 2. A partir del objeto DocumentBuilderFactory crear un objeto DocumentBuilder
	        DocumentBuilder docBuilder = dbFactory.newDocumentBuilder();
	        // 3. Generar el documento XML
	        Document documentoXML = docBuilder.newDocument();
	        
	        // 4. Crear el elemento "descargas"
		    Element root = documentoXML.createElement("DATA");
		    //descarga = documentoXML.createElement(TAG_DESCARGAS);
		    
		    Element appid = documentoXML.createElement("APPID");
		    Text txtappid = documentoXML.createTextNode("kHAjOqyMwNKioBFRpv15");
		    //											fjtw74gTUGDIkNxdPSel
		    appid.appendChild(txtappid);
		    		    
		    Element appsecret = documentoXML.createElement("APPSECRET");
		    Text txtappsecret = documentoXML.createTextNode("c4qGiuEU71m35SNrVjzgxpnZ6TPMQfbt2eC8saHk");
		    //												GTNwiZ2nQfp1DWsrbj67IMRdFctJ4Le5YOKozVPE
		    appsecret.appendChild(txtappsecret);
		    
		    Element lang = documentoXML.createElement("LANG");
		    Text txtlang = documentoXML.createTextNode("es");
		    lang.appendChild(txtlang);
		    
		    
		    root.appendChild(appid);
		    root.appendChild(appsecret);
		    root.appendChild(lang);
		    
		    
		    // 5. Agregar al documento principal
		    documentoXML.appendChild(root);
		    /*
		    documentoXML.appendChild(appid);
		    documentoXML.appendChild(appsecret);
		    documentoXML.appendChild(lang);
		    */
		    
		    String docstring = getStringFromDocument(documentoXML);
	        
		    return docstring;
	    } catch (Exception e) {
	        System.out.println("Error : " + e);
	        return null;
	    }
	    
	}
	
	//method to convert Document to String
	public String getStringFromDocument(Document doc)
	{
	    try
	    {
	       DOMSource domSource = new DOMSource(doc);
	       StringWriter writer = new StringWriter();
	       StreamResult result = new StreamResult(writer);
	       TransformerFactory tf = TransformerFactory.newInstance();
	       Transformer transformer = tf.newTransformer();
	       transformer.transform(domSource, result);
	       return writer.toString();
	    }
	    catch(TransformerException ex)
	    {
	       ex.printStackTrace();
	       return null;
	    }
	} 
	
}
