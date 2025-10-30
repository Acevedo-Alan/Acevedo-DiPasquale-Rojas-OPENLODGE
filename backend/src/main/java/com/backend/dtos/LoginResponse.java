package com.backend.dtos;

public class LoginResponse {
    private String token;
    private String username;
    private String nombre;
    private String rol;

    public LoginResponse(String token, String username, String nombre, String rol) {
        this.token = token;
        this.username = username;
        this.nombre = nombre;
        this.rol = rol;
    }

    // Getters y setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}