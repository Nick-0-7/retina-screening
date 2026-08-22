import cv2  # type: ignore
import numpy as np


def is_fundus_image(image_bytes):
    """
    Basic fundus-image detector.

    This is a screening gate, NOT a medical diagnostic model.
    It is intended to reject obviously non-retinal images before
    sending an image to the DR classifier.
    """

    # Decode image
    image_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        return False, 0.0, "Invalid image"

    # Convert to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    h, w, _ = image.shape

    # Fundus photographs are normally reasonably large
    if h < 150 or w < 150:
        return False, 0.0, "Image resolution too small"

    # Resize for analysis
    small = cv2.resize(image, (512, 512))

    # ---------------------------------------------------------
    # 1. Detect whether image has a roughly circular bright
    #    retinal field
    # ---------------------------------------------------------

    gray = cv2.cvtColor(small, cv2.COLOR_RGB2GRAY)

    # Blur noise
    gray_blur = cv2.GaussianBlur(gray, (9, 9), 2)

    circles = cv2.HoughCircles(
        gray_blur,
        cv2.HOUGH_GRADIENT,
        dp=1.2,
        minDist=100,
        param1=100,
        param2=40,
        minRadius=120,
        maxRadius=260
    )

    circle_score = 0.0

    if circles is not None:
        circles = np.round(circles[0]).astype(int)

        # A detected circular field strongly supports
        # the possibility of a fundus photograph.
        circle_score = 0.4

    # ---------------------------------------------------------
    # 2. Analyze color distribution
    # ---------------------------------------------------------

    hsv = cv2.cvtColor(small, cv2.COLOR_RGB2HSV)

    saturation = hsv[:, :, 1]
    value = hsv[:, :, 2]

    mean_saturation = float(np.mean(saturation))
    mean_brightness = float(np.mean(value))

    # Fundus images usually contain significant red/orange
    # retinal coloration.
    red = small[:, :, 0].astype(np.float32)
    green = small[:, :, 1].astype(np.float32)
    blue = small[:, :, 2].astype(np.float32)

    red_dominance = np.mean(
        (red > green * 1.05) &
        (red > blue * 1.05)
    )

    color_score = 0.0

    if 0.15 < red_dominance < 0.90:
        color_score = 0.3

    # ---------------------------------------------------------
    # 3. Dark border / circular field analysis
    # ---------------------------------------------------------

    # Compare center brightness with corners.
    center = small[128:384, 128:384]
    
    corners = np.concatenate([
        small[:100, :100].reshape(-1, 3),
        small[:100, -100:].reshape(-1, 3),
        small[-100:, :100].reshape(-1, 3),
        small[-100:, -100:].reshape(-1, 3)
    ])

    center_brightness = np.mean(
        cv2.cvtColor(center, cv2.COLOR_RGB2GRAY)
    )

    corner_brightness = np.mean(
        cv2.cvtColor(corners.reshape(-1, 1, 3), cv2.COLOR_RGB2GRAY)
    )

    border_score = 0.0

    if center_brightness > corner_brightness * 1.15:
        border_score = 0.2

    # ---------------------------------------------------------
    # 4. Combine scores
    # ---------------------------------------------------------

    score = circle_score + color_score + border_score

    # Additional brightness/saturation sanity checks
    if 40 < mean_brightness < 230:
        score += 0.05

    if 20 < mean_saturation < 220:
        score += 0.05

    score = min(score, 1.0)

    is_fundus = score >= 0.50

    if is_fundus:
        message = "Image appears to be a fundus photograph"
    else:
        message = "Image does not appear to be a fundus photograph"

    return is_fundus, score, message