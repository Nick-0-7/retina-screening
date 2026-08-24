"""
Test script: sends a non-retinal photo to the live Vercel API to check
whether the validation guard blocks it or allows it through.
"""
import urllib.request
import http.client
import json

def send_image_to_vercel(img_bytes, filename, label):
    boundary = "TestBoundary7732"
    sep = f"--{boundary}\r\n"
    disp = f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'
    ct   = "Content-Type: image/jpeg\r\n\r\n"
    end  = f"\r\n--{boundary}--\r\n"

    body = (sep + disp + ct).encode() + img_bytes + end.encode()
    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(body)),
    }

    print(f"\n[TEST] Sending {label} ({len(img_bytes)//1024}KB) to live Vercel API...")
    conn = http.client.HTTPSConnection("retina-screening.vercel.app", timeout=40)
    conn.request("POST", "/api/predict", body=body, headers=headers)
    resp = conn.getresponse()
    raw = resp.read().decode()
    conn.close()

    print(f"  HTTP Status : {resp.status}")
    try:
        data = json.loads(raw)
        print(f"  is_valid    : {data.get('is_valid')}")
        print(f"  error       : {data.get('error')}")
        print(f"  message     : {data.get('message')}")
        print(f"  prediction  : {data.get('predicted_class')} ({data.get('confidence')})")
    except Exception:
        print(f"  Raw response: {raw[:300]}")

# ── Test 1: Random landscape / nature photo ──────────────────────────────────
print("Downloading random landscape photo from picsum.photos...")
with urllib.request.urlopen("https://picsum.photos/400/400", timeout=20) as r:
    landscape_bytes = r.read()

send_image_to_vercel(landscape_bytes, "landscape.jpg", "LANDSCAPE (non-retinal)")

# ── Test 2: A solid red JPEG (simulated fundus-like) ──────────────────────────
print("\nCreating solid deep-red test image (retinal-like)...")
from PIL import Image as PILImage
import io, numpy as np

# Simulate a basic retinal fundus image: red dominant, black border
fake_fundus = np.zeros((224, 224, 3), dtype=np.uint8)
fake_fundus[20:204, 20:204, 0] = 160  # R (red channel dominant)
fake_fundus[20:204, 20:204, 1] = 40   # G
fake_fundus[20:204, 20:204, 2] = 20   # B
buf = io.BytesIO()
PILImage.fromarray(fake_fundus, "RGB").save(buf, "JPEG")
red_bytes = buf.getvalue()

send_image_to_vercel(red_bytes, "simulated_fundus.jpg", "SIMULATED DEEP-RED FUNDUS (should pass)")

print("\n\nDone. Check results above.")
