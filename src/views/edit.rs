#![allow(non_snake_case)]

use dioxus::prelude::*;

use crate::routes::Route;

#[component]
pub fn Edit(id: i32) -> Element {
    rsx! {
        div { class:"flex justify-center py-12",
            div { class:"mt-6 font-bold card w-96 mt-20 mb-20 shadow-xl",
                form { class:"card-body",
                    h2 { class:"mt-10 text-center text-4xl font-bold leading-9 tracking-tight",
                        "Edit Exercise"
                    }
                    Link { class:"mt-3 link text-center", to: Route::Home {}, "← Back" }

                    div { class: "items-center mt-2 space-y-3",
                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Name"
                                }
                            }
                            input { class: "input input-bordered w-full max-w-xs",
                                id:"name", r#type: "text", placeholder:"Bench Press (Barbell)"
                            }
                        }

                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Rating"
                                }
                            }
                            div { class: "rating",
                                input { r#type: "radio", name: "rating-1", class: "mask mask-star",}
                                input { r#type: "radio", name: "rating-1", class: "mask mask-star",}
                                input { r#type: "radio", name: "rating-1", class: "mask mask-star", value:"", checked:true}
                                input { r#type: "radio", name: "rating-1", class: "mask mask-star",}
                                input { r#type: "radio", name: "rating-1", class: "mask mask-star",}
                            }
                        }

                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Form Notes"
                                }
                            }
                            textarea { class:"textarea textarea-bordered h-24",
                                placeholder:"3 second negative"
                            }
                        }

                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Setup Notes"
                                }
                            }
                            textarea { class:"textarea textarea-bordered h-24",
                                placeholder:"seat pin 4, foot pin 5"
                            }
                        }

                        label { class: "form-control",
                            div { class: "label",
                                span { class: "label-text",
                                    "Last Weight (lbs)"
                                }
                            }
                            input { class: "input input-bordered w-full max-w-xs",
                                id:"weight", r#type: "number", placeholder:"100"
                            }
                        }
                    }
                    div { class: "card-actions justify-end mt-4",
                        button { class: "btn btn-outline btn-success w-full", "Save"}
                    }
                }
            }
        }
    }
}
