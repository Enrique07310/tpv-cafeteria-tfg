package com.tfg.tpv.controller;

import com.tfg.tpv.model.LineaPedido;
import com.tfg.tpv.model.Pedido;
import com.tfg.tpv.model.Producto;
import com.tfg.tpv.repository.PedidoRepository;
import com.tfg.tpv.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // ✅ CREAR PEDIDO
    @PostMapping
    public Object crearPedido(@RequestBody Pedido pedido) {

        double total = 0;

        for (LineaPedido linea : pedido.getLineas()) {

            Producto producto = productoRepository
                    .findById(linea.getProducto().getId())
                    .orElse(null);

            if (producto == null) {
                return "Producto no encontrado";
            }

            if (producto.getStock() < linea.getCantidad()) {
                return "Stock insuficiente para " + producto.getNombre();
            }

            double subtotal =
                    producto.getPrecio() * linea.getCantidad();

            linea.setSubtotal(subtotal);

            total += subtotal;

            // ✅ DESCONTAR STOCK
            producto.setStock(
                    producto.getStock() - linea.getCantidad()
            );

            productoRepository.save(producto);
        }

        pedido.setTotal(total);

        // ✅ GUARDAR FECHA
        pedido.setFecha(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }

    // ✅ OBTENER TODOS LOS PEDIDOS
    @GetMapping
    public List<Pedido> obtenerPedidos() {
        return pedidoRepository.findAll();
    }

    // ✅ OBTENER PEDIDO POR ID
    @GetMapping("/{id}")
    public Object obtenerPedidoPorId(@PathVariable Long id) {

        Pedido pedido =
                pedidoRepository.findById(id).orElse(null);

        if (pedido == null) {
            return "Pedido no encontrado";
        }

        return pedido;
    }

    // ✅ ELIMINAR PEDIDO
    @DeleteMapping("/{id}")
    public Object eliminarPedido(@PathVariable Long id) {

        Pedido pedido =
                pedidoRepository.findById(id).orElse(null);

        if (pedido == null) {
            return "Pedido no encontrado";
        }

        pedidoRepository.deleteById(id);

        return "Pedido eliminado";
    }

    // ✅ BORRAR TODOS LOS PEDIDOS
    @DeleteMapping("/borrar")
    public String borrarPedidos() {

        pedidoRepository.deleteAll();

        return "Pedidos borrados";
    }
}