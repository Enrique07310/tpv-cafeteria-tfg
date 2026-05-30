package com.tfg.tpv.repository;

import com.tfg.tpv.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // ✅ TOTAL VENTAS
    @Query("SELECT SUM(p.total) FROM Pedido p")
    Double obtenerTotalVentas();
}