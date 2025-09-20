import openpyxl

wb = openpyxl.load_workbook('182 perfumes.xlsx')
ws = wb.active

for i, row in enumerate(ws.iter_rows(min_row=1, max_row=20, values_only=True), 1):
    print(i, row)
