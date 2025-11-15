# Claims App — Fullstack Serverless App (Vite + AWS + TypeScript)

This repository contains a full-stack application for managing Projects and Claims.

- The **backend** runs on AWS Lambda with API Gateway and DynamoDB, using the Serverless Framework and TypeScript.
- The **frontend** is a React + TypeScript app built with Vite, consuming the backend via a REST API.

Claims-Service (Serverless AWS + React)

A lightweight insurance claims & projects management system built with an AWS-first, event-driven approach.

📦 Table of Contents

Overview

Tech Stack

Architecture Decisions

Project Structure

Running the Backend (Serverless)

Running the Frontend (React)

Environment Variables

AI Usage Notes

Improvements With More Time

🧩 Overview

This project implements a simple Claims Management system with two core domains:

✔ Projects

Create projects

View project list

Navigate to project-specific claims

✔ Claims

Create claims

View all claims or claims filtered by project

Update claim status

Validate date ranges, amounts, and required fields

The backend is fully serverless, deployed on AWS Lambda + API Gateway + DynamoDB, with local development supported by serverless-offline and DynamoDB Local.

The front end is a simple React + MUI app consuming the backend via REST APIs.

🛠 Tech Stack
Frontend

React + TypeScript

Material UI

React Router

Vite / CRA (depending on your exact setup)

Backend

Serverless Framework (v3)

AWS Lambda

API Gateway

DynamoDB (PAY_PER_REQUEST)

Node.js 18

serverless-dynamodb-local

serverless-offline

esbuild bundling

🏗 Architecture Decisions
🟦 1. Feature-Based Frontend Structure (Recommended for SaaS)

The frontend is intentionally not Atomic Design — instead, it uses a feature-based architecture:

features/
  projects/
  claims/
shared/
  components/
  hooks/
  utils/


This aligns with real SaaS dashboards (Stripe, Vercel, Linear) and keeps domain logic isolated.

🟧 2. Serverless AWS Backend

The backend follows a clean handler → service → repository layering:

handlers/
services/
repositories/
types/
utils/


Reasons:

Promotes testability

Keeps Lambda handlers thin

Reusable domain logic

Easy to extend new use cases

🟪 3. DynamoDB as the persistence layer

Why DynamoDB?

Zero management overhead

PAY_PER_REQUEST for cost efficiency

Perfect for simple, high-velocity key-value workloads

GSI (Global Secondary Index) supports querying claims by projectId

🟨 4. Query Param–Driven Filtering

The endpoint:

GET /claims?projectId=abc123


supports both:

All claims

Claims for a specific project

The frontend uses useSearchParams() to load filtered claims.

🟩 5. Custom Hooks for Data Fetching

Example: useProject(projectId)

Handles loading, error, null states

Simplifies React components

Reusable patterns across features (future: useClaims, useProjectList)

🟥 6. Public-Friendly, No Hardcoded AWS Profiles

Removed:

profile: claims-dev


Why:

Makes repo easier for new developers

Prevents accidental hardcoded AWS credentials

Works with GitHub Actions and CI/CD

Developers can deploy with:

AWS_PROFILE=myprofile npx serverless deploy

📁 Project Structure
root/
  backend/
    serverless.yml
    src/
      handlers/
      services/
      repositories/
      types/
      utils/
  frontend/
    src/
      features/
        claims/
        projects/
      shared/
      app/

▶ Running the Backend (Serverless)
1. Install dependencies
cd backend
npm install

2. Run offline (no AWS required)
npm run offline


This starts:

serverless-offline on port 5000

DynamoDB Local on port 8000

3. Deploy to AWS (optional)

Set AWS credentials using either:

Option A — AWS_PROFILE
AWS_PROFILE=claims-dev npm run deploy

Option B — Environment variables
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxxx
export AWS_REGION=us-east-1
npm run deploy

▶ Running the Frontend (React)
Install dependencies
cd frontend
npm install

Run locally
npm run dev


Make sure your frontend .env contains:

VITE_API_BASE_URL=http://localhost:5000


(or whatever port serverless-offline runs on)

🔐 Environment Variables
Backend (backend/.env.example)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

CLAIMS_TABLE=ClaimsTable
PROJECTS_TABLE=ProjectsTable

Frontend (frontend/.env.example)
VITE_API_BASE_URL=http://localhost:5000

🤖 AI Usage Notes

AI was used to assist with:

Architecture reviews

Code refactoring (React hooks, backend validation)

README generation

Improvements to form validation and UX copy

Clean separation of services and handlers

AI did NOT write entire files — it was used for suggestions and best-practice alignment.

🚀 Improvements With More Time
Backend

Add request validation with Zod or Joi

Add structured logging (Pino)

Add integration tests (Vitest + serverless offline)

Add OpenAPI schema generation

Add multi-tenant support

Frontend

Replace manual API calls with TanStack Query

Add a global toast/notification system

Create a reusable <FormField /> wrapper for MUI

Add optimistic UI updates when modifying claim status

Add authentication (Cognito or Auth0)

DevOps

GitHub Actions workflow for CI + deployment

Separate dev, staging, prod stages

Terraform for production infrastructure

Prettier + ESLint consistency rules

🧠 What I Can Walk Through in Interview

Why I chose feature-based folder structure for the frontend

Tradeoffs of DynamoDB vs RDS for this domain

Why Lambda handlers should be thin

How Serverless improves deploy speed and cost

Why query-based filtering works better than separate endpoints

Reasoning behind removing AWS profiles for portability

How I validated date ranges and input types

How I'd scale this into a multi-team SaaS codebase