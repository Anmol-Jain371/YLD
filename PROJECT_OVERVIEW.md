# 🌿 AdikeScan (YLD) — Comprehensive Project Overview
**System Name**: *AdikeScan — Multi-Scale Arecanut Palm Pathology Diagnostic & Explainable AI System*  
**Repository**: `Kr1szz/YLD` • **Branch**: `feature/refactor-backend`  
**Authors**: *Akash Gurusiddappa Bhagoji • Anmol Jain P • Gopal Krishna • Hemanth*  
**Department**: *Department of MCA, RV College of Engineering, Bengaluru, Karnataka*  
**Core Technologies**: PyTorch • MobileNetV3-Small • Grad-CAM • Sentinel-2 (QGIS) • XGBoost / Random Forest • FastAPI • React 19 • Vite 6  

---

## 1. Executive Summary
**AdikeScan** is an end-to-end, multi-scale intelligent agricultural pathology system designed to monitor, classify, quantify, and explain diseases affecting **Arecanut palms (*Areca catechu*)**. 

The system operates across two complementary spatial scales:
1. **Tier 1: Macro-Scale Satellite Surveillance**: Uses Sentinel-2 spaceborne multispectral imagery (10 m resolution) across 72 taluk-month datasets (Sringeri & Sulya taluks) and 15 vegetation indices (specifically red-edge `NDRE` and moisture-normalized `NDMI`) to detect pre-visual canopy stress and map Yellow Leaf Disease (YLD) hotspots months before visible crown damage.
2. **Tier 2: Micro-Scale Edge Diagnostic Portal**: Extension officers visit flagged orchards and upload specimen photos (fronds, trunk, nuts, foot) to a MobileNetV3-Small CNN (99.52% accuracy), verified by **Gradient-weighted Class Activation Mapping (Grad-CAM)** saliency heatmaps, quantitative tissue severity scores, and prescriptive agronomic treatment protocols.

```
                      ┌─────────────────────────────────────────┐
                      │    TIER 1: MACRO SATELLITE SURVEILLANCE │
                      │  - Sentinel-2 Level-2A 10m Imagery      │
                      │  - 72 Taluk-Months (Sringeri & Sulya)   │
                      │  - 15 Vegetation Indices (NDRE, PSRI)   │
                      │  - KSNDMC Weather Decoupling            │
                      │  - XGBoost & Random Forest (F1: 0.9152) │
                      └────────────────────┬────────────────────┘
                                           │ Hotspot Geocoordinates
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    TIER 2: MICRO FIELD-LEVEL DIAGNOSIS  │
                      │  - Farmer / Agronomist Edge Device      │
                      │  - Multi-part Specimen Upload           │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │          FastAPI Microservice           │
                      │  - Preprocessing (224×224 Normalization)│
                      │  - Asynchronous Request Routing         │
                      └────────────────────┬────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
┌───────────────────────────────────────┐     ┌───────────────────────────────────────┐
│     MobileNetV3-Small Classifier      │     │         Grad-CAM XAI Engine           │
│ - 9-Class Softmax Probability Vector  │     │ - Backprop gradients to features[-1]  │
│ - 99.52% Validation Accuracy          │     │ - Jet Heatmap & Saliency Overlay      │
│ - Compact 6.2 MB Checkpoint           │     │ - Quantitative Severity Estimation    │
└───────────────────┬───────────────────┘     └───────────────────┬───────────────────┘
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │ Structured JSON Payload
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │        React 19 Botanical Portal        │
                      │ - Certainty Score & Class Probabilities │
                      │ - Side-by-Side Saliency Overlay         │
                      │ - Agronomic Treatment Recommendations   │
                      └─────────────────────────────────────────┘
```

---

## 2. Problem Statement & Agricultural Motivation

### The Socio-Economic Context
Arecanut (*Adike* in Kannada) is one of India's most economically critical plantation cash crops, supporting over **10 million farming livelihoods** across Karnataka, Kerala, Assam, and Meghalaya.

### Pathological Challenges
1. **Yellow Leaf Disease (YLD)**: A systemic phytoplasma disease transmitted by plant hoppers (*Proutista moesta*) that causes severe chlorosis, root necrosis, and up to 50% yield collapse within 3 years (87–96% incidence recorded in Sringeri and Koppa).
2. **Mahali / Koleroga (Fruit Rot)**: Caused by *Phytophthora meadii*, destroying entire fruit bunches during monsoon downpours within days.
3. **Trunk Bleeding & Bud Rot**: Destructive fungal infections (*Thielaviopsis paradoxa*) that decay the vascular bundles.

### The Problem with Traditional Diagnosis:
* Manual field scouting is slow, subjective, and checks only a few gardens per taluk.
* Ground diagnosis usually happens *after* severe canopy damage has already occurred, by which time recovery is nearly impossible.
* Misdiagnosis leads to improper fungicide usage, escalating input costs, and ecological damage.

### The AdikeScan Solution:
AdikeScan solves these bottlenecks by combining **Spaceborne Early Warning** (Sentinel-2 + Weather Normalization) with **Ground Edge Diagnostics** (MobileNetV3 + Grad-CAM XAI) and actionable chemical/cultural treatment guidance.

---

## 3. Tier 1: Satellite Remote Sensing & GIS Methodology

### The 15 Candidate Vegetation Indices
| Domain | Index | Formula | Agronomic Significance |
|:---|:---|:---|:---|
| **Chlorophyll & Red-Edge** | **NDRE** | $(B8A - B5) / (B8A + B5)$ | **Core early warning**: Detects chlorophyll collapse before visible yellowing |
| | **CIre** | $(B7 / B5) - 1$ | Total canopy chlorophyll estimation |
| | **MTCI** | $(B6 - B5) / (B5 - B4)$ | Red-edge position tracking |
| | **IRECI** | $(B7 - B4) / (B5 / B6)$ | Chlorophyll and leaf area in dense canopies |
| | **GNDVI** | $(B8 - B3) / (B8 + B3)$ | Early hint of falling chlorophyll reflectance |
| **Yellowing & Water Stress** | **PSRI** | $(B4 - B2) / B6$ | Detects carotenoid accumulation & leaf senescence |
| | **NDMI** | $(B8A - B11) / (B8A + B11)$ | **Decouples drought stress from disease** |
| | **MSI** | $B11 / B8$ | Moisture stress ratio (higher = drier) |
| **Greenness & Biomass** | **NDVI** | $(B8 - B4) / (B8 + B4)$ | Baseline canopy density; agricultural mask ($> 0.45$) |
| | **SAVI** | $1.5 \cdot (B8 - B4) / (B8 + B4 + 0.5)$ | Eliminates bare-soil reflection |
| | **EVI** | $2.5 \cdot (B8 - B4) / (B8 + 6B4 - 7.5B2 + 1)$ | High-density canopy saturation resistance |
| **Land-Cover Masking** | **NDWI / NDBI / BSI** | Spectral Ratios | Masks out water bodies, settlements, and fallow land |

### Machine Learning Modeling on Sringeri 3-Year Dataset:
* **Feature Vector**: 18 variables ($B2, B3, B4, B5, B8, B11$, Temporal Indices 2023–2025, $\Delta\text{NDRE}, \Delta\text{NDVI}$, KSNDMC Rainfall & Temperature).
* **5-Fold Stratified Cross-Validation F1-Score**: **$0.9152 \pm 0.0431$**
* **Test Set ROC-AUC**: **$1.0000$**
* **Output**: Spatial risk rasters exported to GeoTIFF (`Sringeri_YLD_XGBoost_Probability_Map.tif`).

---

## 4. Tier 2: Deep Learning Classification & Explainable AI (XAI)

### 🍃 A. 9-Class Fine-Grained Taxonomy
The system classifies images into 4 healthy anatomical controls and 5 major disease/pest threats:

| Class ID | Class Name | Category | Causative Agent / Type | Health Status |
| :---: | :--- | :--- | :--- | :---: |
| **0** | **Bud Borer** | Pest Infestation | *Carvalhoia arecae* / *Manatha albipes* | Diseased |
| **1** | **Healthy Foot** | Control | Anatomical Base (*Areca catechu*) | Healthy |
| **2** | **Healthy Leaf** | Control | Anatomical Frond (*Areca catechu*) | Healthy |
| **3** | **Healthy Nut** | Control | Anatomical Fruit (*Areca catechu*) | Healthy |
| **4** | **Healthy Trunk** | Control | Anatomical Stem (*Areca catechu*) | Healthy |
| **5** | **Mahali Koleroga** | Fungal Infection | *Phytophthora meadii* | Diseased |
| **6** | **Stem Cracking** | Physiological | Abiotic Stress / Secondary Fungal | Diseased |
| **7** | **Stem Bleeding** | Fungal Infection | *Thielaviopsis paradoxa* | Diseased |
| **8** | **Yellow Leaf Disease** | Phytoplasma | Phytoplasma (16SrXI Group) | Diseased |

---

### 🔍 B. Explainable AI (Grad-CAM Saliency Mapping)
* **Target Convolutional Layer**: `model.features[-1]` (final convolutional block of MobileNetV3).
* **Mathematical Operation**: Computes the gradient of the winning class score $y^c$ with respect to spatial activation maps $A^k$:
  $$\alpha_k^c = \frac{1}{Z} \sum_{i} \sum_{j} \frac{\partial y^c}{\partial A_{i,j}^k}$$
  $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_{k} \alpha_k^c A^k\right)$$
* **Dual Output Modes**:
  1. **Neural Saliency Overlay**: Alpha-blended heatmap projected directly onto the input specimen.
  2. **Jet Colormap**: High-contrast thermal spectrum heatmap highlighting peak activation clusters.

---

### 📊 C. Quantitative Symptomatic Severity Estimation
The system evaluates the proportion of pixels in the Grad-CAM activation map exceeding the significance threshold ($\tau = 0.35$):
$$\text{Severity \%} = \frac{\sum (M_{i,j} > 0.35)}{N_{\text{total}}} \times 100$$

| Severity Area Score | Clinical Level | Interpretation & Action |
| :---: | :---: | :--- |
| **$< 10\%$** | **Mild / Early Stage** | Localized initial lesions; high treatment recovery rate |
| **$10\% - 30\%$** | **Moderate** | Established disease; immediate fungicide intervention required |
| **$30\% - 55\%$** | **Severe** | Advanced tissue damage; systemic treatment & sanitation needed |
| **$\ge 55\%$** | **Critical / Advanced** | Severe necrosis; plant isolation or rogueing recommended |

---

### 💊 D. Agronomic Knowledge Base & Treatment Engine
Every diagnosis is accompanied by verified agricultural recommendations:
* **Immediate Chemical Controls** (e.g., 1% Bordeaux mixture spray intervals, Dimethoate 0.05% vector sprays, copper oxychloride pasting).
* **Cultural & Soil Management** (e.g., bunch covering with polythene, drainage improvement, organic intercropping with cocoa/banana/pepper).
* **Field Symptoms & Diagnostic Clues** for on-site manual verification.

---

## 5. Technology Stack Summary

| Layer | Component | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Spaceborne Remote Sensing**| Sentinel-2 L2A / QGIS | 10m / 3.x | Multispectral time-series, 15 vegetation indices, raster calculations |
| **Regional ML & Weather** | XGBoost / Scikit-Learn | 2.x / 1.x | Spatial hotspot classification, weather normalization (F1: 0.9152) |
| **Deep Learning** | PyTorch | 2.x | Neural network modeling, forward inference, gradient autograd |
| **Vision Backbone** | TorchVision | 0.x | MobileNetV3-Small model architecture and normalization pipelines |
| **Explainability** | `pytorch-grad-cam` | 0.2.x | Gradient-weighted activation mapping hooks |
| **Image Processing** | OpenCV + Pillow | 4.x / 10.x | JET colormapping, alpha blending, Base64 buffer encoding |
| **Backend Framework** | FastAPI | 0.115+ | Asynchronous REST API microservice with Swagger OpenAPI docs |
| **Web Server** | Uvicorn | 0.34+ | ASGI web server with hot-reloading |
| **Frontend Framework**| React | 19.0.0 | Component-based reactive UI architecture |
| **Build & Dev Tool** | Vite | 6.2+ | Ultra-fast HMR dev server and production bundler |
| **Design System** | Vanilla CSS3 | - | Custom botanical glassmorphism, responsive CSS grid, zero generic UI templates |
| **Typography** | Google Fonts | - | **Playfair Display** (Scholarly serif) + **DM Sans** (Modern sans-serif) |
| **Icons** | Lucide React | 1.16+ | Clean SVG iconography |

---

## 6. REST API Endpoint Specification

### `GET /health`
* **Purpose**: System health check, hardware acceleration detection (`CUDA`/`CPU`), and class taxonomy verification.

### `GET /api/diseases`
* **Purpose**: Fetches the complete agronomic disease knowledge catalog.

### `POST /predict?generate_cam=true`
* **Purpose**: Primary inference endpoint accepting multipart image payload.
* **Response**: Class ID, class name, confidence percentage, full probability distribution across all 9 classes, agronomic treatment data, Base64 Grad-CAM overlay, Base64 raw heatmap, and severity metrics.

---

## 7. Documentation & Reference Repository (`/docs/`)

All associated research literature, GIS projects, and Colab notebooks are maintained in the local `/docs/` repository directory:
* `Project_Doc_YLD (3).docx` — Complete academic project report.
* `RemoteSensing_Arecanut_YLD_TechnicalDoc.docx` — Satellite methodology technical specification.
* `Copy of Areca Nut.ipynb` — Google Colab notebook for Sentinel-2 ML modeling and raster generation.
* `Sringeri_3Y_Dataset.pdf` & `yld.pdf` — Published research papers on Sentinel-2 YLD mapping.
* `YLD_Final_Layout.pdf` & `YLD_Final.qgz` — QGIS mapping projects and high-resolution layout exports.
* `Study_Taluks_2Only.gpkg` & `NDVI_Taluk_Statistics.gpkg` — Geopackage vector and statistical layers.
