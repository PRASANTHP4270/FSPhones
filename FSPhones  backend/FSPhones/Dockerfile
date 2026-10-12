
FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

COPY pom.xml .

RUN mkdir -p /root/.m2 && \
    printf '%s\n' \
    '<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0">' \
    '  <mirrors>' \
    '    <mirror>' \
    '      <id>central-alt</id>' \
    '      <mirrorOf>central</mirrorOf>' \
    '      <url>https://repo.maven.apache.org/maven2</url>' \
    '    </mirror>' \
    '  </mirrors>' \
    '</settings>' \
    > /root/.m2/settings.xml

RUN mvn -B dependency:go-offline

COPY src ./src

RUN mvn -B package -DskipTests

FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
