# AgentDeploy Backend — Technical Explanation

## 1. Project Overview
The AgentDeploy backend is a high-performance FastAPI application designed to power AI-driven conversational agents. It handles authentication, business configuration, and real-time AI orchestration with a focus on "Anti-Hallucination" (grounding AI responses in verified business data).

---

## 2. Core Architecture

The project follows a modular service-based architecture:

### 📂 Directory Structure
- `app/main.py`: The entry point. Defines all API routes and middleware.
- `app/services/`: Contains independent logic for AI orchestration (`ai_service.py`) and security (`auth_service.py`).
- `app/models/`: Defines the database schema using SQLModel (SQLAlchemy + Pydantic).
- `app/core/`: Contains core configurations like database engine setup (`db.py`).

---

## 3. Key Feature Implementations

### 🤖 AI Orchestration & Anti-Hallucination
The backend uses a pluggable **AI Service** (`app/services/ai_service.py`). 
- **Streaming:** It uses Server-Sent Events (SSE) via `StreamingResponse` to provide real-time, word-by-word AI responses to the frontend.
- **Anti-Hallucination:** Before sending a prompt to the LLM (Gemini), the backend fetches the specific business's data (plans, FAQs, description) from MySQL and injects it as "Context." This ensures the AI only speaks facts about the business.

### 🔐 Authentication System
- **Security:** Passwords are never stored in plain text. They are hashed using the **BCRYPT** algorithm.
- **JWT:** Upon successful login, the server issues a **JSON Web Token (JWT)**. The frontend stores this and sends it in the `Authorization` header for protected requests.
- **Endpoints:** 
  - `/api/auth/signup`: Registers a new user.
  - `/api/auth/login`: Validates credentials and issues tokens.
  - `/api/auth/me`: A protected route that returns the current user's profile.

### 🔑 Forgot Password (OTP Flow)
- **Logic:** When a user requests a password reset, the server generates a unique **6-digit OTP** and stores it in the database with a 10-minute expiration.
- **Reset:** The `/api/auth/reset-password` endpoint verifies the OTP against the user's email before allowing a password update.

### 🗄 Database (MySQL + Docker)
- **Engine:** The project uses **MySQL 8.0** running in a Docker container.
- **ORM:** **SQLModel** is used for a seamless developer experience, allowing the same code to define both database tables and API data validation schemas.

---

## 4. Setup & Execution

### Prerequisites
- **Python 3.12** (Required for compatibility with Pydantic/Rust libraries).
- **Docker** (For running the MySQL database).

### Command Reference
- `docker-compose up -d`: Starts the MySQL database.
- `./run.sh`: Automates the environment setup, dependency installation, database seeding, and starts the FastAPI server.
