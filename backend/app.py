"""
Backward compatibility adapter for the Content Authentication API.
This file imports from the restructured app package to maintain compatibility
with existing integrations while we transition to the new structure.
"""
from app.main import app

# The app instance is imported from the restructured package
# This ensures that any code that imports from the original app.py
# will still function correctly during the transition period.