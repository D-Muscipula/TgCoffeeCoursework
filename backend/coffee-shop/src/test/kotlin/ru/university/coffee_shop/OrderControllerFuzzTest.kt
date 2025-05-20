import net.jqwik.api.ForAll
import net.jqwik.api.Property
import net.jqwik.api.constraints.AlphaChars
import net.jqwik.api.constraints.IntRange
import org.junit.jupiter.api.Assertions
import org.mockito.Mockito
import ru.university.coffee_shop.controller.OrderController
import ru.university.coffee_shop.model.Order
import ru.university.coffee_shop.model.OrderStatus
import ru.university.coffee_shop.service.OrderService
import java.time.LocalDateTime

class OrderControllerFuzzTest {

    private val orderService = Mockito.mock(OrderService::class.java)
    private val orderController = OrderController(orderService)

    @Property
    fun testFuzzCancelOrderWithRandomOrderIdAndUserId(
        @ForAll @IntRange(min = 1, max = Long.MAX_VALUE.toInt()) orderId: Long,
        @ForAll @AlphaChars userId: String
    ) {
        val order = Order(orderId, userId, LocalDateTime.now())
        Mockito.`when`(orderService.findOrderById(orderId)).thenReturn(order)

        val response = orderController.cancelOrder(orderId, userId)

        Assertions.assertEquals("Заказ отменён", response.body)
        Assertions.assertEquals(OrderStatus.CANCELED, order.status)

        Mockito.verify(orderService).update(order)
    }
}
