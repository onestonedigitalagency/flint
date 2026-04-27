#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment using Python 3.12..."
    python3.12 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Seed the database
echo "Seeding database..."
python3 seed.py

# Start the server
echo "Starting FastAPI server..."
python3 -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
