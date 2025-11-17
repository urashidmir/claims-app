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

### 🟦 1. Monorepo Structure (Frontend + Backend in one repo)
I chose a monorepo structure to keep the frontend and backend codebases close together. This makes it easier to share domain knowledge, onboard quickly, test end-to-end flows, and evolve the domain **(Company → Project → Claim)** consistently. Both apps are isolated (their own **package.json**) but versioned and managed in a single repository.

---

### 🟧 2. AWS-First Serverless Backend
The backend uses the Serverless Framework with AWS Lambda + API Gateway, chosen for:

- Zero-maintenance compute
- Pay-per-execution cost model
- Auto-scaling
- Simple deployment pipeline

**Handlers** are intentionally thin, delegating logic to **service** and **repository** layers for testability.

---

### 🟪 3. DynamoDB as the Database

DynamoDB was selected because:

- It handles simple key-value and lookup patterns efficiently
- Offers fast queries on indexed attributes
- Works perfectly with serverless architectures
- Eliminates operational overhead (no servers, no patching)

A GSI (ProjectIdIndex) allows fetching all claims belonging to a project efficiently.

---

### 🟨 4. Repository Pattern for Backend Data Access

The backend follows a layered architecture:

**Handlers → Services → Repositories → DynamoDB**

Benefits:

- Test-friendly structure
- Encapsulated data access logic
- Possible future migrations (e.g., RDS or DocumentDB) with minimal API changes

---

### 🟨 5. Realistic Domain Modeling
The original problem statement was open-ended. I modelled the domain using typical enterprise patterns:
- A **Company** has many **Projects**
- A **Project** has many **Claims**
- **Claims** reference both projectId and its company name (later removed for normalization)
- UI pages reflect these relationships:
    **Project list → Project detail → Claims list → Claim form**

This grounding ensures both the data model and user flow resemble real-world claim-management systems.

One spec line also introduced ambiguity:

`PATCH /projects/:id – update project or associated claims`

The requirement doesn't define what “update associated claims” should actually do—whether it means reassigning claims, applying bulk status updates, cascading name changes, etc.

For this MVP, I kept responsibilities clear and predictable:

- **Project updates** are handled at `PATCH /projects/:id`
- **Claim updates** are handled at `PATCH /claims/:id`

If needed in a full production system, the **/projects/:id** endpoint could be extended according to explicit requirements.

---

### 🟨 6. React Query for Data Fetching & Caching
React Query was chosen for:

- Automatic caching of **projects** and **claims** data
- Background refetching to keep data fresh
- Smoother UI updates
- Simplified loading/error state management
- Built-in invalidation on mutations (create/update claim/project)

It significantly reduces boilerplate and makes the UI more resilient.


### 🟩 7. Custom Reusable Hooks
Example: `useProject(projectId)` centralizes:
- Loading logic
- Error handling
- Reusability across pages

This keeps React components clean and focused on UI.

---

## 🤖 AI Usage Notes

AI tools (primarily ChatGPT) were used to evaluate architecture decisions, to accelerate certain parts of the build, including Serverless configuration, and to debug and optimize application. AI outputs were edited or corrected where necessary—for example, updating from the deprecated ```aws-sdk``` v2 (initially suggested by ChatGPT) to the **AWS SDK v3** (```@aws-sdk/client-dynamodb``` + ```@aws-sdk/lib-dynamodb```), fixing Serverless IAM roles, and correcting DynamoDB command usage. I also noticed that some AI-generated code initially failed lint checks (formatting, unused imports/variables, and inconsistent TypeScript style), so I fixed these issues to satisfy the project’s **ESLint/Prettier** rules. I verified AWS configurations directly in the AWS Console to ensure table creation, permissions, and API Gateway behavior matched expectations. The main risks when using AI included version mismatches, incomplete context, syntactic and linting errors, all of which required manual debugging and adjustment. I ensured all AI-generated code was reviewed, tested, and adapted to the project's actual requirements and coding standards.

---

## 🚀 Improvements With More Time

### 🟨 1. Authentication and Authorization
- AWS Cognito or Auth0
- Role-based access (e.g. submitter vs. reviewer)

### 🟨 2. Validation layer
- Add Zod schemas
- Share types between FE & BE


### 🟨 3. Error handling & user feedback
- Standardize error handling with consistent structured error responses
- Friendly user messaging
- Logging


### 🟨 4. Automated Testing
- Unit tests for handlers/services
- E2E tests for API

### 🟨 5. CI/CD
- GitHub Actions
- Automated tests + deploy pipeline

