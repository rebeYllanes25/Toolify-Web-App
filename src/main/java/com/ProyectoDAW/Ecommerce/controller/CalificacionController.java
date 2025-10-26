package com.ProyectoDAW.Ecommerce.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.ProyectoDAW.Ecommerce.service.CalificacionService;

@RestController
@RequestMapping("/calificacion")
public class CalificacionController {


	@Autowired
    private CalificacionService calificacionService;


	@GetMapping("/verificar/{idPedido}")
    public ResponseEntity<Map<String, Boolean>> verificarCalificacion(@PathVariable Integer idPedido) {
        boolean yaCalificado = calificacionService.pedidoYaCalificado(idPedido);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("yaCalificado", yaCalificado);
        
        return ResponseEntity.ok(response);
    }
}
