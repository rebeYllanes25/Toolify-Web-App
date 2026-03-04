package com.ProyectoDAW.Ecommerce.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

	
	@Bean
	public Cloudinary cloudinary() {
		Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dheqy208f");
        config.put("api_key", "363588895158239");
        config.put("api_secret", "-_4sDzSGv2hFByfqw90xw4FyhQo");
        return new Cloudinary(config);
	}
	
}
