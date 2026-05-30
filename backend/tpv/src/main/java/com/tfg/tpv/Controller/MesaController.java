package com.tfg.tpv.controller;

import com.tfg.tpv.model.Mesa;
import com.tfg.tpv.repository.MesaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;

    // OBTENER TODAS
    @GetMapping
    public List<Mesa> obtenerMesas() {
        return mesaRepository.findAll();
    }

    // CREAR MESA
    @PostMapping
    public Mesa crearMesa(
            @RequestBody Mesa mesa
    ) {
        return mesaRepository.save(mesa);
    }

    // ELIMINAR MESA
    @DeleteMapping("/{id}")
    public Object eliminarMesa(
            @PathVariable Long id
    ) {

        Optional<Mesa> mesa =
                mesaRepository.findById(id);

        if (mesa.isEmpty()) {
            return "Mesa no encontrada";
        }

        mesaRepository.deleteById(id);

        return "Mesa eliminada";
    }
}