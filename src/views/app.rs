#![allow(non_snake_case)]

use dioxus::prelude::*;

use crate::routes::Route;

pub fn App() -> Element {
    rsx! {
        // background image (source tailwindcss.com)
        div { class:"absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none",
            div { class:"w-[108rem] flex-none flex justify-end",
                picture {
                    img { class:"w-[71.75rem] flex-none max-w-none dark:hidden", alt:"", decoding:"async",
                        src:"/_next/static/media/docs@30.8b9a76a2.avif",
                    }
                }
                picture {
                    img { class:"w-[90rem] flex-none max-w-none hidden dark:block", alt:"", decoding:"async",
                        src:"https://tailwindcss.com/_next/static/media/docs-dark@30.1a9f8cbf.avif",
                    }
                }
            }
        }

        // header (source tailwindcss.com)
        div { class:"shadow-xl sticky top-0 z-40 w-full flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent",
            // div { class:"max-w-8xl mx-auto",
                div { class:"py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0",
                    // div { class:"relative flex items-center",
                        h1 { class:"text-4xl font-extrabold text-center",
                            "Liam's Epic Lift Logger"
                        }
                    // }
                }
            // }
        }

        main { class:"",
            Router::<Route> {}
        }
    }
}
