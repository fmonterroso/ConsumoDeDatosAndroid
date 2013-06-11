package com.consumodedatos;

import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import org.apache.cordova.*; 

public class Principal extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		//setContentView(R.layout.activity_principal);
		super.setIntegerProperty("loadUrlTimeoutValue", 60000); 
		super.onCreate(savedInstanceState);
		Configuracion.context = this;
		super.loadUrl("file:///android_asset/www/index.html"); //archivo de ventana principal (listado)		
	}


}
