import sys
import os
from pathlib import Path

# Add project root to sys.path dynamically
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

"""
Training Script for Arecanut Disease Classification using MobileNetV3-Small.
Trains on backend/data/train and evaluates on backend/data/val.
Saves model checkpoint to backend/model/areca_model.pt.
"""

import time
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from backend.app.model import build_mobilenet_v3_small, get_transforms, NUM_CLASSES
from backend.app.disease_info import CLASS_NAMES

def train_model(
    data_dir=None,
    model_save_path=None,
    epochs=15,
    batch_size=32,
    learning_rate=3e-4,
    device=None
):
    backend_dir = Path(__file__).resolve().parents[1]
    if data_dir is None:
        data_dir = str(backend_dir / "data")
    if model_save_path is None:
        model_save_path = str(backend_dir / "model" / "areca_model.pt")
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
    print(f"=== Starting Arecanut Disease Model Training ===")
    print(f"Device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")
    print(f"Batch Size: {batch_size} | Epochs: {epochs} | LR: {learning_rate}")
    print(f"Number of Classes: {NUM_CLASSES}")
    
    train_transform, val_transform = get_transforms()
    
    train_dir = os.path.join(data_dir, "train")
    val_dir = os.path.join(data_dir, "val")
    
    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        raise FileNotFoundError(f"Train/Val directories not found. Please run split_dataset.py first.")
        
    train_dataset = ImageFolder(root=train_dir, transform=train_transform)
    val_dataset = ImageFolder(root=val_dir, transform=val_transform)
    
    print(f"Train samples: {len(train_dataset)} | Validation samples: {len(val_dataset)}")
    print(f"Class mapping: {train_dataset.class_to_idx}")
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=2,
        pin_memory=(device.type == "cuda")
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=2,
        pin_memory=(device.type == "cuda")
    )
    
    # Instantiate MobileNetV3-Small with ImageNet pretrained backbone
    model = build_mobilenet_v3_small(num_classes=NUM_CLASSES, pretrained=True)
    model.to(device)
    
    criterion = nn.CrossEntropyLoss(label_smoothing=0.05)
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-2)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    
    best_val_acc = 0.0
    history = {
        "epochs": [],
        "train_loss": [],
        "train_acc": [],
        "val_loss": [],
        "val_acc": []
    }
    
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    
    total_start_time = time.time()
    
    for epoch in range(1, epochs + 1):
        epoch_start = time.time()
        
        # --- Training Phase ---
        model.train()
        running_train_loss = 0.0
        correct_train = 0
        total_train = 0
        
        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_train_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total_train += labels.size(0)
            correct_train += predicted.eq(labels).sum().item()
            
        scheduler.step()
        epoch_train_loss = running_train_loss / total_train
        epoch_train_acc = 100.0 * correct_train / total_train
        
        # --- Validation Phase ---
        model.eval()
        running_val_loss = 0.0
        correct_val = 0
        total_val = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                labels = labels.to(device)
                
                outputs = model(images)
                loss = criterion(outputs, labels)
                
                running_val_loss += loss.item() * images.size(0)
                _, predicted = outputs.max(1)
                total_val += labels.size(0)
                correct_val += predicted.eq(labels).sum().item()
                
        epoch_val_loss = running_val_loss / total_val
        epoch_val_acc = 100.0 * correct_val / total_val
        epoch_duration = time.time() - epoch_start
        
        history["epochs"].append(epoch)
        history["train_loss"].append(round(epoch_train_loss, 4))
        history["train_acc"].append(round(epoch_train_acc, 2))
        history["val_loss"].append(round(epoch_val_loss, 4))
        history["val_acc"].append(round(epoch_val_acc, 2))
        
        print(f"Epoch [{epoch:02d}/{epochs:02d}] "
              f"Train Loss: {epoch_train_loss:.4f} | Train Acc: {epoch_train_acc:6.2f}% | "
              f"Val Loss: {epoch_val_loss:.4f} | Val Acc: {epoch_val_acc:6.2f}% | "
              f"Time: {epoch_duration:.1f}s")
        
        # Save best model
        if epoch_val_acc > best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "val_acc": epoch_val_acc,
                "class_names": CLASS_NAMES,
                "class_to_idx": train_dataset.class_to_idx
            }, model_save_path)
            print(f"  --> Saved new best checkpoint (Val Acc: {best_val_acc:.2f}%) to {model_save_path}")
            
    total_duration = time.time() - total_start_time
    print("=" * 60)
    print(f"Training Complete in {total_duration / 60:.2f} minutes!")
    print(f"Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"Final Model Saved to: {model_save_path}")
    
    # Save training history JSON
    history_file = os.path.join(os.path.dirname(model_save_path), "training_history.json")
    with open(history_file, "w") as f:
        json.dump(history, f, indent=2)
    print(f"Training History Saved to: {history_file}")
    
    return history

if __name__ == "__main__":
    train_model()
