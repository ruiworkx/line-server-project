#!/bin/bash
# Check if a file name is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <filename to serve>"
  exit 1
fi

# FILENAME=$1

# Set the FILE_TO_SERVE environment variable and run the server
export FILE_TO_SERVE=$1

# Preprocess the file to create an index
node preprocess.js

# Check if preprocessing was successful
if [ $? -eq 0 ]; then
  node index.js
else
  echo "Failed to preprocess the file."
  exit 1
fi