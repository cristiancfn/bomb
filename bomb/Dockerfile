# Usamos una imagen ligera de Java 21
FROM eclipse-temurin:21-jdk-jammy AS build
COPY . .
RUN ./mvnw clean package -DskipTests

# Imagen final para ejecutar la aplicación
FROM eclipse-temurin:21-jre-jammy
COPY --from=build /target/bomb-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]