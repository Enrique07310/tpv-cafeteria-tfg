package com.tfg.tpv.controller;

import com.tfg.tpv.config.JwtUtil;
import com.tfg.tpv.model.Usuario;
import com.tfg.tpv.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ LISTAR USUARIOS
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // ✅ CREAR USUARIO
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public Object login(@RequestBody Usuario usuario) {
        // ✅ LIMPIAR ESPACIOS
        String login = usuario.getEmail().trim();
        Optional<Usuario> usuarioBD;

        // ✅ SI ES EMAIL
        if (login.contains("@")) {
            usuarioBD = usuarioRepository.findByEmail(login);
        } else {
            // ✅ SI ES NOMBRE
            usuarioBD = usuarioRepository.findByNombre(login);
        }

        // ❌ USUARIO NO EXISTE
        if (usuarioBD.isEmpty()) {
            return "❌ Usuario no encontrado";
        }

        Usuario user = usuarioBD.get();

        // ❌ CONTRASEÑA INCORRECTA
        if (!usuario.getPassword().equals(user.getPassword())) {
            return "❌ Contraseña incorrecta";
        }

        // ✅ GENERAR TOKEN
        String token = jwtUtil.generateToken(user.getEmail(), user.getRol());

        return token;
    }
}