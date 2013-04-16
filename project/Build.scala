import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "MotionTracking"
    val appVersion      = "1.0"

    val appDependencies = Seq(
    )

    val main = play.Project(appName, appVersion, appDependencies).settings(
      coffeescriptOptions := Seq("bare")
    )

}
