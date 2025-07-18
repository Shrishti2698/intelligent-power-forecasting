# Intelligent Power Demand Forecasting

This project forecasts short-term electricity demand using AI models, weather, and holiday data. It includes a **React.js frontend** and a **FastAPI backend**, fully Dockerized for local deployment.

---

## 📌 Project Structure

```
intelligent-power-forecasting/
|
├── backend/                 → FastAPI backend with AI model
|   ├── main.py             → API endpoints
|   └── model.pkl           → Downloaded automatically from Google Drive
|
├── frontend/                → React.js frontend (Chart.js, axios)
|   └── src/
|       └── App.js          → Main dashboard
|
├── docker-compose.yml       → Full-stack orchestration
├── Dockerfile (frontend)    → For production frontend (nginx)
├── Dockerfile (backend)     → For FastAPI backend
├── README.md
└── .gitignore
```

---

## 🚀 How to Build & Run the Project (Locally)

### 1. Prerequisites

* Docker Desktop installed and running: [Download here](https://www.docker.com/products/docker-desktop)
* Python 3.10+ (for backend model testing if needed)
* Internet connection (required on first run to fetch model from Google Drive)

---

### 2. Clone the Repository

```bash
git clone https://github.com/Shrishti2698/intelligent-power-forecasting.git
cd intelligent-power-forecasting
```

---

### 3. Start the Full Stack App with Docker

```bash
docker compose up --build
```

* This command will:

  * Download the required backend model from Google Drive (if not already cached)
  * Spin up FastAPI backend on port `8000`
  * Launch React frontend via `nginx` on port `3000`

---

### 4. Access the Application

* Frontend (Dashboard): [http://localhost:3000](http://localhost:3000)
* Backend API (Swagger Docs): [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📆 Model Hosting (Google Drive)

Due to GitHub's 100MB size limit, the trained ML model is hosted externally and fetched at runtime. It will be downloaded automatically when the backend starts.

**Download link (used internally):**

```
https://drive.google.com/uc?export=download&id=1T3UXUCx0_IPS3vNB5I_Akvt2qC3Dv1bl
```

You don't need to manually upload or place `model.pkl` inside the repo.

---

## 🔹 Features

* Forecast next **24 hours** (96 blocks) of electricity demand
* Real-time data visualization using **Chart.js**
* Integrated **weather and holiday data** for improved accuracy
* **Responsive frontend** built with React
* **Interactive API documentation** via Swagger UI
* **Fully Dockerized** project

---

## 📷 Screenshots

Added the screenshots of working prototype. At different time frames (4:44pm, 8:58pm, and 3:52pm respectively)- 

Screenshot_working_prototype/FastAPI_img/image.png
Screenshot_working_prototype/screenshot_one/image.png
Screenshot_working_prototype/screenshot_two/image_2.1.png
Screenshot_working_prototype/screenshot_two/image_2.2.png
Screenshot_working_prototype/screenshot_three/image_3.1.png
Screenshot_working_prototype/screenshot_three/image_3.2.png


---

## 👥 Author

**Shrishti Swarnkar**
M.Tech, IIIT Naya Raipur
[LinkedIn](https://www.linkedin.com/in/shrishti-swarnkar)

---

## 📅 Submission Note

This project includes a **working prototype**. If deployment was not completed online (e.g., on Railway or Vercel), follow the local Docker instructions above to build and run it without any issues.

---

## ✅ Summary for Recruiters

* **Working prototype:** Yes (fully functional locally via Docker)
* **Model included:** Yes (auto-downloaded from Google Drive)
* **Instructions provided:** Yes (clear local build and usage guide)
* **Deployment URL:** *(Optional if local setup used)*
* **Screenshots:** Add to `README.md` or repo as needed

---

Thank you for reviewing this submission!
