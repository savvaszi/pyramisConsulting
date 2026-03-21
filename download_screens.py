import json
import urllib.request
import os

with open(r"C:\Users\Teacher\.gemini\antigravity\brain\31cdfc84-fbe4-4d5f-8eda-547e26e7f3c9\.system_generated\steps\30\output.txt", "r", encoding="utf-8") as f:
    data = json.load(f)

for screen in data.get("screens", []):
    title = screen.get("title")
    html_code = screen.get("htmlCode")
    if not html_code:
        continue
    download_url = html_code.get("downloadUrl")
    if not download_url:
        continue

    filename = title.replace("Pyramis - ", "").replace(" ", "_").lower() + ".html"
    print(f"Downloading {title} to {filename}...")
    req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            with open(filename, "wb") as out:
                out.write(content)
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("Done.")
