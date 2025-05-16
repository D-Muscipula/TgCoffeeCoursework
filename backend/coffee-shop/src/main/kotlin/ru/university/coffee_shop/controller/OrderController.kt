package ru.university.coffee_shop.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.university.coffee_shop.dto.CreateOrderRequest
import ru.university.coffee_shop.model.Order
import ru.university.coffee_shop.service.OrderService

@RestController
@RequestMapping("/api/orders")
class OrderController(val orderService: OrderService) {
    @PostMapping
    fun createOrder(@RequestBody request: CreateOrderRequest) {
        orderService.createOrder(request)
    }

    @GetMapping("/user/{userId}")
    fun ordersOfUser(@PathVariable userId: Long): List<Order> {
        return orderService.getOrdersForUser(userId)
    }
}
