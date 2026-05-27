# 1. Fase de construcción
FROM eclipse-temurin:21-jdk-jammy AS build
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# 2. Fase de ejecución
FROM eclipse-temurin:21-jre-jammy
COPY --from=build /target/bomb-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]