package ru.university.coffee_shop.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestAttribute
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
    fun createOrder(
        @RequestAttribute("telegramChatInstance") chatInstance: String,
        @RequestBody request: CreateOrderRequest
    ) {
        orderService.createOrder(request, chatInstance)
    }

    @GetMapping("/user")
    fun ordersOfUser(@RequestAttribute("telegramChatInstance") chatInstance: String): List<Order> {
        return orderService.getOrdersForUser(chatInstance)
    }
}
