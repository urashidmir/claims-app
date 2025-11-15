# Claims App — Fullstack Serverless App (Vite + AWS + TypeScript)

A lightweight insurance claims & projects management system built with an AWS-first, event-driven approach.

This repository contains a full-stack application for managing Projects and Claims.

- The **backend** runs on AWS Lambda with API Gateway and DynamoDB, using the Serverless Framework and TypeScript.
- The **frontend** is a React + TypeScript app built with Vite, consuming the backend via a REST API.


---

## 📦 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture Decisions](#-architecture-decisions)
- [Project Structure](#-project-structure)
- [Running the Backend (Serverless)](#-running-the-backend-serverless)
- [Running the Frontend (React)](#-running-the-frontend-react)
- [Environment Variables](#-environment-variables)
- [AI Usage Notes](#-ai-usage-notes)
- [Improvements With More Time](#-improvements-with-more-time)
- [What I Can Walk Through in Interview](#-what-i-can-walk-through-in-interview)

---

## 🧩 Overview

This project implements a simple **Claims Management** system with two core domains:

### ✔ Projects
- Create projects  
- View project list  
- Navigate to project-specific claims  

### ✔ Claims
- Create claims  
- View all claims or claims filtered by project  
- Update claim status  
- Validate date ranges, amounts, and required fields  

The backend is fully serverless, deployed on **AWS Lambda + API Gateway + DynamoDB**, with local development supported by **serverless-offline** and **DynamoDB Local**.

The frontend is a **React + MUI** app consuming the backend via REST APIs.

---

## 🛠 Tech Stack

### Frontend
- React + TypeScript  
- Material UI  
- React Router  
- Vite  

### Backend
- Serverless Framework (v3)  
- AWS Lambda  
- API Gateway  
- DynamoDB (PAY_PER_REQUEST)  
- Node.js 18  
- serverless-dynamodb-local  
- serverless-offline  
- esbuild bundling  

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

## ▶ Running the Backend (Serverless)

### 1. Install dependencies
```bash
cd backend
npm install

2. Run locally (no AWS required)

npm run offline

Starts:

serverless-offline on port 5000

DynamoDB Local on port 8000

3. Deploy to AWS (optional)

Option A — Using AWS Profile

npm run deploy

Option B — Using environment variables
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxxx
export AWS_REGION=us-east-1
npm run deploy

▶ Running the Frontend (React)
Install dependencies
cd frontend
npm install

Run
npm run dev


Ensure your .env contains:

VITE_API_BASE_URL=http://localhost:5000
