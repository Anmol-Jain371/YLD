"""
Grad-CAM Explainability and Disease Severity Estimation for MobileNetV3-Small.
Computes real gradient backpropagation through the final convolutional layer.
"""

import io
import base64
import numpy as np
import torch
from PIL import Image
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

def generate_gradcam(model, input_tensor, original_pil_image, target_class=None, threshold=0.35):
    """
    Computes authentic Grad-CAM heatmap against MobileNetV3-Small's last conv layer.
    
    Args:
        model: Trained MobileNetV3-Small PyTorch model
        input_tensor: 4D tensor (1, 3, 224, 224) normalized
        original_pil_image: PIL Image object of original input
        target_class: Target class index (int) or None (uses top prediction)
        threshold: Activation threshold for severity estimation (default 0.35)
        
    Returns:
        dict: {
            "overlay_base64": base64 PNG data URL of heatmap overlay on original image,
            "heatmap_base64": base64 PNG data URL of raw heatmap,
            "severity_score_percent": estimated percentage of high-activation affected area,
            "severity_level": "Mild" / "Moderate" / "Severe" / "N/A - Healthy"
        }
    """
    # MobileNetV3-Small target convolutional layer is model.features[-1]
    target_layers = [model.features[-1]]
    
    targets = [ClassifierOutputTarget(target_class)] if target_class is not None else None
    
    # Run Grad-CAM with real gradients
    with GradCAM(model=model, target_layers=target_layers) as cam:
        grayscale_cam = cam(input_tensor=input_tensor, targets=targets)
        # grayscale_cam shape: (1, 224, 224) with values in [0, 1]
        cam_mask = grayscale_cam[0, :]
        
    # Resize original image to 224x224 RGB float array [0, 1]
    rgb_img = original_pil_image.convert("RGB").resize((224, 224))
    rgb_arr = np.float32(rgb_img) / 255.0
    
    # Compute overlay using authentic GradCAM utilities
    visualization = show_cam_on_image(rgb_arr, cam_mask, use_rgb=True)
    
    # Compute raw colormapped heatmap
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * cam_mask), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    # Compute quantitative severity estimate
    # Fraction of area where gradient activation exceeds the significance threshold
    active_pixels = np.sum(cam_mask > threshold)
    total_pixels = cam_mask.size
    severity_pct = round(float(active_pixels / total_pixels) * 100, 1)
    
    # Determine severity label
    if severity_pct < 10.0:
        severity_level = "Mild / Early Stage"
    elif severity_pct < 30.0:
        severity_level = "Moderate"
    elif severity_pct < 55.0:
        severity_level = "Severe"
    else:
        severity_level = "Critical / Advanced"
        
    # Encode images to base64
    def pil_to_base64(pil_img):
        buf = io.BytesIO()
        pil_img.save(buf, format="PNG")
        b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{b64_str}"
        
    overlay_pil = Image.fromarray(visualization)
    heatmap_pil = Image.fromarray(heatmap_colored)
    
    return {
        "overlay_base64": pil_to_base64(overlay_pil),
        "heatmap_base64": pil_to_base64(heatmap_pil),
        "severity_score_percent": severity_pct,
        "severity_level": severity_level,
        "activation_threshold": threshold,
        "cam_mask_raw": cam_mask
    }
