import pandas as pd

def xlsx_to_csv(xlsx_file_path, csv_file_path):
    """
    Convert an Excel file to a CSV file, preserving the column structure.
    
    :param xlsx_file_path: Path to the input .xlsx file
    :param csv_file_path: Path to the output .csv file
    """
    # Read the Excel file
    data = pd.read_excel(xlsx_file_path)
    
    # Save to CSV file, without the index
    data.to_csv(csv_file_path, index=False)
    print(f"Converted {xlsx_file_path} to {csv_file_path}")

# Hardcoded paths for the input and output files
input_xlsx_path = "Vector_menu_foods.xlsx"  # Replace with your input file path
output_csv_path = "Vector_menu_foods.csv"  # Replace with your output file path

# Call the function with the hardcoded paths
xlsx_to_csv(input_xlsx_path, output_csv_path)

