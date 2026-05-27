# 1. Fase de construcción
FROM eclipse-temurin:24-jdk AS build
COPY . .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# 2. Fase de ejecución
FROM eclipse-temurin:24-jre-jammy
# IMPORTANTE: La ruta absoluta dentro de la imagen build suele ser /target/...
# Pero si tu pom.xml está en una subcarpeta, ajústala aquí. 
# Si el pom.xml está en la raíz, esta ruta debería funcionar:
COPY --from=build /target/bomb-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]