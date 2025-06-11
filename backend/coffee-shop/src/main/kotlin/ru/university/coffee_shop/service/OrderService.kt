package ru.university.coffee_shop.service

import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import ru.university.coffee_shop.dto.CreateOrderRequest
import ru.university.coffee_shop.model.Order
import ru.university.coffee_shop.model.OrderItem
import ru.university.coffee_shop.repository.CoffeeRepository
import ru.university.coffee_shop.repository.OrderRepository

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val coffeeRepository: CoffeeRepository
) {
    @Transactional
    fun createOrder(request: CreateOrderRequest, userId: String): Order {
        val order = Order(userId = userId)
        if (request.items.isEmpty()) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Список товаров не может быть пустым")
        }

        request.items.forEach { itemReq ->
            if (itemReq == null) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Order item cannot be null")
            }
            if (itemReq.quantity < 1 || itemReq.quantity > 1000) {
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Количество должно быть от 1 до 1000")
            }
            val coffee = coffeeRepository.findById(itemReq.coffeeId)
                .orElseThrow {
                    ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Coffee id=${itemReq.coffeeId} not found"
                    )
                }
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

    fun update(order: Order) {
        orderRepository.save(order)
    }
}

