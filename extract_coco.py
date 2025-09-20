import openpyxl
import json
import re

wb = openpyxl.load_workbook('182 perfumes.xlsx')
ws = wb.active

coco_perfumes = {}

for row in ws.iter_rows(min_row=1, values_only=True):
    barcode, name, price = row[0], row[1], row[2]
    if name and 'CHANEL' in name.upper() and 'COCO' in name.upper():
        # Extract base name (without size/type/gender)
        base = re.sub(r'\(.*?\)', '', name).strip()  # Remove (M)/(W) etc
        # Extract size (e.g., 100 ml, 50 ml, 20 ml, etc)
        size_match = re.search(r'(\d+\s?ml)', name.lower())
        size = size_match.group(1).replace(' ', '') if size_match else None
        # Extract type (EDP, EDT, PARFUM, etc)
        type_match = re.search(r'(EDP|EDT|PARFUM|COLOGNE)', name.upper())
        typ = type_match.group(1) if type_match else ''
        # Compose a key for the perfume variant (e.g., COCO MADEMOISELLE EDP)
        key = f"{base} {typ}".strip()
        if key not in coco_perfumes:
            coco_perfumes[key] = []
        if size and size not in coco_perfumes[key]:
            coco_perfumes[key].append(size)

with open('coco_perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(coco_perfumes, f, ensure_ascii=False, indent=2)

print('Extracted Coco perfumes and sizes to coco_perfumes.json')
