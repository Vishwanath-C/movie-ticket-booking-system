package com.example.MovieTicketBooking.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService
{
    @Value("${app.jwtSecret}")
    private String jwtSecret;

    /**
     * Generate JWT token for a given user.
     * The token includes user role and username.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", "")) // strip ROLE_ prefix
                .orElse("USER"); // fallback if none

        claims.put("role", role);

        return generateToken(claims, userDetails);
    }

    /**
     * Generate JWT token with additional claims.
     */
    public String generateToken(Map<String, Object> additionalClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(additionalClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUserName(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    /**
     * Check if the token has expired.
     */
    public boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    /**
     * Extract the username from the token.
     */
    public String extractUserName(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    /**
     * Extract the expiration date from the token.
     */
    public Date extractExpirationDate(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    /**
     * Extract the claims from the token.
     */
    private <T> T extractClaims(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parse the JWT token to extract claims.
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

//    private Key getSignInKey() {
//        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
}
