FROM 495519747063.dkr.ecr.us-east-2.amazonaws.com/awsfusionruntime-python311-build:uuid-python311-20250125-003706-65 AS pre-build-stage
# # Use a lightweight Python image
# FROM python:3.9  

FROM pre-build-stage as build-stage
WORKDIR /

# Add these lines to ensure Python and pip are available
ENV PATH="/usr/local/bin:${PATH}"
RUN python3 -m ensurepip
RUN python3 -m pip install --upgrade pip

# Now install requirements
RUN python3 -m pip install -r requirements.txt

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
