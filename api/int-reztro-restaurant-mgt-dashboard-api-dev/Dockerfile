# ---------- builder ----------
FROM python:3.12-slim AS builder
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /wheels

# Install build deps for wheels + unixODBC dev
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    gnupg \
    ca-certificates \
    unixodbc-dev \
    libssl-dev \
    apt-transport-https \
    python3-dev \
    pkg-config \
  && rm -rf /var/lib/apt/lists/*

# Upgrade pip and build wheels for all requirements (so runtime can install from wheels)
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
 && pip wheel --no-cache-dir -r requirements.txt -w /wheels

# ---------- runtime ----------
FROM python:3.12-slim

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Install runtime prerequisites (no libcrypto3/libssl3 explicit)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    apt-transport-https \
    unixodbc \
    unixodbc-dev \
    libssl-dev \
    libkrb5-3 \
    lsb-release \
  && rm -rf /var/lib/apt/lists/*

# Add Microsoft package repo and install msodbcsql17 (ODBC Driver 17 for SQL Server)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      curl \
      gnupg \
      ca-certificates \
      apt-transport-https \
    && rm -rf /var/lib/apt/lists/* \
 \
 && curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-prod.gpg \
 \
 && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
    > /etc/apt/sources.list.d/microsoft-prod.list \
 \
 && apt-get update \
 && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql17 \
 && rm -rf /var/lib/apt/lists/*

# Copy built wheels from builder and install dependencies from wheels
COPY --from=builder /wheels /wheels
COPY requirements.txt .
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt

# Copy application code
COPY app ./app

# Create a minimal entrypoint user (optional security)
# RUN useradd --create-home appuser || true
# USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]