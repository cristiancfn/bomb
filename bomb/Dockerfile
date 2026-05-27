# Usamos una imagen ligera de Java 21
FROM eclipse-temurin:21-jdk-jammy AS build

# Copiamos todo el código
COPY . .

# --- AÑADE ESTA LÍNEA ---
# Damos permisos de ejecución al archivo mvnw
RUN chmod +x mvnw

# Ahora ejecutamos el comando
RUN ./mvnw clean package -DskipTests

# Imagen final para ejecutar la aplicación
FROM eclipse-temurin:21-jre-jammy
COPY --from=build /target/bomb-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]