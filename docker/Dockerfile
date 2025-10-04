FROM python:3.10-slim-bookworm AS base

# Install system dependencies, create user, setup venv and dirs
RUN apt-get update && apt-get install --no-install-recommends -y \
        build-essential \
        git \
        libportaudio2 \
        pandoc \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -u 1000 -s /bin/bash appuser \
    && python -m venv /venv \
    && mkdir -p /app /home/appuser/.aider /home/appuser/.cache /home/appuser/pw-browsers \
    && chown -R appuser:appuser /home/appuser /app /venv \
    && chmod -R 777 /home/appuser/.aider /home/appuser/.cache /home/appuser/pw-browsers \
    && git config --system --add safe.directory /app

WORKDIR /app

# Environment variables
ENV PATH="/venv/bin:$PATH" \
    PLAYWRIGHT_BROWSERS_PATH=/home/appuser/pw-browsers \
    PLAYWRIGHT_SKIP_BROWSER_GC=1 \
    HOME=/home/appuser

#########################
# Common dependencies install step
FROM base AS deps
COPY . /tmp/aider
RUN /venv/bin/python -m pip install --upgrade --no-cache-dir pip

#########################
FROM deps AS aider-full
ENV AIDER_DOCKER_IMAGE=paulgauthier/aider-full
USER appuser
COPY docker/start-aider.sh /app/start-aider.sh
RUN chmod +x /app/start-aider.sh
ENTRYPOINT ["/app/start-aider.sh"]

#########################
FROM deps AS aider
ENV AIDER_DOCKER_IMAGE=paulgauthier/aider
USER appuser
COPY docker/start-aider.sh /app/start-aider.sh
RUN chmod +x /app/start-aider.sh
ENTRYPOINT ["/app/start-aider.sh"]