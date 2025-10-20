package com.ProyectoDAW.Ecommerce.util;

import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        
        String path = request.getServletPath();
        
        // ✅ Rutas públicas: continuar sin validar token
        if ("/auth/login".equals(path) || 
            "/cliente/index".equals(path) || 
            "/cliente/producto".equals(path)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // ✅ Extraer token si existe
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            
            if (!token.isBlank()) {
                try {
                    username = jwtUtil.obtenerUsuarioAndToken(token);
                    System.out.println("🔍 JwtFilter - Username extraído: " + username);
                } catch (io.jsonwebtoken.JwtException e) {
                    System.err.println("❌ JwtFilter - Token inválido: " + e.getMessage());
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Token JWT inválido");
                    return;
                }
            }
        }

        // ✅ Si hay username válido, autenticar
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                System.out.println("🔍 JwtFilter - Usuario cargado: " + userDetails.getUsername());
                System.out.println("🔍 JwtFilter - Authorities:");
                userDetails.getAuthorities().forEach(a -> 
                    System.out.println("   - " + a.getAuthority())
                );

                if (jwtUtil.validarToken(token)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                userDetails, 
                                null, 
                                userDetails.getAuthorities()
                            );
                    
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ JwtFilter - Autenticación establecida para: " + username);
                } else {
                    System.err.println("❌ JwtFilter - Token no válido");
                }
            } catch (Exception e) {
                System.err.println("❌ JwtFilter - Error al cargar usuario: " + e.getMessage());
            }
        }

        // ✅ Continuar con la cadena de filtros (CRÍTICO)
        chain.doFilter(request, response);
    }
}