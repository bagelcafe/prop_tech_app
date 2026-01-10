import os
import re
from datetime import datetime
from stats_service import stats_service

LOG_DIR = "log"

def parse_log_file(path):
    parsed_ips = []
    req_count = 0
    
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    try:
                        # Format: YYYY-MM-DD HH:MM:SS,000 - IP - ...
                        parts = line.split(" - ", 2)
                        if len(parts) >= 2:
                            ip_part = parts[1].strip()
                            parsed_ips.append(ip_part)
                            req_count += 1
                    except:
                        continue
        except Exception as e:
            print(f"Error reading {path}: {e}")
            
    return parsed_ips, req_count

def migrate():
    print("Starting migration...", flush=True)
    if not os.path.exists(LOG_DIR):
        print("No log directory found.")
        return

    all_files = sorted([f for f in os.listdir(LOG_DIR) if f.startswith("service_log_") and f.endswith(".log")])
    
    # Reset stats file first
    if os.path.exists("stats.json"):
        os.remove("stats.json")
    stats_service._ensure_file()
    
    # Load raw data to manipulate manually for migration speed
    with stats_service.lock:
        data = {
            "summary": {"total_visitors": 0, "total_requests": 0},
            "daily": {}
        }
        
        for fname in all_files:
            # service_log_20251225.log
            date_str_raw = fname.replace("service_log_", "").replace(".log", "")
            try:
                dt = datetime.strptime(date_str_raw, "%Y%m%d")
                date_str = dt.strftime("%Y-%m-%d")
            except:
                continue
                
            fpath = os.path.join(LOG_DIR, fname)
            ips, count = parse_log_file(fpath)
            
            if count > 0:
                unique_ips = list(set(ips)) # Dedup for standard
                
                print(f"Migrating {date_str}: {count} requests, {len(unique_ips)} visitors", flush=True)
                
                data["daily"][date_str] = {
                    "requests": count,
                    "visitors": unique_ips
                }
                
                data["summary"]["total_requests"] += count
                data["summary"]["total_visitors"] += len(unique_ips)
        
        stats_service._save_data(data)
        print("Migration complete.", flush=True)

if __name__ == "__main__":
    migrate()
