# Claims Tracker App — Fullstack Serverless App (Vite + AWS + TypeScript)

A claims-tracking MVP built using an AWS-first approach.

This project is organized as a monorepo, containing both the frontend and backend applications in a single repository.
Each app is fully isolated, has its own dependencies, its own build system, and can be developed or deployed independently.

This repository contains

- The **backend** runs on AWS Lambda with API Gateway and DynamoDB, using the Serverless Framework and TypeScript.
- The **frontend** is a React + TypeScript app built with Vite, consuming the backend via a REST API.


---

## 📦 Table of Contents

- [Tech Stack](#-tech-stack)
- [Running the Backend (Serverless)](#-running-the-backend-serverless)
- [Running the Frontend (React)](#-running-the-frontend-react)
- [Architecture Decisions](#-architecture-decisions)
- [AI Usage Notes](#-ai-usage-notes)
- [Improvements With More Time](#-improvements-with-more-time)

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript  
- Material UI  
- React Router
- React Query  
- Vite  

### Backend
- Serverless Framework (v3)  
- AWS Lambda  
- API Gateway  
- DynamoDB
- Node.js 18
- Typescript

---


## ▶ Running the Backend (Serverless)

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Deploy to AWS

```bash
npm run deploy
```


Option B — Using environment variables
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxxx
export AWS_REGION=us-east-1
npm run deploy


## ▶ Running the Frontend (React)

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Run the app

```bash
npm run dev
```

---

## 🏗 Architecture Decisions

### 🟦 1. Feature-Based Frontend Structure

The frontend uses a **feature-based architecture**, not Atomic Design:

features/
projects/
claims/
shared/
components/
hooks/
utils/

This mirrors modern SaaS dashboards and keeps domain logic isolated.

---

### 🟧 2. Serverless AWS Backend

Backend follows a clean layered architecture:

handlers/
services/
repositories/
types/
utils/

Reasons:

- Thin, testable Lambda handlers  
- Reusable domain logic  
- Easy to extend with new features  

---

### 🟪 3. DynamoDB as the Persistence Layer

Benefits:

- Zero maintenance  
- PAY_PER_REQUEST cost model  
- Perfect for simple key-value workloads  
- GSI supports querying claims by projectId  

---

### 🟨 4. Query-Param Filtering for Claims

GET /claims?projectId=abc123

Supports:

- All claims  
- Claims for a specific project  

Frontend uses `useSearchParams()` for stateful filtering.

---

### 🟩 5. Custom Data Hooks

Example: `useProject(projectId)`

- Handles loading, error, null states  
- Simplifies page components  
- Reusable across domain features  


---

## 🤖 AI Usage Notes

- ChatGpt was used to evaluate design decisions.
- AI assisted with writing TypeScript types, React Query hooks, and error-handling patterns.
- No AI-generated code was used without manual review and testing.

---

## 🤖 Improvements With More Time

### 🟨 1. Authentication and Authorization

### 🟨 2. Validation layer

### 🟨 3. Optimistic updates

### 🟨 4. Automated Testing

### 🟨 5. CI/CD
