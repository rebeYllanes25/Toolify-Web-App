package com.ProyectoDAW.Ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

	
	 @Override
	 public void configureMessageBroker(MessageBrokerRegistry config) {
		 
		 /*
		 definimos esto ya q aca es donde se van a unir todos los 
		 "Usuarios" que se conecten a una conexion 
		 */
		 config.enableSimpleBroker("/topic");
	 
	 
		 /*
		  Definimos esta cofig ya que los usuarios atravez de esto podran
		  enviar alguna accion al servidor y este lo almacena y luego manda 
		  a todos los usuarios q estan en topic, por ejemplo si un usuario
		  manda un "Hola a todos" este mensaje lo manda a app y app luego manda 
		  a todos los usuarios que esten conectados a topic
		  */
		 config.setApplicationDestinationPrefixes("/app");
	 
		
	 }
	
	 
	 @Override
	 public void registerStompEndpoints(StompEndpointRegistry registry) {
		 
		 registry.addEndpoint("/ws")
		 		 .setAllowedOrigins(
		 				"http://localhost:8080",
		 				"https://toolify-web-app-api.onrender.com"
		 				 )
		 		 .withSockJS();	
	 }
}
