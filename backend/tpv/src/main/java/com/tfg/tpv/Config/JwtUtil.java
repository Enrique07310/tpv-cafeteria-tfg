package com.tfg.tpv.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "clave_secreta_tfg_super_segura_123456";

    //  GENERAR TOKEN CON ROL
    public String generateToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol) //  ROL
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12)) //tiempo token expiracion
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();
    }

    //  EXTRAER EMAIL
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    //  EXTRAER ROL
    public String extractRol(String token) {
        return extractClaims(token).get("rol", String.class);
    }

    //  VALIDAR TOKEN
    public boolean validateToken(String token, String email) {
        return email.equals(extractEmail(token)) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())
                .parseClaimsJws(token)
                .getBody();
    }
}