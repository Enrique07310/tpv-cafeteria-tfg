package com.tfg.tpv.controller;

import com.tfg.tpv.model.Producto;
import com.tfg.tpv.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    // ✅ OBTENER TODOS
    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoRepository.findAll();
    }

    // ✅ OBTENER PRODUCTO POR ID
    @GetMapping("/{id}")
    public Object obtenerProducto(@PathVariable Long id) {

        Optional<Producto> producto = productoRepository.findById(id);

        if (producto.isEmpty()) {
            return "Producto no encontrado";
        }

        return producto.get();
    }

    // ✅ CREAR PRODUCTO
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    // ✅ ACTUALIZAR PRODUCTO
    @PutMapping("/{id}")
    public Object actualizarProducto(
            @PathVariable Long id,
            @RequestBody Producto productoActualizado
    ) {

        Optional<Producto> productoBD =
                productoRepository.findById(id);

        if (productoBD.isEmpty()) {
            return "Producto no encontrado";
        }

        Producto producto = productoBD.get();

        producto.setNombre(productoActualizado.getNombre());
        producto.setPrecio(productoActualizado.getPrecio());
        producto.setStock(productoActualizado.getStock());

        return productoRepository.save(producto);
    }

    // ✅ ELIMINAR PRODUCTO
    @DeleteMapping("/{id}")
    public Object eliminarProducto(@PathVariable Long id) {

        Optional<Producto> producto =
                productoRepository.findById(id);

        if (producto.isEmpty()) {
            return "Producto no encontrado";
        }

        productoRepository.deleteById(id);

        return "Producto eliminado";
    }
}