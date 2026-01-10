from services import service
import sys
import logging

# Configure logging to show up in terminal
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

print("--- Starting Debug Check ---")

# Eunpyeong-gu Code: 11380
# Eungam-dong
# Date: 202511

print("1. Search Lawd Code for '응암동'")
codes = service.search_lawd_codes("응암동")
print(f"Found: {codes}")

target_code = None
for c in codes:
    if "은평구" in c['label'] and c['dong_name'] == "응암동":
        target_code = c['code']
        print(f"Selected Code: {target_code} ({c['label']})")
        break

if target_code:
    print(f"\n2. Fetch Data for Code {target_code}, Month 202511")
    data = service.get_real_estate_data(target_code, "응암동", "all", "202511", "202511")
    print(f"Data retrieved: {len(data)} items")
    if len(data) > 0:
        print("Sample item:", data[0])
else:
    print("Could not find Eungam-dong in Eunpyeong-gu.")

print("--- End Debug Check ---")
