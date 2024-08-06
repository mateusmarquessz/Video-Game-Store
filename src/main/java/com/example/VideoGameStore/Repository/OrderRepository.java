package com.example.VideoGameStore.Repository;
import com.example.VideoGameStore.Entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository  extends JpaRepository<Orders, Long> {
}
