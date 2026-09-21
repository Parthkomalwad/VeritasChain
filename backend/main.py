"""
Main entry point for the Content Authentication API server.
"""
import uvicorn
import os
from pathlib import Path

# Add the project root to Python path to ensure imports work correctly
project_root = Path(__file__).parent
if str(project_root) not in os.sys.path:
    os.sys.path.insert(0, str(project_root))

from app.main import app

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
