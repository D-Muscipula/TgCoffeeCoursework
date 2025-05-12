package ru.university.coffee_shop.service

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import ru.university.coffee_shop.model.Coffee
import ru.university.coffee_shop.repository.CoffeeRepository
import java.util.Optional

@Service
@Transactional
class CoffeeService(private val coffeeRepository: CoffeeRepository) {

    fun getAllCoffees(): List<Coffee> {
        return coffeeRepository.findAll()
    }

    fun getCoffeeById(id: Long): Optional<Coffee?> {
        return coffeeRepository.findById(id)
    }

    fun createTestCoffees() {
        // Создание тестовых данных
        coffeeRepository.saveAll(listOf(
            Coffee(name = "Эспрессо", image = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Espresso_BW_1.jpg/2560px-Espresso_BW_1.jpg", description = "Классический насыщенный кофе", price = 400),
            Coffee(name = "Латте", image = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Latte_art_3.jpg/2560px-Latte_art_3.jpg", description = "Молочный кофе с нежной пенкой", price = 600),
            Coffee(name = "Капучино", image = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cappuccino_in_original.jpg/2560px-Cappuccino_in_original.jpg", description = "Кофе с равным количеством эспрессо, молока и пены", price = 650)
        ))
    }
}

