"""
Dataset Splitter for Arecanut Plant Disease Dataset.
Creates an 80/20 train/validation split into backend/data/train and backend/data/val.
"""

import os
import shutil
import random
from pathlib import Path

def split_dataset(
    source_dir="/home/gopalkrishnajs/Projects/Integer/YLD/datasets/dataset",
    output_base_dir="/home/gopalkrishnajs/Projects/Integer/backend/data",
    train_ratio=0.8,
    seed=42
):
    random.seed(seed)
    
    source_path = Path(source_dir)
    train_out = Path(output_base_dir) / "train"
    val_out = Path(output_base_dir) / "val"
    
    # Clean / create output directories
    for split_dir in [train_out, val_out]:
        if split_dir.exists():
            shutil.rmtree(split_dir)
        split_dir.mkdir(parents=True, exist_ok=True)
        
    print(f"Source Dataset: {source_path}")
    print(f"Output Train: {train_out}")
    print(f"Output Val: {val_out}")
    print(f"Train/Val Split Ratio: {train_ratio * 100:.0f} / {(1 - train_ratio) * 100:.0f} (Seed: {seed})")
    print("=" * 60)
    
    # Collect all images across raw train/test folders grouped by class
    # The source dataset has train/0..8 and test/0..8
    class_all_files = {str(i): [] for i in range(9)}
    
    for split_sub in ["train", "test"]:
        sub_dir = source_path / split_sub
        if not sub_dir.exists():
            continue
        for class_idx in range(9):
            class_folder = sub_dir / str(class_idx)
            if class_folder.exists():
                for img_path in class_folder.glob("*.*"):
                    if img_path.suffix.lower() in [".jpg", ".jpeg", ".png", ".bmp"]:
                        class_all_files[str(class_idx)].append(img_path)
    
    summary = []
    total_train = 0
    total_val = 0
    
    for class_idx in range(9):
        c_str = str(class_idx)
        files = class_all_files[c_str]
        random.shuffle(files)
        
        num_files = len(files)
        num_train = int(num_files * train_ratio)
        
        train_files = files[:num_train]
        val_files = files[num_train:]
        
        # Create class directory in train & val
        (train_out / c_str).mkdir(parents=True, exist_ok=True)
        (val_out / c_str).mkdir(parents=True, exist_ok=True)
        
        # Copy files
        for f in train_files:
            shutil.copy2(f, train_out / c_str / f.name)
        for f in val_files:
            shutil.copy2(f, val_out / c_str / f.name)
            
        total_train += len(train_files)
        total_val += len(val_files)
        
        print(f"Class {c_str}: Total {num_files} -> Train: {len(train_files)} | Val: {len(val_files)}")
        summary.append({
            "class": c_str,
            "total": num_files,
            "train": len(train_files),
            "val": len(val_files)
        })
        
    print("=" * 60)
    print(f"TOTAL: {total_train + total_val} images -> Train: {total_train} | Val: {total_val}")
    return summary

if __name__ == "__main__":
    split_dataset()
