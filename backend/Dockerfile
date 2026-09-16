# KEYSTONE API — multi-stage image for Render (or any Docker host).
FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /workspace
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src src
RUN chmod +x mvnw && ./mvnw -q -DskipTests package

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /workspace/target/keystone-backend-*.jar app.jar
EXPOSE 8080
# Render sets PORT; Spring reads SERVER_PORT with a default of 8080.
ENV SERVER_PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]
