package ru.university.coffee_shop.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.university.coffee_shop.model.Coffee
import ru.university.coffee_shop.service.CoffeeService

@RestController
@RequestMapping("/api/coffee")
class CoffeeController(private val coffeeService: CoffeeService) {

    @GetMapping("/{id}")
    fun getCoffeeById(@PathVariable id: Long): ResponseEntity<Coffee> {
        val coffee = coffeeService.getCoffeeById(id)
        return if (coffee.isPresent) {
            ResponseEntity.ok(coffee.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getCoffees(): List<Coffee> {
        return coffeeService.getAllCoffees()
    }
}

