import pandas as pd

def xlsx_to_csv(xlsx_file_path, csv_file_path):
    # Read the Excel file
    data = pd.read_excel(xlsx_file_path)
    
    # Save to CSV file
    data.to_csv(csv_file_path, index=False)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python xlsxToCsv.py <input.xlsx> <output.csv>")
    else:
        xlsx_file = sys.argv[1]
        csv_file = sys.argv[2]
        xlsx_to_csv(xlsx_file, csv_file)
        print(f"Converted {xlsx_file} to {csv_file}")
