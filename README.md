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

