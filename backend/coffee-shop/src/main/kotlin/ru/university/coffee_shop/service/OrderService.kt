package ru.university.coffee_shop.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.university.coffee_shop.dto.CreateOrderRequest
import ru.university.coffee_shop.model.Order
import ru.university.coffee_shop.model.OrderItem
import ru.university.coffee_shop.repository.CoffeeRepository
import ru.university.coffee_shop.repository.OrderRepository

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val coffeeRepository: CoffeeRepository,
) {
    @Transactional
    fun createOrder(request: CreateOrderRequest, userId: String): Order {
        val order = Order(userId = userId)
        request.items.forEach { itemReq ->
            val coffee = coffeeRepository.findById(itemReq.coffeeId)
                .orElseThrow { Exception("Coffee id=${itemReq.coffeeId} not found") }
            order.items.add(OrderItem(order = order, coffee = coffee, quantity = itemReq.quantity))
        }
        return orderRepository.save(order)
    }

    fun getOrdersForUser(userId: String): List<Order> {
        return orderRepository.findAllByUserId(userId)
    }

    fun findOrderById(orderId: Long): Order? {
        return orderRepository.findById(orderId).orElse(null)
    }

    fun update(order: Order): Order {
        return orderRepository.save(order)
    }
}

