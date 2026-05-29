package com.tfg.tpv.repository;

import com.tfg.tpv.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    //  Productos con poco stock
    List<Producto> findByStockLessThan(int stock);
}