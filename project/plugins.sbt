// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"
//resolvers += "Typesafe repository2" at "http://repo.akka.io/releases/com/typesafe/akka/akka-transactor/2.1-M1"

// Use the Play sbt plugin for Play projects
addSbtPlugin("play" % "sbt-plugin" % "2.1.0")

//libraryDependencies += "com.typesafe.akka" % "akka-transactor" % "2.1"