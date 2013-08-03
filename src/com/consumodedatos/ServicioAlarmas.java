package com.consumodedatos;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import com.consumodedatos.R;
import com.consumodedatos.ServicioAlarmas;

import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

public class ServicioAlarmas extends Service {
	private Timer timer = new Timer();
	//private static final long UPDATE_INTERVAL = 1800000;
	private static final long UPDATE_INTERVAL = 25000;
	private final IBinder mBinder = new MyBinder();
	
	
	public void onCreate() {
		super.onCreate();
	 	pollForUpdates();
	}
	 
	 private void pollForUpdates() {
		 timer.scheduleAtFixedRate(new TimerTask() {
		   @Override
		   public void run() {
			   // consultamos el web service segun el arreglo de alarmas a verificar
			   Log.d("ServicioLocal", "Iniciando consulta");
			   String idalarm,porcentaje,numero;
			   LeerXML lector = new LeerXML();
			   //lector.leexml("", 0);
			   
			   for (int i=0;i<Configuracion.list.size();i++){
				   idalarm = Configuracion.list.get(i)[0];
				   porcentaje = Configuracion.list.get(i)[1];
				   numero = Configuracion.list.get(i)[2];
				   
				   if (Configuracion.blacklist.indexOf(idalarm)<0){
					   //No existe en la lista negra
					   Log.d("ServicioLocal", "Consultando alarma-> id:"+idalarm+" porcentaje:"+porcentaje+" numero:"+numero);
					   int porcentajeAlarma = Integer.parseInt(porcentaje);
					   ConsumoWSAvanzado ws = new ConsumoWSAvanzado();
					   String respuesta = ws.ObtenerDatos(numero);
					   boolean valida =  lector.leexml(respuesta, porcentajeAlarma);
					   if (valida){
						   notificar(numero,porcentaje);
						   //quitando alarma de la lista
						   Configuracion.blacklist.add(idalarm);
					   }
				   }
			   }
			   Log.d("ServicioLocal", "Terminando consulta");			  		   
		   }
	   	}, 0, UPDATE_INTERVAL);
	   	Log.i(getClass().getSimpleName(), "Timer started.");	 
	 }
	 
	 @Override
	 public void onDestroy() {
	  super.onDestroy();
	  if (timer != null) {
	   timer.cancel();
	  }
	  Log.i(getClass().getSimpleName(), "Timer stopped.");
	 
	 }
	 
	 @Override
	 public IBinder onBind(Intent arg0) {
	  return mBinder;
	 }
	 
	 public class MyBinder extends Binder {
		 ServicioAlarmas getService() {
	   return ServicioAlarmas.this;
	  }
	 }
		 
	 public void notificar(String num, String porce){
		 	//Toast.makeText(this, "Actualizdo", Toast.LENGTH_LONG).show();
		 	NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
				//Agregando el icono, texto y momento para lanzar la notificación
				int icon = R.drawable.ic_launcher;
				CharSequence tickerText = "Alerta de consumo de datos!!!";
				long when = System.currentTimeMillis();
				Notification notification = new Notification(icon, tickerText, when);
				Context context = getApplicationContext();
				CharSequence contentTitle = "Tienes menos del "+porce+"%";
				CharSequence contentText = "De tu paquete de datos en "+num;
				//Agregando sonido
				notification.defaults |= Notification.DEFAULT_SOUND;
				//Agregando vibración
				notification.defaults |= Notification.DEFAULT_VIBRATE;
				Intent notificationIntent = new Intent(this, ServicioAlarmas.class);
				PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);
				notification.setLatestEventInfo(context, contentTitle, contentText, contentIntent);
				mNotificationManager.notify(1, notification);
	 }
	
}
