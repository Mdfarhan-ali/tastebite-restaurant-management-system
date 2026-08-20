# ==========================================
# Build Stage
# ==========================================

FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper and project configuration
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build Spring Boot application
RUN ./mvnw clean package -DskipTests


# ==========================================
# Runtime Stage
# ==========================================

FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated JAR
COPY --from=build /app/target/*.jar app.jar

# Copy uploaded food images
COPY uploads ./uploads

# Render will provide PORT.
# Spring Boot uses ${PORT:8080}.
EXPOSE 8080

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]