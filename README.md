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

- __Challenges__: I faced a massive problem trying to make this webapp in Dioxus (Rust) and eventually scrapped it for Templ (Go)
- __Authentication__: session cookies + SQL DB storage
- __CSS Framework__: DaisyUI (Tailwind)

## Technical Achievements
- Password hashing and salting
- Self hosted via Tailscale Funnel
- Authentication middleware, preventing unauthenticated users from accessing the service

## Development

 1. Run Tailwind and Go serve processes (simultaneously):
```bash
npx tailwindcss -i ./assets/input.css -o ./assets/output.css --watch
```
 2. Navigate to [http://localhost:8080](http://localhost:8080)
