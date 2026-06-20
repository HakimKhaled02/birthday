#!/bin/bash
cd "$(dirname "$0")/images"
python3 << 'EOF'
import json
import os
import re

folder = "."
ext = re.compile(r"\.(jpe?g|png|webp|gif)$", re.I)
files = sorted(f for f in os.listdir(folder) if ext.search(f))
paths = [f"images/{f}" for f in files]
with open("list.json", "w") as out:
    json.dump(paths, out, indent=2)
    out.write("\n")
print(f"Updated {len(paths)} images in images/list.json")
EOF
