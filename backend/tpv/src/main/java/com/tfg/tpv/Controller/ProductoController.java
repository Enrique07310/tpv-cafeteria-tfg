package com.tfg.tpv.controller;

            if (producto == null) {
                return "Producto no encontrado";
            }

            if (producto.getStock() < linea.getCantidad()) {
                return "Stock insuficiente para " + producto.getNombre();
            }

            double subtotal = producto.getPrecio() * linea.getCantidad();

            linea.setSubtotal(subtotal);

            total += subtotal;

            // ✅ DESCONTAR STOCK
            producto.setStock(producto.getStock() - linea.getCantidad());

            productoRepository.save(producto);
        }

        pedido.setTotal(total);

        // ✅ FECHA
        pedido.setFecha(LocalDateTime.now());

        // ✅ GUARDAR EN POSTGRESQL
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