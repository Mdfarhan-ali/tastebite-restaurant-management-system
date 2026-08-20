package com.tastebite.service;

import com.tastebite.dto.OrderRequest;
import com.tastebite.dto.OrderResponse;
import com.tastebite.entity.Order;
import com.tastebite.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderResponse createOrder(
            Long userId,
            OrderRequest request
    ) {

        Order order = Order.builder()
                .userId(userId)
                .totalAmount(request.totalAmount())
                .deliveryAddress(request.deliveryAddress())
                .status("PENDING")
                .build();

        return toResponse(
                orderRepository.save(order)
        );
    }

    public List<OrderResponse> getUserOrders(Long userId) {

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getOrderById(
            Long id,
            Long userId
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException(
                    "You cannot access this order"
            );
        }

        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getCreatedAt()
        );
    }

    public List<OrderResponse> getAllOrders() {

        return orderRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse updateOrderStatus(
            Long id,
            String status
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        order.setStatus(status);

        return toResponse(
                orderRepository.save(order)
        );
    }

    public void deleteDeliveredOrder(
            Long id,
            Long userId
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );


        // Make sure the order belongs to the logged-in user

        if (!order.getUserId().equals(userId)) {

            throw new RuntimeException(
                    "You cannot delete this order"
            );

        }


        // Only DELIVERED orders can be deleted

        if (!"DELIVERED".equalsIgnoreCase(
                order.getStatus()
        )) {

            throw new RuntimeException(
                    "Only delivered orders can be deleted"
            );

        }


        orderRepository.delete(order);
    }
}