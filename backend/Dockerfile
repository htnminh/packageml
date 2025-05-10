FROM python:3.9-slim

WORKDIR /app

# Install dependencies with cache optimization
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Create a non-root user for security
RUN adduser --disabled-password --gecos "" appuser

COPY . .

# Change ownership to the non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

EXPOSE 8000

# Run migrations and then start the app
CMD ["sh", "-c", "python run_migrations.py && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"] 