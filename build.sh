#!/bin/bash
mvn clean package install -DskipTests -Dmaven.javadoc.skip=true
cp target/lareferencia-repository-dashboard-0.0.1-SNAPSHOT.jar dashboard.jar
