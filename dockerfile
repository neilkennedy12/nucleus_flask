# Use a lightweight Python image
FROM python:3.9  

# Set the working directory
WORKDIR / 

# Copy and install dependencies
COPY requirements.txt .  
RUN pip install -r requirements.txt  

# Copy app files
COPY . .  

# Expose port 8080 (required for App Runner)
EXPOSE 8080  

# Run the app with Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "app:app"]