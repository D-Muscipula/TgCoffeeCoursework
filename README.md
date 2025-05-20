# Проект Coffee Shop

## Обзор
Проект представляет собой веб-приложение для заказа кофе с использованием Telegram WebApp для интерфейса пользователя. Приложение состоит из бэкенда на Kotlin + Spring Boot и фронтенда на TypeScript + React (или Vue).

## Структура проекта
```
/CoffeeShop
├── backend/
│   └── coffee-shop/            # Spring Boot приложение (Kotlin)
│       ├── src/
│       │   ├── main/
│       │   │   ├── kotlin/ru/university/coffee_shop/
│       │   │   │   ├── controller/ # REST контроллеры
│       │   │   │   ├── dto/        # Data Transfer Objects
│       │   │   │   ├── model/      # Модели данных (JPA Entities)
│       │   │   │   ├── repository/ # Репозитории (Spring Data JPA)
│       │   │   │   ├── security/   # Конфигурация безопасности (Telegram Auth)
│       │   │   │   └── service/    # Сервисный слой (бизнес-логика)
│       │   │   └── resources/
│       │   │       └── application.properties # Конфигурация приложения
│       │   └── test/               # Тесты
│       ├── build.gradle.kts        # Конфигурация сборки Gradle
│       └── Dockerfile              # Dockerfile для бэкенда
└── coffee-shop-bot/        
    ├── src/                    # Исходный код бота
    └── Dockerfile              # Dockerfile для бота
├── frontend/
│   └── coffee-shop/            # Фронтенд приложение (TypeScript + React/Vue)
│       ├── public/                 # Статические ассеты
│       ├── src/
│       │   ├── assets/             # Локальные ассеты (изображения, шрифты)
│       │   ├── components/         # Переиспользуемые UI компоненты
│       │   ├── pages/              # Компоненты страниц
│       │   ├── store/              # Управление состоянием
│       │   ├── App.tsx             # Корневой компонент приложения
│       │   └── main.tsx            # Точка входа фронтенда
│       ├── package.json            # Зависимости и скрипты npm
│       ├── vite.config.ts        # Конфигурация Vite
│       ├── tsconfig.json           # Конфигурация TypeScript
│       ├── nginx.conf              # Конфигурация Nginx
│       └── Dockerfile              # Dockerfile для фронтенда
├── docker-compose.yaml         # Конфигурация Docker Compose для запуска всех сервисов
└── README.md                  

## Технологический стек

### Бэкенд
- **Язык**: Kotlin
- **Фреймворк**: Spring Boot
- **База данных**: PostgreSQL
- **ORM**: Spring Data JPA
- **Аутентификация**: Кастомная через Telegram (проверка `initData`)
- **Сборка**: Gradle

### Фронтенд
- **Язык**: TypeScript
- **Библиотека/Фреймворк**: React 
- **Сборщик**: Vite
- **Управление состоянием**
- **Веб-сервер**: Nginx (для раздачи статики и проксирования API)


## Основные компоненты

### Бэкенд (`backend/coffee-shop`)
-   **`CoffeeShopApplication.kt`**: Точка входа Spring Boot приложения.
-   **`model/`**: JPA Entities (`Coffee.kt`, `Order.kt`, `OrderItem.kt`, `OrderStatus.kt`).
-   **`repository/`**: Интерфейсы Spring Data JPA для доступа к данным.
-   **`service/`**: Бизнес-логика приложения (`CoffeeService.kt`, `OrderService.kt`).
-   **`controller/`**: REST API эндпоинты (`CoffeeController.kt`, `OrderController.kt`).
-   **`security/`**: (`TelegramAuthInterceptor.kt`, `WebConfig.kt`) - Реализация аутентификации через проверку данных инициализации Telegram WebApp.
-   **`dto/`**: Data Transfer Objects для запросов и ответов API.

### Фронтенд (`frontend/coffee-shop`)
-   **`main.tsx`**: Точка входа React/Vue приложения.
-   **`App.tsx`**: Корневой компонент, настройка роутинга.
-   **`components/`**: Переиспользуемые UI компоненты (`Header.tsx`, `Footer.tsx`, `CoffeeList.tsx`, `Cart.tsx`).
-   **`pages/`**: Компоненты, представляющие отдельные страницы (`Home.tsx`, `Orders.tsx`, `CoffeeDetail.tsx`).
-   **`store/`**: Управление глобальным состоянием (например, корзина, данные пользователя).
    -   `cartSlice.ts`, `cartThunks.ts`: Логика корзины с использованием Redux Toolkit.
    -   `TelegramContext.tsx`: Контекст для передачи данных Telegram.
-   **`vite.config.ts`**: Конфигурация сборщика Vite, включая прокси для API запросов к бэкенду.
-   **`nginx.conf`**: Конфигурация Nginx для раздачи статических файлов фронтенда и проксирования запросов к API бэкенда.

### Telegram Бот (`backend/coffee-shop-bot`)
-   **Назначение**: Взаимодействие с пользователями через Telegram, предоставление интерфейса WebApp для заказа кофе.
    -   Обработка команд (например, `/start`, `/menu`).
    -   Отправка сообщений и клавиатур.
    -   Предоставление кнопки для открытия WebApp (интерфейса кофейни).



