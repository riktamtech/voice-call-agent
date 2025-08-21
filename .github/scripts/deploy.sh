#!/bin/bash

# Define variables
LOCAL_BUILD_DIR="./dist"
ZIP_FILE="dist.zip"
EC2_USER="ubuntu"              # Change this if your EC2 username is different
EC2_HOST="54.172.69.143"
REMOTE_DIR="/var/www/voice-call-agent.zinterview.ai"  # Always deploy here

# Step 1: Check if build directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
  echo "Build directory $LOCAL_BUILD_DIR does not exist."
  exit 1
fi

# Step 2: Create a zip of the build folder
echo "Zipping the build folder..."
zip -r $ZIP_FILE $LOCAL_BUILD_DIR
if [ $? -ne 0 ]; then
  echo "Failed to zip the build directory."
  exit 1
fi

# Step 3: Copy the zip file to the EC2 instance
echo "Transferring the zip file to the EC2 instance..."
scp $ZIP_FILE $EC2_USER@$EC2_HOST:/tmp/
if [ $? -ne 0 ]; then
  echo "Failed to transfer zip file."
  exit 1
fi

# Step 4: Connect to the EC2 instance, unzip the file, and move it to the remote directory
echo "Unzipping the build folder on the EC2 instance..."
ssh $EC2_USER@$EC2_HOST << EOF
  unzip -o /tmp/$ZIP_FILE -d /tmp/
  if [ $? -ne 0 ]; then
    echo "Failed to unzip the file on the EC2 instance."
    exit 1
  fi
  sudo rm -rf $REMOTE_DIR/*
  sudo mv /tmp/dist/* $REMOTE_DIR/
  if [ $? -ne 0 ]; then
    echo "Failed to move the build files to the remote directory."
    exit 1
  fi
  rm -f /tmp/$ZIP_FILE
  echo "Unzip and move completed."
EOF
if [ $? -ne 0 ]; then
  echo "Failed to complete operations on the EC2 instance."
  exit 1
fi

# Step 5: Clean up local zip file
echo "Cleaning up local zip file..."
rm -f $ZIP_FILE
if [ $? -ne 0 ]; then
  echo "Failed to clean up local zip file."
  exit 1
fi

echo "Deployment completed successfully."
