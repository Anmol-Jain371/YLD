# AdikeScan — Arecanut Plant Disease AI Diagnosis

AdikeScan is a computer-vision-powered web application designed to diagnose 9 distinct health classes of **Arecanut (Adike) palms**. The system features authentic **Grad-CAM explainability** and quantitative tissue severity scoring, providing transparency to growers and agronomists.

---

## 🛠 Tech Stack

* **Frontend**: React 19, Vite 6, Lucide React, and Custom Glassmorphism CSS.
* **Backend**: FastAPI, PyTorch (MobileNetV3-Small), PyTorch Grad-CAM, and OpenCV.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd YLD/backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be live at `http://localhost:8000`.

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd YLD/frontend
   ```

2. **Install node modules**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The frontend UI will be live at `http://localhost:5173`.

---

## 📂 Project Structure

```text
YLD/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI main router & API state
│   │   ├── model.py           # MobileNetV3-Small loader & transforms
│   │   ├── gradcam.py         # PyTorch Grad-CAM generation logic
│   │   ├── disease_info.py    # Agronomic disease descriptions & treatments
│   │   ├── split_dataset.py   # 80/20 training dataset splitter
│   │   └── train.py           # Model training loop
│   ├── model/
│   │   └── areca_model.pt     # Fine-tuned PyTorch model weights (checkpoint)
│   └── requirements.txt       # Python dependencies list
├── frontend/
│   ├── src/
│   │   ├── components/        # React components (Upload, Prediction, GradCAM, Catalog)
│   │   ├── App.jsx            # Main app coordinator
│   │   ├── index.css          # Core design system & layout styles
│   │   └── main.jsx
│   └── package.json
└── README.md                  # Project documentation (this file)
```

---

## 👥 Git Collaboration Workflow (For Teams)

For teams using the **Forking Workflow**, follow these steps to keep the project safe, clean, and syncable:

### 1. Set Up Your Remotes
Ensure your local project is linked to the team's main repository (`upstream`) and your personal fork (`origin`):
```bash
git remote rename origin upstream
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/YLD.git
```

### 2. Fetch Latest Updates
Before starting any new work, sync your local repository with the main branch:
```bash
git checkout main
git pull upstream main
```

### 3. Create a Feature Branch
Always work on a separate branch:
```bash
git checkout -b feature/your-feature-name
```

### 4. Push and Open a Pull Request
Once your feature is complete, push it to your fork and submit a Pull Request on GitHub:
```bash
git add .
git commit -m "Add feature details"
git push -u origin feature/your-feature-name
```
Open a Pull Request on GitHub from your fork to `Kr1szz/YLD:main` for team review.