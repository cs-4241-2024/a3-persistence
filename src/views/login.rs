#![allow(non_snake_case)]

use dioxus::prelude::*;

use crate::routes::Route;

#[component]
pub fn Login() -> Element {
    rsx! {
        div { class:"flex justify-center py-12",
            div { class:"mt-6 font-bold card w-96 mt-20 mb-20 shadow-xl",
                form { class:"card-body",
                    h2 { class:"mt-10 text-center text-4xl font-bold leading-9 tracking-tight",
                        "Login"
                    }
                    Link { class:"mt-3 link text-center", to: Route::Signup {}, "Signup →" }

                    div { class: "items-center mt-2 space-y-3",
                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Username"
                                }
                            }
                            input { class: "input input-bordered w-full max-w-xs",
                                id:"username", r#type: "text", placeholder:"Username"
                            }
                        }
                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Password"
                                }
                            }
                            input { class: "input input-bordered w-full max-w-xs",
                                id:"password", r#type: "password", placeholder:"Password"
                            }
                        }
                    }
                    div { class: "card-actions justify-end mt-4",
                        button { class: "btn btn-outline btn-success w-full","Login"}
                    }
                }
            }
        }
    }
}
