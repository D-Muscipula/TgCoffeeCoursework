package ru.university.coffee_shop.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.university.coffee_shop.model.Order

interface OrderRepository : JpaRepository<Order, Long> {
    fun findAllByUserId(userId: String): List<Order>
}
