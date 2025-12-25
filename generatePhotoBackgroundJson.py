import os
import json
import re
from PIL import Image

# Constants
year = 2025

# Folder paths
input_folder = f'public/images/{year}/photoBackground/drive'
output_file = f'components/YearOverview/photoBackground/photoBackground{year}.json'

# Function to extract the date from the filename
def extract_date_from_filename(filename):
    # Try to match date in YYYYMMDD format
    date_match = re.match(r'(\d{4})(\d{2})(\d{2})', filename)

    if date_match:
        # If the date matches, format it to YYYY-MM-DD
        formatted_date = f"{date_match[1]}-{date_match[2]}-{date_match[3]}"
        return formatted_date
    else:
        # If no date is found, return an empty string
        return ""

# Function to check if the image is landscape or portrait
def get_image_orientation(image_path):
    with Image.open(image_path) as img:
        width, height = img.size
        return "landscape" if width > height else "portrait"

# List to store the JSON data
json_data = []

# Read all files in the input folder
for filename in os.listdir(input_folder):
    file_path = os.path.join(input_folder, filename)

    # Check if it's a file and has a .jpg extension
    if os.path.isfile(file_path) and filename.lower().endswith('.jpg'):
        date = extract_date_from_filename(filename)

        # Determine if the image is landscape or portrait
        orientation = get_image_orientation(file_path)

        # Prepare the image source URL
        image_src = f"/images/{year}/photoBackground/drive/{filename}"

        # Append the formatted data to json_data
        json_data.append({
            "date": date,  # date can be empty if not found
            "imageSrc": image_src,
            "landscape": orientation == "landscape"
        })

# Write the JSON data to the output file
with open(output_file, 'w') as f:
    json.dump(json_data, f, indent=2)

print(f"JSON data has been written to {output_file}")
