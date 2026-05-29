package com.tfg.tpv.controller;

import com.tfg.tpv.model.Producto;
import com.tfg.tpv.repository.PedidoRepository;
import com.tfg.tpv.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    //  TOTAL PEDIDOS
    @GetMapping("/pedidos")
    public Object totalPedidos() {

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("totalPedidos", pedidoRepository.count());

        return respuesta;
    }

    //  TOTAL VENTAS €
    @GetMapping("/ventas")
    public Object totalVentas() {

        Double totalVentas = pedidoRepository.obtenerTotalVentas();

        if (totalVentas == null) {
            totalVentas = 0.0;
        }

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("totalVentas", totalVentas);

        return respuesta;
    }

    //  TOTAL PRODUCTOS
    @GetMapping("/productos")
    public Object totalProductos() {

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("totalProductos", productoRepository.count());

        return respuesta;
    }

    //  STOCK BAJO
    @GetMapping("/stock-bajo")
    public List<Producto> stockBajo() {

        return productoRepository.findByStockLessThan(20);
    }
}