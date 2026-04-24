# E-Commerce Microservices — Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud SDK** installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required APIs:**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   ```

3. **Managed services required:**
   - MongoDB Atlas (or Cloud MongoDB)
   - Confluent Cloud Kafka (or self-managed on GCE)
   - Memorystore for Redis

---

## Step 1: Configure Artifact Registry

```bash
# Create a Docker repository
gcloud artifacts repositories create ecommerce-microservices \
  --repository-format=docker \
  --location=us-central1 \
  --description="E-Commerce microservices Docker images"

# Configure Docker auth
gcloud auth configure-docker us-central1-docker.pkg.dev
```

---

## Step 2: Build & Push Docker Images

```bash
REGION=us-central1
PROJECT_ID=$(gcloud config get-value project)
REGISTRY=${REGION}-docker.pkg.dev/${PROJECT_ID}/ecommerce-microservices

# Product Service
cd product-service
docker build -t ${REGISTRY}/product-service:latest .
docker push ${REGISTRY}/product-service:latest
cd ..

# Order Service
cd order-service
docker build -t ${REGISTRY}/order-service:latest .
docker push ${REGISTRY}/order-service:latest
cd ..

# Payment Service
cd payment-service
docker build -t ${REGISTRY}/payment-service:latest .
docker push ${REGISTRY}/payment-service:latest
cd ..

# Inventory Service
cd inventory-service
docker build -t ${REGISTRY}/inventory-service:latest .
docker push ${REGISTRY}/inventory-service:latest
cd ..

# API Gateway
cd api-gateway
docker build -t ${REGISTRY}/api-gateway:latest .
docker push ${REGISTRY}/api-gateway:latest
cd ..
```

---

## Step 3: Deploy Each Service to Cloud Run

### Product Service
```bash
gcloud run deploy product-service \
  --image ${REGISTRY}/product-service:latest \
  --region ${REGION} \
  --platform managed \
  --port 8081 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated \
  --set-env-vars "\
SPRING_DATA_MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/product_db,\
SPRING_DATA_REDIS_HOST=REDIS_HOST,\
SPRING_DATA_REDIS_PORT=6379,\
SERVER_PORT=8081"
```

### Order Service
```bash
gcloud run deploy order-service \
  --image ${REGISTRY}/order-service:latest \
  --region ${REGION} \
  --platform managed \
  --port 8082 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated \
  --set-env-vars "\
SPRING_DATA_MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/order_db,\
SPRING_KAFKA_BOOTSTRAP_SERVERS=KAFKA_BOOTSTRAP_SERVER:9092,\
SERVER_PORT=8082"
```

### Payment Service
```bash
gcloud run deploy payment-service \
  --image ${REGISTRY}/payment-service:latest \
  --region ${REGION} \
  --platform managed \
  --port 8083 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated \
  --set-env-vars "\
SPRING_DATA_MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/payment_db,\
SPRING_KAFKA_BOOTSTRAP_SERVERS=KAFKA_BOOTSTRAP_SERVER:9092,\
SERVER_PORT=8083"
```

### Inventory Service
```bash
gcloud run deploy inventory-service \
  --image ${REGISTRY}/inventory-service:latest \
  --region ${REGION} \
  --platform managed \
  --port 8084 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated \
  --set-env-vars "\
SPRING_DATA_MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/inventory_db,\
SPRING_KAFKA_BOOTSTRAP_SERVERS=KAFKA_BOOTSTRAP_SERVER:9092,\
SERVER_PORT=8084"
```

### API Gateway
```bash
# Get the URLs of deployed services
PRODUCT_URL=$(gcloud run services describe product-service --region ${REGION} --format='value(status.url)')
ORDER_URL=$(gcloud run services describe order-service --region ${REGION} --format='value(status.url)')
PAYMENT_URL=$(gcloud run services describe payment-service --region ${REGION} --format='value(status.url)')
INVENTORY_URL=$(gcloud run services describe inventory-service --region ${REGION} --format='value(status.url)')

gcloud run deploy api-gateway \
  --image ${REGISTRY}/api-gateway:latest \
  --region ${REGION} \
  --platform managed \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --allow-unauthenticated \
  --set-env-vars "\
SERVER_PORT=8080,\
APP_JWT_SECRET=f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3021a9b8c7d6e5f40312,\
SPRING_CLOUD_GATEWAY_ROUTES_0_URI=${PRODUCT_URL},\
SPRING_CLOUD_GATEWAY_ROUTES_0_PREDICATES_0=Path=/api/products/**,\
SPRING_CLOUD_GATEWAY_ROUTES_0_ID=product-service,\
SPRING_CLOUD_GATEWAY_ROUTES_1_URI=${PRODUCT_URL},\
SPRING_CLOUD_GATEWAY_ROUTES_1_PREDICATES_0=Path=/api/categories/**,\
SPRING_CLOUD_GATEWAY_ROUTES_1_ID=category-service,\
SPRING_CLOUD_GATEWAY_ROUTES_2_URI=${ORDER_URL},\
SPRING_CLOUD_GATEWAY_ROUTES_2_PREDICATES_0=Path=/api/orders/**,\
SPRING_CLOUD_GATEWAY_ROUTES_2_ID=order-service,\
SPRING_CLOUD_GATEWAY_ROUTES_3_URI=${PAYMENT_URL},\
SPRING_CLOUD_GATEWAY_ROUTES_3_PREDICATES_0=Path=/api/payments/**,\
SPRING_CLOUD_GATEWAY_ROUTES_3_ID=payment-service,\
SPRING_CLOUD_GATEWAY_ROUTES_4_URI=${INVENTORY_URL},\
SPRING_CLOUD_GATEWAY_ROUTES_4_PREDICATES_0=Path=/api/inventory/**,\
SPRING_CLOUD_GATEWAY_ROUTES_4_ID=inventory-service"
```

---

## Step 4: Verify Deployment

```bash
# Get the API Gateway URL
GATEWAY_URL=$(gcloud run services describe api-gateway --region ${REGION} --format='value(status.url)')

# Test product listing
curl ${GATEWAY_URL}/api/products

# Test order creation
curl -X POST ${GATEWAY_URL}/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userId": "user123",
    "items": [{
      "productId": "prod1",
      "name": "Test Product",
      "quantity": 1,
      "price": 29.99
    }]
  }'
```

---

## Environment Variables Reference

| Service | Variable | Description |
|---------|----------|-------------|
| All | `SERVER_PORT` | Port the service listens on |
| Product | `SPRING_DATA_MONGODB_URI` | MongoDB connection string |
| Product | `SPRING_DATA_REDIS_HOST` | Redis host |
| Order | `SPRING_KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address |
| Gateway | `APP_JWT_SECRET` | JWT signing secret |
