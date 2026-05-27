FROM eclipse-temurin:21-jdk-jammy AS build
COPY . .
# Esta es la clave para el error 126:
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
COPY --from=build /target/bomb-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]