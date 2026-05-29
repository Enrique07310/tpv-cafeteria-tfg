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
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    //  CREAR PEDIDO
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

            double subtotal = producto.getPrecio() * linea.getCantidad();

            linea.setSubtotal(subtotal);

            total += subtotal;

            //  DESCONTAR STOCK
            producto.setStock(producto.getStock() - linea.getCantidad());

            productoRepository.save(producto);
        }

        pedido.setTotal(total);

        //  GUARDAR FECHA
        pedido.setFecha(LocalDateTime.now());

        return pedidoRepository.save(pedido);
    }

    //  OBTENER TODOS LOS PEDIDOS
    @GetMapping
    public Object obtenerPedidos() {
        return pedidoRepository.findAll();
    }

    //  OBTENER PEDIDO POR ID (TICKET)
    @GetMapping("/{id}")
    public Object obtenerPedidoPorId(@PathVariable Long id) {

        Pedido pedido = pedidoRepository.findById(id).orElse(null);

        if (pedido == null) {
            return "Pedido no encontrado";
        }

        Map<String, Object> ticket = new HashMap<>();

        ticket.put("ticket", "TICKET TPV");
        ticket.put("pedido", pedido.getId());
        ticket.put("fecha", pedido.getFecha());
        ticket.put("total", pedido.getTotal());

        List<Map<String, Object>> productos = new ArrayList<>();

        for (LineaPedido linea : pedido.getLineas()) {

            Map<String, Object> producto = new HashMap<>();

            Producto productoBD = productoRepository
                    .findById(linea.getProducto().getId())
                    .orElse(null);

            producto.put("producto", productoBD.getNombre());
            producto.put("cantidad", linea.getCantidad());
            producto.put("subtotal", linea.getSubtotal());

            productos.add(producto);
        }

        ticket.put("productos", productos);

        return ticket;
    }
}