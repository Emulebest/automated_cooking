name := """cooking_service"""
organization := "com.emulebest"

version := "1.0-SNAPSHOT"

javacOptions ++= Seq("-source", "11", "-target", "11")

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.12.8"

libraryDependencies += guice
