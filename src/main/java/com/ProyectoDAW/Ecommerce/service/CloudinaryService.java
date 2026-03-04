package com.ProyectoDAW.Ecommerce.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

	
	@Autowired 
	Cloudinary cloudinary;
	
	//metodo para cargar la iamgen q viene desde plato y asignar al folder q hay 
	public String  upload(MultipartFile file, String carpeta) throws IOException //primero parametro la imagen q vamos a guardar segundo donde en q carpeta se guardara 
	{
		Map uploadResult = cloudinary.uploader().upload(file.getBytes(), //se manda en bytes la imagen 
				ObjectUtils.asMap("folder", carpeta)); //indicamos la referencia  carpeta madre(FOLDER) y en q carpeta se guardara 
		
		return uploadResult.get("secure_url").toString();
	}
	
}
