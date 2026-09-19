# CampusVault

### Digital Academic & Accreditation Management Platform

CampusVault is a full-stack web platform designed to centralize and manage
academic documents, achievements, faculty information, departmental data,
activities, and accreditation evidence for educational institutions.

It provides a unified workspace for departments and administrators while
maintaining structured data for accreditation workflows such as NBA.

---

## ✨ Features

### 📊 Centralized Dashboard
- Overview of institutional data
- Document statistics
- Achievement statistics
- Faculty statistics
- Department statistics
- Recent documents and achievements
- Analytics and visual insights

### 🏢 Department Management
- Department-wise workspace
- Department overview
- Department-specific documents
- Department-specific achievements
- Department faculty
- Department analytics
- Department activity management

### 📄 Document Management
- Upload and manage academic documents
- Department-wise document organization
- Search documents
- Document preview
- Document download
- Document deletion
- Academic year classification
- Category-based organization

### 🏆 Achievement Management
- Student achievement records
- Achievement certificates
- Achievement images
- Event and position details
- Faculty guide information
- Achievement date
- External references
- Department-wise achievements

### 👨‍🏫 Faculty Management
- Department-wise faculty
- Faculty profiles
- Designation and qualification
- Experience
- Research areas
- Contact information
- Faculty photographs
- Add and delete faculty members

### 🎓 NBA Accreditation
- NBA criteria structure
- Criterion-wise organization
- Subcategory management
- Evidence requirements
- Criterion-specific document storage
- NBA evidence tracking
- AI-assisted document evaluation

### 🤖 AI Document Evaluation
CampusVault includes an AI-assisted evaluation workflow for NBA evidence.

The system can:
- Analyze uploaded evidence
- Generate an AI score
- Evaluate relevance
- Evaluate completeness
- Provide confidence information
- Identify potential issues
- Generate recommendations
- Store evaluation results

### 📅 Activity Planner
- Department-wise activities
- Activity planning
- Activity tracking
- Add, edit and delete activities
- Department-based filtering

### 👥 User Management
- User administration
- Role-based access
- User creation
- User editing
- User deletion
- Account activation management

### 📑 Reports
- Institutional reporting
- Department-wise information
- Accreditation-related reporting
- Exportable reports

### 🔐 Authentication
- Supabase authentication
- Protected routes
- Password reset
- Role-based access control

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Lucide Icons

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Storage
- Supabase Authentication
- Supabase Edge Functions

### AI

- Google Gemini
- AI-assisted NBA evidence evaluation

### Development

- npm
- Turborepo
- Git & GitHub
- Vercel

---

## 🏗️ Project Structure

CampusVault follows a monorepo architecture.

```text
CampusVault/
│
├── apps/
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── data/
│       │   ├── lib/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── types/
│       │   └── utils/
│       │
│       ├── public/
│       └── ...
│
├── packages/
│   └── ui/
│       └── components/
│
├── package.json
├── turbo.json
└── README.md