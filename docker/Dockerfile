FROM python:3.10-slim-bookworm AS base

# Install system dependencies, create user, and setup directories in one layer
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        git \
        libportaudio2 \
        pandoc && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m -u 1000 -s /bin/bash appuser && \
    python -m venv /venv && \
    mkdir -p /home/appuser/.aider /home/appuser/.cache /home/appuser/pw-browsers /app && \
    chown -R appuser:appuser /home/appuser /app /venv && \
    chmod -R 777 /home/appuser/.aider /home/appuser/.cache /home/appuser/pw-browsers && \
    git config --system --add safe.directory /app

WORKDIR /app

# Virtual environment and Playwright settings
ENV PATH="/venv/bin:$PATH" \
    PLAYWRIGHT_BROWSERS_PATH=/home/appuser/pw-browsers \
    PLAYWRIGHT_SKIP_BROWSER_GC=1 \
    HOME=/app

#########################
FROM base AS aider-full

ENV AIDER_DOCKER_IMAGE=paulgauthier/aider-full

COPY . /tmp/aider

# Install dependencies and playwright browsers in one layer
RUN /venv/bin/python -m pip install --upgrade --no-cache-dir pip && \
    /venv/bin/python -m pip install --no-cache-dir /tmp/aider[help,browser,playwright] boto3 \
       --extra-index-url https://download.pytorch.org/whl/cpu && \
    /venv/bin/python -m playwright install --with-deps chromium && \
    find /venv/lib/python3.10/site-packages \( -type d -exec chmod a+rwx {} + \) -o \( -type f -exec chmod a+rw {} + \) && \
    rm -rf /tmp/aider

USER appuser

ENTRYPOINT ["/venv/bin/aider"]

#########################
FROM base AS aider

ENV AIDER_DOCKER_IMAGE=paulgauthier/aider

COPY . /tmp/aider

# Install dependencies and playwright browsers in one layer
RUN /venv/bin/python -m pip install --upgrade --no-cache-dir pip && \
    /venv/bin/python -m pip install --no-cache-dir /tmp/aider[playwright] boto3 google-cloud-aiplatform \
       --extra-index-url https://download.pytorch.org/whl/cpu && \
    /venv/bin/python -m playwright install --with-deps chromium && \
    find /venv/lib/python3.10/site-packages \( -type d -exec chmod a+rwx {} + \) -o \( -type f -exec chmod a+rw {} + \) && \
    rm -rf /tmp/aider

USER appuser

ENTRYPOINT ["/venv/bin/aider"]
