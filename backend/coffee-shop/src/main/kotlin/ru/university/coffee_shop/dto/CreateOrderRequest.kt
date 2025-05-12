package ru.university.coffee_shop.dto

data class CreateOrderRequest(
    val userId: Long,
    val items: List<CreateOrderItemRequest>
)

data class CreateOrderItemRequest(
    val coffeeId: Long,
    val quantity: Int
)

