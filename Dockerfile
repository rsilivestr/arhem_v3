FROM rustlang/rust:nightly
WORKDIR /app
RUN rustup update
COPY Cargo.lock Cargo.toml Rocket.toml .
COPY src/* ./src/
COPY static/* ./static/
RUN cargo update
RUN cargo fetch
RUN cargo install cargo-watch
CMD ["cargo", "watch", "-x", "run"]
