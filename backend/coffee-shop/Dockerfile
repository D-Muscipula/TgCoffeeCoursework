FROM gradle:8.7-jdk21 AS build
WORKDIR /home/gradle/project
COPY . .
RUN gradle build --no-daemon -x test

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8080
