# E-Commerce Backend — Spring Boot

Production-grade Java Spring Boot backend — a 1:1 conversion of the existing Node.js + Express + MongoDB e-commerce API.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Java 17 | Language |
| Spring Boot 3.3 | Framework |
| Spring Security 6 | Authentication & Authorization |
| JWT (jjwt 0.12) | Token-based auth |
| Spring Data JPA | ORM |
| MySQL 8 | Primary database |
| Redis 7 | Caching (products, home page) |
| Lombok | Reduce boilerplate |
| MapStruct | DTO mapping |
| Docker | Containerization |

## Prerequisites

- Java 17+ (JDK)
- Maven 3.8+
- MySQL 8.x running on `localhost:3306`
- Redis 7.x running on `localhost:6379`
- Docker & Docker Compose (optional)

## Quick Start

### Option 1: Local (without Docker)

1. **Start MySQL and Redis** on your machine.

2. **Create the database** (auto-created by Spring if using the default URL):
   ```sql
   CREATE DATABASE IF NOT EXISTS ecommerce_db;
   ```

3. **Build and run**:
   ```bash
   cd server-spring
   mvn clean package -DskipTests
   java -jar target/ecommerce-backend-1.0.0.jar
   ```

   Or use Maven directly:
   ```bash
   mvn spring-boot:run
   ```

4. Server starts on **http://localhost:5000**

### Option 2: Docker Compose

```bash
cd server-spring
mvn clean package -DskipTests
docker-compose up --build
```

This starts MySQL, Redis, and the app automatically.

## Data Seeding

The application **automatically seeds** the database on first startup when tables are empty:

- **3 Users**: admin@example.com (ADMIN), customer1@example.com, customer2@example.com
- **6 Categories**: Electronics, Fashion, Home & Kitchen, Sports & Outdoors, Books & Media, Health & Beauty
- **7 Products**: iPhone 15 Pro, Samsung Galaxy S24 Ultra, Google Pixel 8, OnePlus 12, Nike Air Max, Aero Headphones, Cloud Mug
- **10 Banners**: Hero, Promo, Category, Offer, App banners
- **2 Sample Orders** for customer1

Default password for all users: `Password@123`

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login → JWT token |
| GET | `/api/auth/profile` | JWT | Get user profile |
| PUT | `/api/auth/profile` | JWT | Update profile |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List products (paginated, filterable, cached) |
| GET | `/api/products/{slug}` | Public | Get product by slug (with reviews & related) |
| POST | `/api/products` | ADMIN | Create product |
| PUT | `/api/products/{id}` | ADMIN | Update product |
| DELETE | `/api/products/{id}` | ADMIN | Soft delete product |
| PUT | `/api/products/{id}/stock` | ADMIN | Update stock |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | List categories |
| POST | `/api/categories` | ADMIN | Create category |
| PUT | `/api/categories/{id}` | ADMIN | Update category |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | JWT | Get user's cart |
| POST | `/api/cart/add` | JWT | Add item to cart |
| PUT | `/api/cart/update` | JWT | Update cart item quantity |
| DELETE | `/api/cart/remove/{productId}` | JWT | Remove item from cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | JWT | Create order from cart |
| GET | `/api/orders/my` | JWT | Get user's orders |
| GET | `/api/orders` | ADMIN | Get all orders |
| PUT | `/api/orders/{id}/status` | ADMIN | Update order status |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create` | JWT | Create payment intent |
| POST | `/api/payments/verify` | JWT | Verify payment |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | JWT | Create/update review (purchase guard) |

### Other
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/banners` | Public | Get active banners |
| GET | `/api/home` | Public | Get home page data (cached) |
| GET | `/api/admin/dashboard` | ADMIN | Admin dashboard summary |
| POST | `/api/newsletter/subscribe` | Public | Newsletter subscribe |
| GET | `/api/profile-page` | Public | Get profile page data |
| GET | `/health` | Public | Health check |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/ecommerce_db` | MySQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | `root` | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | `root` | MySQL password |
| `SPRING_DATA_REDIS_HOST` | `localhost` | Redis host |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port |
| `APP_JWT_SECRET` | (see application.yml) | JWT signing secret |
| `APP_JWT_EXPIRATION` | `86400000` | JWT expiration (ms) |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | CORS allowed origins |
| `SERVER_PORT` | `5000` | Server port |

## Project Structure

```
src/main/java/com/ecommerce/
├── EcommerceApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── RedisConfig.java
│   ├── JwtProperties.java
│   ├── HealthController.java
│   └── DataSeeder.java
├── shared/
│   ├── exception/         (6 exception classes + GlobalExceptionHandler)
│   ├── response/          (ApiResponse wrapper)
│   ├── security/          (JwtUtil, JwtAuthFilter, CustomUserDetailsService)
│   └── util/              (StringListConverter)
└── modules/
    ├── auth/              (controller, service, DTOs)
    ├── user/              (model, repository)
    ├── product/           (model, repository, service, controller, DTOs)
    ├── category/          (model, repository, service, controller, DTO)
    ├── cart/              (model, repository, service, controller, DTOs)
    ├── order/             (model, repository, service, controller, DTO)
    ├── payment/           (model, repository, service, controller, DTOs)
    ├── review/            (model, repository, service, controller, DTO)
    ├── banner/            (model, repository, service, controller)
    ├── home/              (service, controller)
    ├── admin/             (service, controller)
    ├── newsletter/        (controller, DTO)
    └── profile/           (service, controller)
```
