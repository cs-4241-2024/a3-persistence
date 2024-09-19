#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_logger::tracing;

mod views;
use views::app::App;
mod routes;

fn main() {
    dioxus_logger::init(tracing::Level::INFO).expect("failed to init logger");
    tracing::info!("starting app");
    launch(App);
}
