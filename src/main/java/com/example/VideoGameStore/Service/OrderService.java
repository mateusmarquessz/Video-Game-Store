package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.Orders;
import com.example.VideoGameStore.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public Orders createOrder(Orders order) {
        return orderRepository.save(order);
    }

    public Orders getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow();
    }

    public List<Orders> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Orders> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Orders updateOrder(Long id, Orders orderDetails) {
        Orders order = orderRepository.findById(id).orElseThrow();
        order.setOrderDate(orderDetails.getOrderDate());
        order.setUser(orderDetails.getUser());
        order.setGameKeys(orderDetails.getGameKeys());
        return orderRepository.save(order);
    }
}
