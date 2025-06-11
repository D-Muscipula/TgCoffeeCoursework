package ru.university.coffee_shop.controller

import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestAttribute
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.university.coffee_shop.dto.CreateOrderRequest
import ru.university.coffee_shop.model.Order
import ru.university.coffee_shop.model.OrderStatus
import ru.university.coffee_shop.service.OrderService

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService
) {

    @GetMapping("/user")
    fun ordersOfUser(@RequestAttribute("telegramUserId") chatInstance: String): List<Order> {
        return orderService.getOrdersForUser(chatInstance)
    }

    @DeleteMapping("/user")
    fun deleteUserOrders(): ResponseEntity<Unit> {
        return ResponseEntity.status(405)
            .header("Allow", "GET")
            .build()
    }

    @PostMapping
    fun createOrder(
        @RequestAttribute("telegramUserId") chatInstance: String,
        @Validated @RequestBody request: CreateOrderRequest
    ) {
        orderService.createOrder(request, chatInstance)
    }

    @DeleteMapping("/{orderId}")
    fun cancelOrder(
        @PathVariable orderId: Long,
        @RequestAttribute("telegramUserId") userId: String
    ): ResponseEntity<Map<String, String>> {
        val order = orderService.findOrderById(orderId)
            ?: return ResponseEntity.notFound().build()

        if (order.userId != userId) {
            return ResponseEntity.status(403).body(mapOf("message" to "Нет доступа к заказу"))
        }

        order.status = OrderStatus.CANCELED
        orderService.update(order)
        return ResponseEntity.ok(mapOf("message" to "Заказ отменён"))
    }
}
