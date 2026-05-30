package com.tfg.tpv.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ✅ CORS DINÁMICO
        String origin = request.getHeader("Origin");

        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "*");

        String path = request.getServletPath();
        String method = request.getMethod();

        // ✅ PETICIONES OPTIONS
        if (method.equalsIgnoreCase("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // ✅ LOGIN LIBRE
        if (path.contains("/usuarios/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ CREAR USUARIO LIBRE
        if (path.equals("/usuarios")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ PRODUCTOS LIBRES (GET)
        if (path.contains("/productos") && method.equalsIgnoreCase("GET")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ PEDIDOS LIBRES (GET)
        if (path.contains("/pedidos") && method.equalsIgnoreCase("GET")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // ❌ SIN TOKEN
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Token requerido");
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractEmail(token);
            String rol = jwtUtil.extractRol(token);

            if (email == null || rol == null) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("❌ Token inválido");
                return;
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Token inválido");
            return;
        }

        filterChain.doFilter(request, response);
    }
}