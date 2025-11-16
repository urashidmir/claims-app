# Claims Tracker App — Fullstack Serverless App (Vite + AWS + TypeScript)

A claims-tracking MVP built using an AWS-first approach.

This project is organized as a monorepo, containing both the frontend and backend applications in a single repository.
Each app is fully isolated, has its own dependencies, its own build system, and can be developed or deployed independently.

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

### 2. Configure AWS credentials

#### Option A — Using AWS CLI (recommended)

```bash
aws configure
```

#### Option B — Environment variables

```bash
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxxx
export AWS_REGION=us-east-1
```


### 3. Deploy to AWS

```bash
npm run deploy
```
This deploys:

- Lambda functions
- API Gateway HTTP routes
- DynamoDB tables
- GSIs (ProjectIdIndex for claims-by-project queries)


## ▶ Running the Frontend (React)

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start Vite dev server

```bash
npm run dev
```

App runs at:

```bash
http://localhost:5173
```

Frontend consumes the backend API via environment variable VITE_API_URL.

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

AI tools (primarily ChatGPT) were used to evaluate architecture decisions, to accelerate certain parts of the build, including Serverless configuration, and to debug and optimize application. AI outputs were edited or corrected where necessary—for example, updating from the deprecated aws-sdk v2 (initially suggested by ChatGPT) to the correct AWS SDK v3 (@aws-sdk/client-dynamodb + @aws-sdk/lib-dynamodb), fixing Serverless IAM roles, and correcting DynamoDB command usage. I also noticed that some AI-generated code initially failed lint checks (formatting, unused imports/variables, and inconsistent TypeScript style), so I fixed these issues to satisfy the project’s ESLint/Prettier rules. I verified AWS configurations directly in the AWS Console to ensure table creation, permissions, and API Gateway behavior matched expectations. The main risks when using AI included version mismatches, incomplete context, syntactic and linting errors, all of which required manual debugging and adjustment. I ensured all AI-generated code was reviewed, tested, and adapted to the project's actual requirements and coding standards.

---

## 🚀 Improvements With More Time

### 🟨 1. Authentication and Authorization

### 🟨 2. Validation layer
- Add Zod schemas
- Share types between FE & BE

### 🟨 3. Optimistic updates
Improve user experience with instant state updates.

### 🟨 4. Automated Testing
- Unit tests for handlers/services
- E2E tests for API

### 🟨 5. CI/CD
- GitHub Actions
- Automated test + deploy pipeline

