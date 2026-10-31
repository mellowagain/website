FROM mcr.microsoft.com/devcontainers/typescript-node:26

LABEL org.opencontainers.image.source="https://github.com/mellowagain/website"

RUN apt-get update && apt-get install -y --no-install-recommends libimage-exiftool-perl \
 && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.32.1

RUN curl -fsSL https://github.com/openai/codex/releases/latest/download/codex-x86_64-unknown-linux-musl.tar.gz \
    | tar -xz -C /tmp \
 && install -m 0755 /tmp/codex-x86_64-unknown-linux-musl /usr/local/bin/codex \
 && rm /tmp/codex-x86_64-unknown-linux-musl \
