package com.tfg.tpv.controller;

import com.tfg.tpv.config.JwtUtil;
import com.tfg.tpv.model.Usuario;
import com.tfg.tpv.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    //  CREAR USUARIO
    @PostMapping
    public Object crearUsuario(@RequestBody Usuario usuario) {

        Optional<Usuario> usuarioExistente =
                usuarioRepository.findByEmail(usuario.getEmail());

        if (usuarioExistente.isPresent()) {
            return "❌ El email ya existe";
        }

        return usuarioRepository.save(usuario);
    }

    //  LOGIN
    @PostMapping("/login")
    public Object login(@RequestBody Usuario usuarioLogin) {

        Optional<Usuario> usuarioBD;

        //  BUSCAR POR EMAIL
        usuarioBD =
                usuarioRepository.findByEmail(
                        usuarioLogin.getEmail()
                );

        //  SI NO EXISTE BUSCA POR NOMBRE
        if (usuarioBD.isEmpty()) {

            usuarioBD =
                    usuarioRepository.findByNombre(
                            usuarioLogin.getEmail()
                    );

        }

        if (usuarioBD.isEmpty()) {
            return "❌ Usuario no encontrado";
        }

        Usuario usuario = usuarioBD.get();

        if (!usuario.getPassword().equals(usuarioLogin.getPassword())) {
            return "❌ Contraseña incorrecta";
        }

        String token =
                jwtUtil.generateToken(
                        usuario.getEmail(),
                        usuario.getRol()
                );

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("token", token);
        respuesta.put("rol", usuario.getRol());
        respuesta.put("nombre", usuario.getNombre());

        return respuesta;
    }

    //  OBTENER USUARIOS
    @GetMapping
    public Object obtenerUsuarios() {
        return usuarioRepository.findAll();
    }
}