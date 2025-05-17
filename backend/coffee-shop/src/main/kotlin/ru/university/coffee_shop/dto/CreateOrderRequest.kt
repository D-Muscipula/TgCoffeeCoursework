package ru.university.coffee_shop.dto

data class CreateOrderRequest(
    val items: List<CreateOrderItemRequest>
)

data class CreateOrderItemRequest(
    val coffeeId: Long,
    val quantity: Int
)

