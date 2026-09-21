"""
Logging utility for the Content Authentication application.
"""
import logging
import os

def setup_logger(name, log_file="logs/backend.log", level=logging.INFO):
    """Function to setup a single logger for the entire application"""
    # Ensure the log_file has a directory, default to 'logs/' if none is provided
    if not os.path.dirname(log_file):
        log_file = os.path.join("logs", log_file)

    os.makedirs(os.path.dirname(log_file), exist_ok=True)  # Ensure the logs directory exists

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    handler = logging.FileHandler(log_file)
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(level)
    if not logger.hasHandlers():  # Avoid adding multiple handlers
        logger.addHandler(handler)

    return logger
