# Liam's Epic Lift Logger (LELL)

[Hosted Link](https://)

After tracking over 300 workouts on the app Strong, I have found myself
a little dissatisfied. Its quite a hassle to setup all my different
workouts and modify + log sets during each workout. The goal of this
project is to create a workout app/webapp that doesn't require being
used all the time. It takes the most useful parts of Strong and gets
rid of everything else.

This project does not log individual workouts. Instead each exercise
is logged with a rating, notes (form & machine setup), and last
recorded weight (for a baseline). With this setup you can speed
up your workouts by easily finding how to setup the machine and
around what weight to use.

- TODO challenges you faced in realizing the application
- TODO authentication strategy
- __CSS Framework__: DaisyUI (Tailwind)

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

## Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...


## Development

 1. Run Tailwind and Dioxus serve processes (simultaneously):
```bash
npx tailwindcss -i ./input.css -o ./assets/tailwind.css --watch
dx serve --platform fullstack
```
 2. Navigate to [http://localhost:8080](http://localhost:8080)
