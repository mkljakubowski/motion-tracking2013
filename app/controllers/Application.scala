package controllers

import play.api.mvc._
import play.api.libs.json.Json._
import play.api.{Play, Logger}
import play.api.Play.current

object Application extends Controller {

  val files = toJson(Play.getFile("public/gallery").listFiles().map(f => "assets/gallery/" + f.getName).map(toJson(_)))

  def index = Action {
    Ok(views.html.index())
  }

  def images = Action {
    Ok(files)
  }

}