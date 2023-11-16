import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # Create a list to store the converted JSON data
    json_list = []

    # Read the CSV file
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        # Use DictReader to create a dictionary for each row
        csv_reader = csv.DictReader(file)

        # Add each row dictionary to the list
        for row in csv_reader:
            json_list.append(row)

    # Write the JSON data to a file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json_file.write(json.dumps(json_list, indent=4, ensure_ascii=False))

# Example usage
csv_to_json('chinese_food_menu_withoutID.csv', 'chinese_food_menu_withoutID.json')