# MASTER PROJECT PROMPT

## Project Title

**QuantumLearn AI — AI-Based Interactive Quantum Algorithm Learning Platform**

---

## 1. PROJECT OBJECTIVE

Build a modern, beginner-friendly, AI-powered interactive learning platform for learning quantum computing concepts and quantum algorithms.

The platform must solve the following educational problem:

> Quantum algorithms are difficult for beginners because they involve abstract concepts, mathematical notation, quantum circuits, probability, and unfamiliar quantum behavior. Traditional learning methods often separate theory from practical experimentation. Students need a platform where they can learn concepts, construct quantum circuits, execute simulations, visualize results, understand why results occur, receive personalized AI guidance, and practice through challenges.

The platform should function as:

**Classroom + Quantum Laboratory + Personal AI Tutor**

The central learning loop must be:

**LEARN → VISUALIZE → BUILD → SIMULATE → ANALYZE → PRACTICE → ADAPT**

Do NOT build a generic AI chatbot with a quantum-themed UI.

The quantum simulation and interactive experimentation must be central to the application.

---

# 2. TARGET USERS

Primary users:

- University students
- Engineering students
- Computer science students
- Physics students
- Beginners learning quantum computing

Initial target:

**Beginner to intermediate learners.**

The platform should ask the user for their knowledge level during onboarding:

- Complete Beginner
- Beginner
- Intermediate

The content and AI explanations should adapt to this level.

---

# 3. CORE PRODUCT EXPERIENCE

A student should be able to:

1. Create an account / enter the platform
2. Select their quantum-computing knowledge level
3. See a personalized dashboard
4. Learn quantum concepts
5. Interact with visualizations
6. Build quantum circuits
7. Run the circuit using a quantum simulator
8. See measurement probabilities
9. Inspect what happened at each step
10. Ask the AI tutor questions
11. Ask AI to explain a circuit
12. Receive hints when making mistakes
13. Take quizzes
14. Receive feedback
15. Track learning progress
16. Receive personalized recommendations
17. Practice quantum algorithms through challenges

---

# 4. CORE LEARNING FLOW

Implement this learning workflow:

Student selects a topic.

↓

System explains the concept at the student's level.

↓

Interactive visualization demonstrates the concept.

↓

Student builds or modifies a circuit.

↓

Circuit is executed using the quantum simulation backend.

↓

Results are visualized.

↓

AI explains the relationship between:

- the gates
- the quantum state
- the algorithm
- the observed result

↓

Student receives a challenge.

↓

Student submits an answer/circuit.

↓

System evaluates it.

↓

AI provides a hint or explanation.

↓

Student progress is updated.

↓

System recommends the next concept or challenge.

---

# 5. MAIN APPLICATION PAGES

Create the following pages.

## PAGE 1 — Landing Page

Purpose:

Clearly communicate the product.

Hero section:

**Learn Quantum Computing by Building and Experimenting**

Subtitle:

**An AI-powered interactive laboratory for understanding quantum algorithms through visualization, simulation, and personalized guidance.**

Primary button:

**Start Learning**

Secondary button:

**Explore Quantum Lab**

Sections:

- Why Quantum Learning Is Difficult
- How QuantumLearn AI Works
- Key Features
- Supported Algorithms
- Learning Workflow
- Technology
- Call to Action

Do not make the landing page excessively large.

Focus on clarity.

---

# 6. ONBOARDING

After starting:

Ask:

### Question 1

"What is your current quantum computing experience?"

Options:

- Complete Beginner
- Beginner
- Intermediate

### Question 2

"What is your learning goal?"

Options:

- Understand quantum fundamentals
- Learn quantum algorithms
- Build quantum circuits
- Prepare for academics/exams
- Explore quantum computing

Create a basic learner profile.

Store:

- experience level
- learning goal
- completed topics
- quiz performance
- weak concepts
- algorithm progress

---

# 7. DASHBOARD

Create a modern dashboard.

Show:

### Welcome

"Welcome back, [Name]"

### Learning Progress

Example:

Quantum Fundamentals

████████░░ 80%

### Continue Learning

Show the current recommended lesson.

Example:

**Grover's Algorithm**

"Continue →"

### Concept Mastery

Show:

- Qubits
- Superposition
- Measurement
- Quantum Gates
- Entanglement
- Interference

Use progress indicators.

### Weak Areas

Example:

- Interference
- Measurement

### AI Recommendation

Example:

"Your recent attempts show that you need more practice with interference. Try the amplitude amplification exercise."

### Recent Activity

Show recently completed:

- lessons
- quizzes
- algorithms
- circuits

---

# 8. LEARNING MODULE

Create a structured learning page.

Each lesson should contain:

## Section A — Concept Explanation

Simple explanation appropriate to the student's level.

## Section B — Interactive Visualization

Allow the student to interact with the concept.

## Section C — Example

Show a simple quantum circuit.

## Section D — Run It

Allow the student to execute the circuit.

## Section E — Understand the Result

Show the output visually.

## Section F — Ask AI

Allow the student to ask questions about the current topic.

## Section G — Quick Challenge

Give a small problem.

---

# 9. QUANTUM FUNDAMENTALS

Initially implement these lessons:

### Lesson 1
What is Quantum Computing?

### Lesson 2
Qubits

### Lesson 3
Superposition

### Lesson 4
Measurement

### Lesson 5
Quantum Gates

Include:

- X
- Y
- Z
- H
- S
- T

### Lesson 6
Controlled Gates

Especially:

- CNOT

### Lesson 7
Entanglement

### Lesson 8
Quantum Interference

Each concept should include an interactive example.

---

# 10. QUANTUM ALGORITHM LAB

Create an "Algorithm Lab".

Initially support:

1. Bell State
2. Deutsch-Jozsa Algorithm
3. Grover's Algorithm
4. Quantum Fourier Transform

Prioritize quality over quantity.

Do not implement many algorithms superficially.

The flagship demonstration should be:

**Grover's Algorithm**

---

# 11. QUANTUM CIRCUIT BUILDER

Build an interactive circuit editor.

The user should be able to:

- select number of qubits
- add gates
- remove gates
- modify gates
- choose target qubit
- create controlled operations
- measure qubits
- clear circuit
- run circuit

Initial gate set:

- H
- X
- Y
- Z
- S
- T
- CNOT
- SWAP
- Measurement

The UI should visually represent:

```text
q0 ── H ─────●──── M
             │
q1 ──────────X──── M
```

Make the circuit builder beginner-friendly.

Do not try to replicate a professional quantum IDE.

---

# 12. QUANTUM SIMULATION ENGINE

Use Python with:

**Qiskit + Qiskit Aer + NumPy**

The AI must NOT calculate quantum results itself.

The actual quantum computation must be performed by the quantum simulation engine.

Architecture:

Frontend

↓

Backend API

↓

Quantum Service

↓

Qiskit / Qiskit Aer

↓

Simulation

↓

Measurement results

↓

Frontend visualization

The simulation service should support:

- circuit execution
- measurement counts
- probabilities
- statevector where appropriate
- step-by-step execution where technically feasible

---

# 13. CIRCUIT DATA FORMAT

Use a consistent JSON format between frontend and backend.

Example:

```json
{
  "num_qubits": 2,
  "gates": [
    {
      "type": "H",
      "qubit": 0
    },
    {
      "type": "CNOT",
      "control": 0,
      "target": 1
    }
  ],
  "measure": true
}
```

The backend should convert this representation into a Qiskit circuit.

Return structured results such as:

```json
{
  "probabilities": {
    "00": 0.5,
    "11": 0.5
  },
  "counts": {
    "00": 503,
    "11": 497
  }
}
```

Do not hard-code fake results.

---

# 14. QUANTUM VISUALIZATION

Create visualizations for:

### 1. Circuit

Visual representation of gates and qubits.

### 2. Measurement probability

Example:

```text
00 ███████████████ 50%

11 ███████████████ 50%
```

Use an interactive chart.

### 3. State visualization

Where appropriate, display state amplitudes.

### 4. Bloch sphere

Implement initially for single-qubit demonstrations if feasible.

### 5. Step-by-step execution

Allow the user to move through:

Step 1 → Step 2 → Step 3 → Final Result

For example:

Initial state

↓

Apply H

↓

Apply CNOT

↓

Measurement

At every step explain what changed.

---

# 15. AI TUTOR

Create an AI tutor available throughout the learning experience.

The AI should understand:

- current lesson
- student's level
- current algorithm
- current circuit
- previous mistakes
- quiz performance

The AI should support:

### Explain

"Explain this concept."

### Simplify

"Explain this like I'm a beginner."

### Example

"Give me an example."

### Why?

"Why did this result happen?"

### Hint

"Give me a hint without revealing the answer."

### Challenge

"Give me another problem."

---

# 16. AI CIRCUIT EXPLAINER

Provide an "Explain Circuit" button.

When clicked:

Send the current circuit representation to the AI.

The AI should explain:

1. What each gate does
2. What happens to the qubits
3. What the circuit is trying to achieve
4. What the expected result means
5. Common mistakes

The explanation must be based on the actual circuit data.

Do not allow the AI to invent simulation results.

---

# 17. AI HINT SYSTEM

For challenges:

Student attempts a problem.

If incorrect:

Give:

### Hint 1

Small conceptual hint.

If still incorrect:

### Hint 2

More specific guidance.

If still incorrect:

### Explanation

Explain the correct reasoning.

Do NOT immediately reveal the answer.

---

# 18. AI QUIZ GENERATOR

Generate quizzes based on:

- topic
- difficulty
- student level
- previous mistakes

Question types:

- MCQ
- True/False
- Conceptual
- Circuit interpretation
- Result interpretation

Store quiz performance.

---

# 19. ADAPTIVE LEARNING ENGINE

Track:

- lessons completed
- quiz scores
- attempts
- mistakes
- difficult concepts
- circuits built
- algorithms completed

Calculate a simple concept mastery score.

Example:

```text
Superposition       85%
Measurement         70%
Entanglement        55%
Interference        40%
```

Use this to recommend what the student should learn next.

Example:

"Your understanding of interference is currently weak. We recommend revisiting the interference visualization before continuing to advanced Grover problems."

Keep the recommendation logic transparent and deterministic where possible.

Do not let the LLM alone decide student progress.

---

# 20. CHALLENGE SYSTEM

Create interactive challenges.

Example:

### Challenge

"Create a Bell state using two qubits."

Student builds circuit.

System checks whether the circuit produces the required behavior.

Then:

- correct → success
- incorrect → AI hint

Another challenge:

"Modify the Grover circuit and observe what happens when the diffusion operator is removed."

The goal is experimentation, not just answering MCQs.

---

# 21. PROGRESS SYSTEM

Track:

```text
Lessons completed
Algorithms completed
Quiz accuracy
Challenge success rate
Concept mastery
Learning streak
```

Show visually on the dashboard.

Do not use fake data in the final demo unless clearly labeled as sample/demo data.

---

# 22. AI KNOWLEDGE BASE / RAG

Create a controlled quantum-learning knowledge base.

Organize content:

```text
Fundamentals
├── Qubits
├── Superposition
├── Measurement
├── Gates
├── Entanglement
└── Interference

Algorithms
├── Bell State
├── Deutsch-Jozsa
├── Grover
└── QFT
```

The AI should retrieve relevant trusted educational content before generating explanations when possible.

Use RAG to reduce hallucinations.

The system should prioritize the project's knowledge base over unsupported AI-generated claims.

---

# 23. AI SAFETY / CORRECTNESS

The AI must follow these rules:

1. Never fabricate quantum simulation results.
2. Never claim that an unexecuted circuit was executed.
3. Never invent measurement probabilities.
4. Clearly distinguish explanation from simulation.
5. If uncertain, say so.
6. Use the quantum engine for computation.
7. Use the knowledge base for educational facts.
8. Keep beginner explanations mathematically correct.

---

# 24. BACKEND

Use:

**Python + FastAPI**

Suggested API structure:

```text
POST /api/simulate

POST /api/ai/ask

POST /api/ai/explain-circuit

POST /api/ai/hint

POST /api/quiz/generate

POST /api/quiz/submit

GET /api/algorithms

GET /api/lessons

GET /api/progress

POST /api/progress/update

GET /api/recommendations
```

Keep APIs modular and well documented.

---

# 25. DATABASE

Use PostgreSQL if practical.

For an initial prototype, SQLite is acceptable.

Suggested entities:

```text
users
learner_profiles
lessons
concepts
algorithms
circuits
quiz_questions
quiz_attempts
learning_progress
concept_mastery
recommendations
```

Do not over-engineer the database.

---

# 26. FRONTEND

Use:

**React + TypeScript**

Use a modern responsive design.

Suggested sections:

```text
/
 /dashboard
 /learn
 /learn/:topic
 /algorithms
 /algorithms/:algorithm
 /quantum-lab
 /quiz
 /progress
 /ai-tutor
```

The platform should work well on laptop and tablet screens.

---

# 27. UI/UX PRINCIPLES

The application should feel like an educational product, not a developer tool.

Design principles:

- Clean
- Modern
- Minimal
- Beginner-friendly
- Interactive
- Clear hierarchy
- Avoid excessive text
- Use visual explanations
- Use meaningful animations
- Provide clear feedback
- Keep navigation simple

Use a consistent visual language for:

- theory
- experiment
- result
- AI feedback
- success
- mistakes

---

# 28. QUANTUM LAB EXPERIENCE

Create a dedicated:

## Quantum Lab

The user can:

```text
Choose Qubits
      ↓
Build Circuit
      ↓
Run Simulation
      ↓
View Results
      ↓
Ask AI
      ↓
Modify Circuit
      ↓
Run Again
```

This should be one of the most visually impressive parts of the application.

---

# 29. FLAGSHIP DEMO — GROVER'S ALGORITHM

Optimize the application around a 3–5 minute demonstration.

Demo sequence:

### Step 1

Student selects:

**Grover's Algorithm**

### Step 2

AI explains the algorithm at beginner level.

### Step 3

Platform shows:

```text
Initialization
↓
Oracle
↓
Amplitude Amplification
↓
Measurement
```

### Step 4

Student opens circuit builder.

### Step 5

Student runs the circuit.

### Step 6

Platform displays actual simulation results.

### Step 7

Student removes a gate.

### Step 8

Runs the circuit again.

### Step 9

Results change.

### Step 10

AI explains why the result changed.

### Step 11

Student receives a challenge.

### Step 12

System evaluates the circuit and updates learning progress.

This entire flow should work reliably.

---

# 30. SOFTWARE ARCHITECTURE

Use a simple architecture:

```text
                    STUDENT
                       │
                       ▼
              React Frontend
                       │
                       ▼
                 FastAPI API
                       │
        ┌──────────────┼───────────────┐
        │              │               │
        ▼              ▼               ▼
   AI Service    Quantum Service    Database
        │              │
        ▼              ▼
    LLM + RAG      Qiskit Aer
                       │
                       ▼
                Simulation Results
                       │
                       ▼
                 Visualization
                       │
                       ▼
                 Student Feedback
                       │
                       ▼
              Adaptive Learning
```

Keep the architecture simple enough for a student hackathon team to maintain.

---

# 31. IMPORTANT DEVELOPMENT RULE

Do NOT generate the entire application in one step.

Build it incrementally.

Development order:

### Phase 1

Create project structure.

### Phase 2

Build frontend navigation and dashboard.

### Phase 3

Build quantum circuit data model.

### Phase 4

Implement Qiskit simulation backend.

### Phase 5

Connect circuit builder to simulator.

### Phase 6

Add visualizations.

### Phase 7

Add AI tutor.

### Phase 8

Add AI circuit explanation.

### Phase 9

Add quizzes.

### Phase 10

Add adaptive learning.

### Phase 11

Testing.

### Phase 12

UI polish.

### Phase 13

Demo optimization.

---

# 32. CODING RULES FOR THE VIBE CODER

Before generating code:

1. Inspect the existing project structure.
2. Do not overwrite working code unnecessarily.
3. Reuse existing components.
4. Ask for clarification only when absolutely necessary.
5. Make one feature at a time.
6. Explain which files will be changed before making major changes.
7. Keep components modular.
8. Use meaningful variable/function names.
9. Add error handling.
10. Never use fake quantum results.
11. Test every feature after implementation.
12. Do not introduce unnecessary libraries.
13. Do not create unnecessary microservices.
14. Keep the application runnable after every major change.

---

# 33. ERROR HANDLING

The application should gracefully handle:

- AI API failure
- Quantum simulation failure
- Invalid circuit
- Unsupported gate
- Empty circuit
- Network failure
- Database failure
- Invalid user input

Show user-friendly messages.

Never expose raw backend errors to beginners.

---

# 34. MVP PRIORITY

The MVP MUST contain:

### HIGH PRIORITY

- Onboarding
- Dashboard
- Learning modules
- Quantum circuit builder
- Qiskit simulation
- Probability visualization
- AI tutor
- AI circuit explanation
- Quiz
- Progress tracking
- Grover demonstration

### MEDIUM PRIORITY

- Adaptive recommendations
- RAG
- Step-by-step execution
- AI hints
- Bell State
- Deutsch-Jozsa
- QFT

### LOW PRIORITY

Only implement if the core product is stable:

- Voice tutor
- Leaderboards
- Advanced gamification
- Real quantum hardware
- Multiplayer
- Mobile application
- Advanced analytics

Never sacrifice core functionality for secondary features.

---

# 35. DEMO DATA

Create a demo learner account/profile so that the entire application can be demonstrated without lengthy setup.

The demo should show:

- partially completed learning journey
- a few mastered concepts
- one weak concept
- Grover as current lesson
- previous quiz attempt
- AI recommendation

Clearly structure demo data so it can be removed or replaced later.

---

# 36. SUCCESS CRITERIA

The project is successful if a beginner can enter the platform and understand this flow without external assistance:

**Learn a quantum concept**

↓

**Build a circuit**

↓

**Run a real simulation**

↓

**See the result**

↓

**Understand why the result occurred**

↓

**Ask AI questions**

↓

**Solve a challenge**

↓

**Receive personalized feedback**

The final product should make quantum algorithms feel:

**visual + interactive + experimental + understandable + personalized.**

---

# 37. FINAL PRODUCT PHILOSOPHY

Do not optimize for the number of features.

Optimize for the quality of this learning loop:

> **LEARN → BUILD → SIMULATE → VISUALIZE → UNDERSTAND → PRACTICE → ADAPT**

The platform should demonstrate that AI is not merely a chatbot.

AI should act as the student's **personal tutor and learning guide**, while Qiskit/Qiskit Aer acts as the **quantum laboratory**.

The student should be the **experimenter**.

Build the MVP around this philosophy.