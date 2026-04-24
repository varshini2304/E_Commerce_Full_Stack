# syntax=docker/dockerfile:1.7

# ── Build stage ──
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
RUN mvn -B -e -q dependency:go-offline

COPY src ./src
RUN mvn -B -e -q clean package -DskipTests \
    && mv target/*.jar target/app.jar

# ── Runtime stage ──
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/target/app.jar app.jar

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
