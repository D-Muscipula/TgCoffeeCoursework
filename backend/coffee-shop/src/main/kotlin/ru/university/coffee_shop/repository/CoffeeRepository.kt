package ru.university.coffee_shop.repository

import org.springframework.data.jpa.repository.JpaRepository
import ru.university.coffee_shop.model.Coffee

interface CoffeeRepository : JpaRepository<Coffee, Long>

