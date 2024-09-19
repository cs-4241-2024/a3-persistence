#![allow(non_snake_case)]

use dioxus::prelude::*;

#[component]
pub fn Home() -> Element {
    rsx! {
        div { class:"flex justify-center py-12",
            div { class:"mt-6 card w-96 mt-20 mb-20 shadow-xl",
                div { class:"card-body",
                    h2 { class:"font-bold mt-10 text-center text-4xl font-bold leading-9 tracking-tight",
                        "Exercises"
                    }

                    div { class: "items-center mt-2 space-y-3",
                        label { class: "font-bold input input-bordered flex items-center gap-2",
                            input { class: "grow",
                                id:"search", r#type: "text", placeholder:"Search"
                            }
                            svg { xmlns: "http://www.w3.org/2000/svg",
                                view_box: "0 0 16 16",
                                fill: "currentColor",
                                class: "h-4 w-4 opacity-70",
                                path {
                                    d: "M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z",
                                    fill_rule: "evenodd",
                                    clip_rule: "evenodd",
                                }
                            }
                        }

                        div { class: "collapse bg-base-200",
                            input { r#type: "checkbox"}
                            div { class: "font-bold collapse-title text-xl font-medium",
                                "Bench Press (Barbell)"
                            }
                            div { class: "collapse-content",
                                b { "Form Notes:" }
                                p { "3 second negative" }
                                b { "Setup Notes:" }
                                p { "seat pin 4, foot pin 5" }
                                p { b{ "Rating: " } "4/5" }
                                p { b{ "Last Weight: " } "315" }
                                button { class: "btn btn-neutral w-full mt-2", "Edit"}
                            }
                        }

                        div { class: "flex justify-end",
                            div { class: "btn btn-circle",
                                svg { xmlns: "http://www.w3.org/2000/svg",
                                    view_box: "0 0 24 24",
                                    fill: "none",
                                    class: "h-6 w-6",
                                    stroke: "currentColor",
                                    path {
                                        d: "M12 6L12 18M6 12L18 12",
                                        stroke_linecap: "round",
                                        stroke_linejoin: "round",
                                        stroke_width: "2"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
