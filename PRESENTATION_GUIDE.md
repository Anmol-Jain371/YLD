# 🎓 AdikeScan: Professor Presentation & Defense Guide
**Project Title**: *AdikeScan — Multi-Scale Arecanut Palm Pathology System: Spaceborne Satellite Surveillance (Sentinel-2) & Edge Explainable AI (MobileNetV3 + Grad-CAM)*  
**Institution**: *Department of MCA, RV College of Engineering, Bengaluru, Karnataka*  
**Authors / Team**: *Akash Gurusiddappa Bhagoji • Anmol Jain P • Gopal Krishna • Hemanth*  
**Core Technologies**: PyTorch • MobileNetV3-Small • Grad-CAM • Sentinel-2 (QGIS) • XGBoost/Random Forest • FastAPI • React 19 • Vite 6  

---

## 📌 Table of Contents
1. [30-Second Elevator Pitch](#1-30-second-elevator-pitch)
2. [Project Motivation & Agricultural Problem](#2-project-motivation--agricultural-problem)
3. [Dual-Tier System Architecture (Macro + Micro)](#3-dual-tier-system-architecture-macro--micro)
4. [Tier 1: Spaceborne Remote Sensing (Sentinel-2 & 15 Indices)](#4-tier-1-spaceborne-remote-sensing-sentinel-2--15-indices)
5. [Tier 2: Deep Learning & Explainable AI (XAI) Deep Dive](#5-tier-2-deep-learning--explainable-ai-xai-deep-dive)
6. [Step-by-Step Live Demo Presentation Script](#6-step-by-step-live-demo-presentation-script)
7. [Professor Q&A Defense — Tough Questions & Model Answers](#7-professor-qa-defense--tough-questions--model-answers)
8. [Team Work Distribution & Contribution Summary](#8-team-work-distribution--contribution-summary)

---

## 1. 30-Second Elevator Pitch
> *"Good morning Professor. Today we present **AdikeScan**, a dual-tier precision pathology ecosystem for Arecanut palms (*Areca catechu*), an essential commercial crop supporting 10 million farming livelihoods across Karnataka.  
> 
> Our system operates across two complementary spatial scales:  
> 1. **Macro-Scale Surveillance**: Using spaceborne **Sentinel-2 multispectral satellite imagery (10 m)** and **15 vegetation indices (specifically red-edge NDRE and moisture-normalized NDMI)** across 72 taluk-month datasets in Sringeri and Sulya, our machine learning pipeline flags disease hotspots and canopy stress months before visible necrosis.  
> 2. **Micro-Scale Field Diagnosis**: Extension officers visit flagged clusters with our web/mobile edge diagnostic portal, where an ultra-compact **MobileNetV3-Small CNN** classifies 9 anatomical and pathological classes (99.52% accuracy), verified by **Grad-CAM visual saliency heatmaps**, quantitative infection severity scores, and prescriptive agronomic treatment protocols."*

---

## 2. Project Motivation & Agricultural Problem

### The Core Problem:
* **Economic Importance**: Arecanut (*Adike* in Kannada) is cultivated extensively across Karnataka (Malnad & Coastal regions), Kerala, and Assam.
* **Devastating Pathogen Threats**:
  1. **Yellow Leaf Disease (YLD)**: A systemic phytoplasma disease transmitted by plant hoppers (*Proutista moesta*) that causes severe chlorosis, root necrosis, and up to 50% yield collapse within 3 years (87–96% incidence recorded in Sringeri and Koppa).
  2. **Koleroga / Mahali (Fruit Rot)**: Caused by *Phytophthora meadii*, devastating fruit bunches during monsoon downpours within days.
  3. **Stem Bleeding & Bud Rot**: Vascular fungal necrosis (*Thielaviopsis paradoxa*).
* **The Traditional Monitoring Gap**:
  * Ground scouting checks only a few gardens per taluk and only catches disease *after* visible crown collapse.
  * Satellite-only tools lack field-level verification and chemical remedy guidance.
* **The AdikeScan Solution**:
  * Combines **Spaceborne Early Warning** (Sentinel-2 + Weather Normalization) with **Ground Edge Diagnostics** (MobileNetV3 + Grad-CAM XAI).

---

## 3. Dual-Tier System Architecture (Macro + Micro)

```
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 1: MACRO-SURVEILLANCE (Sentinel-2 GIS)              │
│  - 72 Taluk-Month Datasets (Sringeri & Sulya Taluks, 3-Year Time-Series)│
│  - 15 Vegetation Indices (NDRE, PSRI, NDMI, NDVI, etc.)                │
│  - KSNDMC Weather Normalization (Rainfall & Temperature Decoupling)    │
│  - Random Forest & XGBoost Classifiers (F1: 0.9152, ROC-AUC: 1.000)    │
│  - Output: Spatial Risk Probability Rasters & Hotspot Geocoordinates   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Alerts dispatched to extension officers
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 2: MICRO-DIAGNOSIS (AdikeScan Edge AI)              │
│  - Client: React 19 + Botanical Glassmorphic Portal (Vite 6)           │
│  - Microservice: Asynchronous FastAPI REST Engine                      │
│  - Inference: MobileNetV3-Small (99.52% Val Acc, 6.2 MB Checkpoint)   │
│  - XAI Engine: Authentic Grad-CAM Backprop via model.features[-1]      │
│  - Severity: Area percentage exceeding threshold (tau = 0.35)          │
│  - Agronomic Engine: Standardized chemical & cultural remedies         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Tier 1: Spaceborne Remote Sensing (Sentinel-2 & 15 Indices)

### The 15 Vegetation Indices Funnel
| Domain | Index | Formula | Agronomic Significance |
|:---|:---|:---|:---|
| **Chlorophyll & Red-Edge** | **NDRE** | $(B8A - B5) / (B8A + B5)$ | **Core early alarm**: Chlorophyll loss detected before visible yellowing |
| | **CIre** | $(B7 / B5) - 1$ | Measures total canopy chlorophyll content |
| | **MTCI** | $(B6 - B5) / (B5 - B4)$ | Red-edge position tracking |
| | **IRECI** | $(B7 - B4) / (B5 / B6)$ | Chlorophyll and leaf area in dense canopies |
| | **GNDVI** | $(B8 - B3) / (B8 + B3)$ | Early hint of falling green reflectance |
| **Yellowing & Water Stress** | **PSRI** | $(B4 - B2) / B6$ | Detects carotenoid buildup & canopy chlorosis |
| | **NDMI** | $(B8A - B11) / (B8A + B11)$ | **Decouples drought stress from disease** |
| | **MSI** | $B11 / B8$ | Moisture stress ratio (higher = drier) |
| **Greenness & Biomass** | **NDVI** | $(B8 - B4) / (B8 + B4)$ | Baseline canopy density; agricultural mask ($> 0.45$) |
| | **SAVI** | $1.5 \cdot (B8 - B4) / (B8 + B4 + 0.5)$ | Eliminates bare-soil reflection |
| | **EVI** | $2.5 \cdot (B8 - B4) / (B8 + 6B4 - 7.5B2 + 1)$ | High-density canopy saturation resistance |
| **Land-Cover Masking** | **NDWI / NDBI / BSI** | Spectral Ratios | Masks out water, built structures, and fallow terrain |

### Machine Learning Performance on Sringeri 3-Year Dataset:
* **Features**: 18 Predictor Variables (Bands $B2, B3, B4, B5, B8, B11$, Temporal Indices for 2023–2025, $\Delta\text{NDRE}, \Delta\text{NDVI}$, and Weather).
* **5-Fold Stratified Cross-Validation F1-Score**: **$0.9152 \pm 0.0431$**
* **Test Set ROC-AUC**: **$1.0000$**
* **Output**: Spatial risk rasters exported to GeoTIFF for plantation zoning.

---

## 5. Tier 2: Deep Learning & Explainable AI (XAI) Deep Dive

### Model Architecture
* **Backbone**: MobileNetV3-Small (Pretrained on ImageNet-1K).
* **Head**: Adaptive Average Pooling $\rightarrow$ Linear(1024, 9).
* **Size**: **~2.54 Million parameters**, **6.2 MB** checkpoint (`areca_model.pt`).
* **Validation Accuracy**: **99.52%**.

### 9-Class Fine-Grained Taxonomy
1. **Bud Borer** (*Carvalhoia arecae*)
2. **Healthy Foot** (Anatomical Control)
3. **Healthy Leaf** (Anatomical Control)
4. **Healthy Nut** (Anatomical Control)
5. **Healthy Trunk** (Anatomical Control)
6. **Mahali Koleroga** (*Phytophthora meadii*)
7. **Stem Cracking** (Physiological / Fungal)
8. **Stem Bleeding** (*Thielaviopsis paradoxa*)
9. **Yellow Leaf Disease** (Phytoplasma)

### Authentic Grad-CAM Mathematical Formulation
* **Target Layer**: `model.features[-1]`
* **Gradient Computation**:
  $$\alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial y^c}{\partial A_{i,j}^k}$$
  $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$
* **Quantitative Symptomatic Severity**:
  $$\text{Severity \%} = \frac{\sum (M_{i,j} > 0.35)}{N_{\text{total}}} \times 100$$
  * $< 10\%$: Mild / Early Stage
  * $10\% - 30\%$: Moderate
  * $30\% - 55\%$: Severe
  * $\ge 55\%$: Critical / Advanced

---

## 6. Step-by-Step Live Demo Presentation Script

### Step 1: System Overview & Architecture (1 min)
* Open browser at `http://localhost:5173`.
* Highlight the dual-tier design: satellite early warning down to ground-level leaf inspection.
* Point out the connection indicator showing active FastAPI backend and CUDA/CPU device acceleration.

### Step 2: Specimen Upload & Real-Time Inference (1.5 min)
* Upload a sample frond with severe chlorosis (Yellow Leaf Disease).
* Show instantaneous inference ($\approx 40\text{ ms}$).
* Review the certainty score ($> 99\%$) and full 9-class probability distribution.

### Step 3: Explainable AI & Severity Heatmap (1.5 min)
* Switch to the **Grad-CAM Viewer**.
* Toggle between **Saliency Overlay** and **Jet Heatmap**.
* Explain: *"The model isn't guessing; the red activations pinpoint the vascular chlorosis along the frond pinnules."*
* Point out the **Symptomatic Severity Metric** ($38.5\%$ — Severe).

### Step 4: Agronomic Treatment Guidance (1 min)
* Switch to the **Treatment** tab in the Prediction Card.
* Show immediate chemical controls (vector control spray: Dimethoate 0.05%, micronutrient soil correction).
* Show cultural management practices (intercropping with cocoa/pepper, soil drainage).

### Step 5: Disease Catalog Modal (30 sec)
* Click **"Browse Botanical Catalog"** in the top navigation.
* Demonstrate all 9 conditions with their clinical symptoms, causes, and prevention protocols.

---

## 7. Professor Q&A Defense — Tough Questions & Model Answers

### Q1: *"How do you connect spaceborne Sentinel-2 satellite data with a leaf-level mobile application?"*
* **Answer**:
  > *"We treat pathology as a multi-scale hierarchy. Satellite remote sensing has a 10-meter spatial resolution, which is ideal for monitoring entire plantation blocks (72 taluk-months across Sringeri and Sulya) and detecting canopy stress via red-edge indices like NDRE. When the satellite pipeline flags an orchard as 'Suspected YLD', extension officers receive GPS alerts and use our MobileNetV3 web tool on-site for palm-by-palm confirmation and treatment guidance."*

### Q2: *"Why use red-edge indices like NDRE instead of standard NDVI?"*
* **Answer**:
  > *"Standard NDVI relies on red ($B4$) and near-infrared ($B8$). In thick plantation canopies, NDVI saturates quickly and only shows significant drops after major chlorophyll necrosis (when leaves are already brown). In contrast, NDRE uses the red-edge band ($B5$ / $B8A$), which is highly sensitive to subtle, early-stage reductions in chlorophyll content, giving farmers up to 2–3 months of early warning before visible canopy collapse."*

### Q3: *"How do you know the canopy yellowing isn't just drought or lack of water?"*
* **Answer**:
  > *"We addressed this through weather normalization. We compute the Normalized Difference Moisture Index (NDMI) and Moisture Stress Index (MSI) and cross-reference them with monthly rainfall and temperature data from the Karnataka State Natural Disaster Monitoring Centre (KSNDMC). If canopy stress correlates with zero precipitation and high MSI across the entire valley, it is classified as drought stress; if the decline is chronic, localized, and persists across rainy seasons, it is flagged as YLD."*

### Q4: *"Why MobileNetV3-Small instead of a deeper network like ResNet-50 or ViT?"*
* **Answer**:
  > *"MobileNetV3-Small was engineered specifically for edge and mobile execution. Using depthwise separable convolutions and inverted residual blocks, it achieves 99.52% accuracy with only 2.54 million parameters and a 6.2 MB checkpoint, compared to ResNet-50's 25 million parameters and ~100 MB footprint. It runs in under 50 ms even on basic CPU hardware."*

### Q5: *"Why hook into `features[-1]` for Grad-CAM?"*
* **Answer**:
  > *"The final convolutional layer (`model.features[-1]`) represents the optimal balance between high-level semantic pathology representations (lesion textures and yellow chlorosis margins) and spatial localization coordinates before global pooling. Earlier layers only hold non-specific primitive edges."*

### Q6: *"How did you handle the extreme class imbalance in the satellite dataset?"*
* **Answer**:
  > *"In our Sringeri pilot dataset, chronic YLD hotspots represent a minority class. We utilized Stratified 5-Fold Cross-Validation, class-weighted loss functions, and XGBoost with scale_pos_weight tuning, achieving a 5-fold cross-validation F1-score of 0.9152 and a ROC-AUC of 1.0000."*

---

## 8. Team Work Distribution & Contribution Summary

| Team Member | Core Project Domain | Primary Technical Responsibilities |
| :--- | :--- | :--- |
| **Anmol Jain P (Lead)** | **System Architecture & Integration** | FastAPI asynchronous microservice, dynamic cross-platform path resolution, React botanical glassmorphism UI, end-to-end integration & live demo |
| **Akash Gurusiddappa Bhagoji** | **Satellite Remote Sensing & GIS** | Sentinel-2 multispectral pipeline, QGIS spatial processing, 15 vegetation index feature engineering (NDRE, CIre, PSRI), 72 taluk-month dataset collection |
| **Gopal Krishna** | **Machine Learning & Meteorological Modeling**| 3-year Sringeri dataset analysis, KSNDMC weather normalization, Random Forest & XGBoost model training (F1: 0.9152), GeoTIFF probability map generation |
| **Hemanth** | **Deep Learning & Explainable AI (XAI)** | MobileNetV3-Small classifier training (99.52% val acc), PyTorch autograd Grad-CAM saliency engine, quantitative severity area calculation |

---
*All references, papers, and Colab notebooks are maintained in the local `/docs/` repository directory.*
