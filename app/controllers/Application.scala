package controllers

import play.api.mvc._
import play.api.libs.json.Json._
import play.api.libs.json.Json

object Application extends Controller {

  var images_to_send = Map("1" -> toJson("assets/images/pic1.jpg"),
    "2" -> toJson("assets/images/pic2.jpg"),
    "3" -> toJson("assets/images/pic3.jpg"),
    "4" -> toJson("assets/images/pic4.jpg"),
    "5" -> toJson("assets/images/pic5.jpg"))

  def index = Action {
    Ok(views.html.index())
  }

  def images = Action {
    Ok(Json.toJson(
      images_to_send
    ))
  }

}