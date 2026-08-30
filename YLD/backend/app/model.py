"""
PyTorch Model Architecture and Inference Loader for Arecanut Disease Classification.
Uses MobileNetV3-Small with custom classifier head.
"""

import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

NUM_CLASSES = 9

def build_mobilenet_v3_small(num_classes=NUM_CLASSES, pretrained=True):
    """
    Constructs MobileNetV3-Small architecture for 9-class arecanut disease classification.
    """
    if pretrained:
        weights = models.MobileNet_V3_Small_Weights.DEFAULT
        model = models.mobilenet_v3_small(weights=weights)
    else:
        model = models.mobilenet_v3_small(weights=None)
        
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

def get_transforms():
    """
    Returns training and validation transforms.
    """
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    return train_transform, val_transform

def load_trained_model(checkpoint_path="/home/gopalkrishnajs/Projects/Integer/backend/model/areca_model.pt", device=None):
    """
    Loads trained weights into MobileNetV3-Small.
    Returns (model, is_loaded) tuple.
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
    model = build_mobilenet_v3_small(num_classes=NUM_CLASSES, pretrained=False)
    
    if os.path.exists(checkpoint_path):
        state_dict = torch.load(checkpoint_path, map_location=device)
        # Support both raw state_dict and dict with metadata
        if isinstance(state_dict, dict) and "model_state_dict" in state_dict:
            model.load_state_dict(state_dict["model_state_dict"])
        else:
            model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        return model, True, device
    else:
        # Untrained fallback
        model.to(device)
        model.eval()
        return model, False, device
