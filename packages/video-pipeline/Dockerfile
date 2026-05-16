FROM python:3.13-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nodejs \
    npm \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Install HyperFrames CLI
RUN npm install -g hyperframes@latest

# Install Python deps
COPY requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt

# Copy code
COPY . .

# Create dirs
RUN mkdir -p out logs data checkpoints

ENV PYTHONPATH=/app
ENV REDIS_URL=redis://localhost:6379/0

CMD ["python", "cli.py", "worker"]
