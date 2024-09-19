use dioxus::prelude::*;

use crate::views::home::Home;
use crate::views::edit::Edit;
use crate::views::login::Login;
use crate::views::signup::Signup;

#[derive(Clone, Routable, Debug, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum Route {
    #[route("/")]
    #[redirect("/:..segments", |segments: Vec<String>| Route::Home {})]
    Home {},
    #[route("/login")]
    Login {},
    #[route("/signup")]
    Signup {},
    #[route("/edit/:id")]
    Edit { id: i32 },
}
