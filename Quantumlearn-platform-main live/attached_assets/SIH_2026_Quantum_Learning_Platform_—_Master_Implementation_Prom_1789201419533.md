# MASTER IMPLEMENTATION PROMPT
## AI-Based Interactive Quantum Algorithm Learning Platform — SIH26140

You are working on an **existing quantum education platform**. Your job is to **extend and integrate** the current application into a complete professional learning platform.

### CRITICAL RULE
**DO NOT rebuild the project from scratch.**
**DO NOT replace or break existing authentication, database structure, Quantum State Visualizer, routing, UI components, or working features.**

First inspect the existing codebase and architecture. Reuse existing components, APIs, styles, layouts, and services wherever possible.

Build incrementally and keep the existing application working after every change.

---

# 1. PRODUCT VISION

Build an AI-powered interactive quantum-computing education platform where students:

**LEARN → VISUALIZE → PREDICT → BUILD → SIMULATE → ANALYZE → UNDERSTAND → PRACTICE → REVIEW → ADAPT**

The platform should feel like a combination of:

- Interactive classroom
- Quantum laboratory
- Coding playground
- AI tutor
- Practice platform
- Progress tracker

The main educational loop is:

**CLASSROOM → understand concept → EXPLORE IN LAB → experiment/code/simulate → understand result → return to CLASSROOM**

The platform must support students from **zero quantum-computing knowledge to advanced/research-level concepts**.

---

# 2. MAIN NAVIGATION

Keep the existing navigation if already implemented. Extend it with:

### MAIN
- Dashboard
- Learn / Classroom
- Quantum Lab
- Algorithms
- Practice
- Challenges

### PERSONAL
- My Progress
- Achievements
- AI Tutor

### SUPPORT
- Documentation
- Settings
- Profile

Do not create unnecessary duplicate pages.

---

# 3. CLASSROOM

Create a structured curriculum with:

- Levels
- Modules
- Lessons
- Concepts
- Examples
- Visual explanations
- Interactive checkpoints
- Quizzes
- Practice questions
- "Explore in Lab" buttons where useful
- Progress tracking
- Mastery status

Each lesson should clearly contain:

1. Learning objective
2. Simple explanation
3. Mathematical explanation when appropriate
4. Visual intuition
5. Example
6. Interactive activity where useful
7. Common mistakes
8. Quick quiz
9. "Explore in Lab" connection
10. Next lesson

Use progressive difficulty:

**Beginner → Intermediate → Advanced → Research**

Do not overwhelm beginners with advanced mathematics immediately.

---

# 4. COMPLETE QUANTUM COMPUTING SYLLABUS

Implement the curriculum architecture for all of the following.

## LEVEL 0 — PREREQUISITES

### Computer Science
- Computers and computation
- Classical computation
- Information and data
- Bits and bytes
- Binary
- Boolean logic
- Logic gates
- Classical circuits
- Algorithms
- Complexity
- Classical vs quantum computation

### Mathematics
- Numbers and variables
- Probability
- Probability distributions
- Vectors
- Vector operations
- Matrices
- Matrix multiplication
- Complex numbers
- Complex vectors
- Inner products
- Orthogonality
- Eigenvalues
- Eigenvectors
- Linear transformations
- Why linear algebra matters in quantum computing

### Python
- Variables and data types
- Conditions
- Loops
- Functions
- Lists/dictionaries
- Libraries
- Running Python programs
- Scientific computing basics

---

# LEVEL 1 — INTRODUCTION TO QUANTUM COMPUTING

- What is quantum computing?
- Why quantum computing?
- Classical vs quantum computers
- Quantum information
- Quantum advantage
- Applications
- Limitations
- NISQ era
- Future of quantum computing

### Quantum Physics Intuition
- Quantum mechanics introduction
- Quantum states
- Measurement
- Superposition
- Probability amplitudes
- Phase
- Interference
- Entanglement
- Uncertainty
- Why quantum mechanics enables quantum computing

---

# LEVEL 2 — QUBITS AND QUANTUM STATES

- Qubit
- Classical bit vs qubit
- Computational basis
- |0⟩ and |1⟩
- State notation
- Dirac notation
- State vectors
- Normalization
- Superposition
- Equal and unequal superposition
- Amplitudes
- Probabilities
- Bloch sphere
- Bloch sphere coordinates
- Quantum-state visualization
- State rotations

Use the existing **Quantum State Visualizer** wherever possible.

---

# LEVEL 3 — QUANTUM MEASUREMENT

- Measurement
- Computational-basis measurement
- Measurement probabilities
- State collapse
- Repeated measurements
- Shots
- Histograms
- Statistics
- Observables
- Hermitian operators
- Eigenstates
- Eigenvalues
- Expectation values
- Measurement in different bases

Lab:
**Measurement Lab**

---

# LEVEL 4 — SINGLE-QUBIT GATES

Teach:

- Identity
- X
- Y
- Z
- Hadamard
- S
- S†
- T
- T†
- Phase gates
- Rx
- Ry
- Rz
- Arbitrary single-qubit rotations

Also teach:

- Gate matrices
- Unitary operations
- Gate composition
- Inverse gates
- Global phase
- Relative phase

Lab:
**Gate Playground**

---

# LEVEL 5 — QUANTUM CIRCUITS

- Quantum circuits
- Qubit wires
- Gate ordering
- Circuit depth
- Circuit width
- Execution
- Measurement
- Sequential operations
- Inverse circuits
- Circuit composition
- Controlled operations
- Circuit simplification
- Qiskit QuantumCircuit
- Qiskit gates
- Measurement
- Simulation
- Visualization

Lab:
**Quantum Circuit Builder + Code Editor**

---

# LEVEL 6 — MULTI-QUBIT SYSTEMS

- Two-qubit states
- Multi-qubit states
- Tensor products
- Computational basis
- Joint probability distributions
- CNOT
- CZ
- Controlled-H
- SWAP
- Controlled-phase
- General controlled gates

---

# LEVEL 7 — ENTANGLEMENT

- What is entanglement?
- Product states vs entangled states
- Bell states
- Bell-state circuits
- Quantum correlations
- Classical correlation vs entanglement
- Quantum teleportation
- Superdense coding
- Bell inequalities
- Introduction to quantum nonlocality

Labs:
- Bell State Lab
- Teleportation Lab

---

# LEVEL 8 — QUANTUM PHENOMENA

- Global phase
- Relative phase
- Phase gates
- Interference
- Constructive interference
- Destructive interference
- Amplitude interference
- Why interference is important

Lab:
**Quantum Interference Lab**

---

# LEVEL 9 — QUANTUM INFORMATION

- Classical information vs quantum information
- State distinguishability
- Measurement
- Density matrices
- Pure states
- Mixed states
- Trace
- Reduced states
- Partial trace
- Quantum channels
- Unitary channels
- Noise
- Open quantum systems

---

# LEVEL 10 — QUANTUM ALGORITHM FOUNDATIONS

- What is a quantum algorithm?
- Classical vs quantum algorithms
- Oracle concept
- Query complexity
- Quantum parallelism
- Interference-based computation
- Amplitude amplification

---

# LEVEL 11 — QUANTUM ALGORITHMS

Implement educational modules for:

### Deutsch Algorithm
- Problem
- Classical approach
- Quantum approach
- Oracle
- Circuit
- Measurement
- Simulation
- Complexity
- Limitations

### Deutsch-Jozsa
- Problem
- Classical solution
- Quantum solution
- Oracle
- Circuit
- Simulation
- Results

### Bernstein-Vazirani
- Hidden string
- Classical approach
- Quantum circuit
- Oracle
- Measurement
- Simulation

### Simon's Algorithm
- Problem
- Hidden period/string
- Oracle
- Quantum approach
- Measurement
- High-level algorithm

### Grover's Algorithm
- Search problem
- Classical search
- Oracle
- Marked state
- Amplitude amplification
- Diffusion operator
- Iterations
- Measurement
- Probability changes
- Complexity
- Limitations

Lab:
**Grover Explorer**

The Grover lab must allow the learner to select a target and actually run the simulation.

---

# LEVEL 12 — QUANTUM FOURIER TRANSFORM

- Fourier-transform intuition
- QFT
- QFT circuit
- Hadamard gates
- Controlled phase gates
- SWAP operations
- Inverse QFT
- Applications

Lab:
**QFT Lab**

---

# LEVEL 13 — QUANTUM PHASE ESTIMATION

- Eigenstates
- Eigenvalues
- Phase
- Controlled operations
- Inverse QFT
- QPE circuit
- Measurement
- Applications

---

# LEVEL 14 — SHOR'S ALGORITHM

Teach progressively:

- Factoring problem
- Classical factoring
- Period finding
- Modular arithmetic
- Quantum period finding
- QFT connection
- Phase-estimation connection
- Shor algorithm workflow
- Complexity
- Cryptography implications

Do NOT overwhelm beginners with a huge implementation immediately.

Use visual step-by-step explanations first.

---

# LEVEL 15 — QUANTUM ERROR AND NOISE

- Quantum noise
- Decoherence
- Relaxation
- Dephasing
- Gate errors
- Measurement errors
- Ideal vs noisy simulation
- Noise models

Error correction:
- Bit-flip code
- Phase-flip code
- Repetition codes
- Shor code
- Stabilizer concepts
- Surface code introduction
- Fault tolerance

Lab:
**Noise & Error Lab**

---

# LEVEL 16 — QUANTUM HARDWARE

Teach:

- Superconducting qubits
- Trapped ions
- Neutral atoms
- Photonic quantum computing
- Spin qubits
- Quantum annealing
- Coherence
- Fidelity
- Connectivity
- Circuit depth
- Calibration
- Noise
- Readout

---

# LEVEL 17 — QUANTUM COMPILATION

- Compilation
- Transpilation
- Native gates
- Qubit mapping
- Hardware connectivity
- Routing
- Optimization
- Gate cancellation
- Circuit-depth reduction

Lab:
**Circuit Optimization Lab**

Show before/after circuit differences where possible.

---

# LEVEL 18 — VARIATIONAL QUANTUM COMPUTING

- Hybrid quantum-classical computing
- Parameterized circuits
- Cost functions
- Classical optimizers

### VQE
- Hamiltonians
- Energy expectation
- Ansatz
- Optimization
- Hybrid loop
- Quantum chemistry applications

### QAOA
- Optimization problems
- Cost Hamiltonian
- Mixer Hamiltonian
- Parameters
- Circuit
- Classical optimization
- Applications

Labs:
- VQE Lab
- QAOA Lab

---

# LEVEL 19 — QUANTUM MACHINE LEARNING

- Classical ML vs QML
- Quantum data
- Classical data
- Data encoding
- Feature maps
- Variational classifiers
- Quantum kernels
- Quantum neural networks
- Parameterized quantum circuits
- Hybrid ML
- Quantum generative models

---

# LEVEL 20 — QUANTUM CRYPTOGRAPHY

- Classical cryptography
- Quantum cryptography
- Quantum key distribution
- BB84
- E91
- No-cloning theorem
- Eavesdropping detection
- Post-quantum cryptography overview

Lab:
**BB84 Simulator**

---

# LEVEL 21 — QUANTUM COMMUNICATION

- Quantum communication
- Quantum teleportation
- Bell states
- Classical communication requirement
- Teleportation circuit
- Superdense coding
- Quantum networks
- Quantum repeaters

Lab:
**Quantum Teleportation Lab**

---

# LEVEL 22 — QUANTUM COMPLEXITY

- Complexity theory
- P
- NP
- BQP
- Quantum speedups
- Query complexity
- Polynomial vs exponential complexity
- Limits of quantum computing

---

# LEVEL 23 — QUANTUM SIMULATION

- Why simulate quantum systems?
- Hamiltonians
- Time evolution
- Schrödinger-equation intuition
- Quantum dynamics
- Variational simulation
- Chemistry
- Many-body systems

---

# LEVEL 24 — ADVANCED QUANTUM THEORY

- Hilbert spaces
- Operators
- Hermitian operators
- Unitary operators
- Tensor products
- Eigenvalue problems
- Spectral decomposition
- Density operators
- Quantum states

Advanced information theory:
- Entropy
- Von Neumann entropy
- Quantum channels
- Fidelity
- Trace distance
- Relative entropy

---

# LEVEL 25 — ADVANCED QUANTUM ALGORITHMS

- Amplitude amplification
- Amplitude estimation
- Quantum walks
- Quantum counting
- Hidden subgroup concepts
- Advanced phase estimation
- Hamiltonian simulation
- Quantum linear systems
- HHL
- Quantum Monte Carlo concepts

---

# LEVEL 26 — ERROR CORRECTION AND FAULT TOLERANCE

- Stabilizer formalism
- Quantum error-correcting codes
- Surface codes
- Logical qubits
- Syndrome measurement
- Fault tolerance
- Threshold theorem
- Logical gates
- Magic states
- Quantum architectures

---

# LEVEL 27 — QUANTUM SOFTWARE DEVELOPMENT

Teach actual development with Qiskit:

- Qiskit fundamentals
- QuantumCircuit
- Gates
- Measurement
- Simulation
- Visualization
- Transpilation
- Backends
- Experiments
- Results

Introduce later:
- PennyLane
- Cirq

---

# LEVEL 28 — REAL QUANTUM HARDWARE

Teach:

- Quantum backends
- Calibration
- Queueing
- Backend properties
- Real-device execution
- Shots
- Noise
- Hardware-aware circuit design
- Simulator vs real hardware

Only use actual hardware APIs when configured. Never fake hardware results.

---

# LEVEL 29 — QUANTUM APPLICATIONS

Create overview/application modules for:

- Chemistry
- Optimization
- Cryptography
- Machine learning
- Quantum simulation

---

# LEVEL 30 — PROJECTS AND CAPSTONE

### Beginner
- Random qubit experiment
- Superposition simulator
- Quantum coin flip
- Bell-state generator
- Circuit visualizer

### Intermediate
- Quantum teleportation
- Grover search
- Deutsch-Jozsa
- Quantum random number generator
- Quantum game

### Advanced
- VQE
- QAOA
- Quantum classifier
- Noise-aware circuit optimizer
- Quantum error-correction simulator
- Quantum chemistry experiment
- Research project

---

# 5. QUANTUM LAB

The Lab is the practical counterpart to Classroom.

Create reusable laboratory infrastructure instead of separately hard-coding every lab.

Each lab should support:

**BUILD → PREDICT → RUN → VISUALIZE → ANALYZE → MODIFY → RUN AGAIN**

Possible labs:

- Qubit Visualizer
- State Visualizer
- Gate Playground
- Measurement Lab
- Circuit Builder
- Bell State Lab
- Entanglement Lab
- Interference Lab
- Grover Explorer
- QFT Lab
- QPE Lab
- Noise Lab
- Circuit Optimization Lab
- VQE Lab
- QAOA Lab
- BB84 Lab
- Teleportation Lab

Not every theoretical lesson needs a lab.

---

# 6. CODE MUST EXIST BEHIND EVERY SIMULATION

This is a CORE REQUIREMENT.

Every quantum simulation shown to the learner must have **real executable quantum code behind it**.

Never create fake/decorative code.

The displayed code must actually correspond to the circuit and simulation being executed.

Use:

**Python + Qiskit + Qiskit Aer**

as the primary quantum simulation stack.

The simulation backend must be the source of truth.

---

# 7. THREE LAB MODES

Every suitable simulation should support:

### VISUAL MODE
Learner works with:
- Qubits
- Gates
- Circuit
- Visual controls

### CODE MODE
Show the actual executable Qiskit code.

### SPLIT MODE
Show simultaneously:

**Circuit | Qiskit Code | Run Button | Results**

This should be the flagship learning experience.

---

# 8. CIRCUIT ↔ CODE CONNECTION

Where technically practical:

**Circuit → Code**

and

**Supported Code → Circuit**

must stay synchronized.

Do NOT pretend arbitrary Python can always be converted into a circuit.

Define and document a supported quantum-code subset.

When a learner changes supported circuit code:

- Update circuit
- Run actual simulation
- Update probabilities
- Update counts
- Update visualizations
- Update explanation

When a learner changes the circuit visually:

- Update corresponding code
- Run simulation
- Update results

---

# 9. BEGINNER CODE + FULL CODE

Every important lab should support:

### Simple Code
Clean beginner-friendly Qiskit code.

### Full Code
More complete production/educational implementation.

Example:

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)

qc.h(0)
qc.cx(0, 1)

qc.measure([0, 1], [0, 1])

simulator = AerSimulator()
result = simulator.run(qc, shots=1000).result()

counts = result.get_counts()
print(counts)
```

The exact code displayed must match the simulation being executed.

---

# 10. ACTUAL SIMULATION RESULTS

Never hard-code quantum results.

For every simulation return real data such as:

- Circuit
- State information where appropriate
- Probabilities
- Measurement counts
- Number of shots
- Console output
- Errors/warnings
- Execution time where useful

Example structure:

```json
{
  "probabilities": {},
  "counts": {},
  "shots": 1000,
  "statevector": null,
  "console_output": "",
  "errors": []
}
```

Populate these values from the actual simulator.

---

# 11. CODE EDITOR

Provide an embedded code editor for appropriate labs.

Features:

- Syntax highlighting
- Run
- Reset
- Undo/redo
- Clear error messages
- Code validation
- Beginner hints
- Explain Code
- Simple/Full Code toggle
- Code history where practical

Learners should be able to modify safe quantum code and observe how the result changes.

---

# 12. SAFE CODE EXECUTION

User code must run in a restricted environment.

Do not allow arbitrary:

- Filesystem access
- Network access
- Secrets/environment variables
- Dangerous system commands
- Unlimited computation

Use:

- Execution timeout
- Memory limits
- Restricted imports
- Sandboxed execution
- Validation
- Resource limits

---

# 13. AI TUTOR

The AI Tutor should understand the current learning context.

It should know:

- Current lesson
- Current lab
- Current circuit
- Current code
- Qubits
- Gates
- Simulation result
- User mistakes
- Quiz performance
- Progress/mastery

AI features:

- Explain concept
- Explain code
- Explain circuit
- Explain simulation result
- Give hint
- Debug code
- Ask Socratic questions
- Recommend next lesson
- Recommend practice
- Identify weak concepts

IMPORTANT:

The AI must NOT invent simulation results.

When explaining results, use the actual simulator output.

---

# 14. PREDICTION-FIRST LEARNING

Before running important experiments, ask:

**"What do you think will happen?"**

For example:

- Predict measurement probabilities
- Predict final state
- Predict effect of a gate
- Predict Grover target probability
- Predict effect of removing a gate

Then run the real simulation.

Show:

**Your Prediction → Actual Result → Difference → Explanation**

Track prediction accuracy as part of progress.

---

# 15. PRACTICE AND CHALLENGES

Create:

### Concept Questions
- MCQ
- True/false
- Short answer
- Concept matching

### Circuit Challenges
- Complete the circuit
- Fix the circuit
- Predict the output
- Build a Bell state
- Create superposition
- Create entanglement

### Coding Challenges
- Write Qiskit code
- Modify existing code
- Debug quantum code
- Achieve a target probability distribution

Coding challenges must execute actual code.

Do not judge only by matching text.

---

# 16. PROGRESS AND MASTERY

Track:

- Lessons completed
- Labs completed
- Quiz scores
- Practice performance
- Prediction accuracy
- Challenges completed
- Simulation attempts
- Mistakes
- Time spent
- Saved circuits
- Coding performance
- Concept mastery

Mastery states:

- Not Started
- Learning
- Practicing
- Mastered

Allow learners to preview advanced concepts without unnecessarily locking everything behind prerequisites.

---

# 17. CLASSROOM ↔ LAB CONNECTION

Every suitable lesson should have:

**Explore in Lab**

Example:

Lesson:
**Hadamard Gate**

Button:
**Explore Hadamard in Lab**

The learner enters the Gate Playground with:

- Correct qubit setup
- Correct H gate
- Corresponding Qiskit code
- Run button
- Visualization
- Explanation

Similarly:

Grover lesson → Grover Lab

QFT lesson → QFT Lab

Noise lesson → Noise Lab

VQE lesson → VQE Lab

etc.

The lab should preserve learning context when returning to Classroom.

---

# 18. DASHBOARD

Create/update dashboard with:

- Continue Learning
- Current course
- Recommended lesson
- Recommended lab
- Progress percentage
- Mastery overview
- Recent experiments
- Recent simulations
- Practice performance
- Prediction accuracy
- Achievements
- Quick Actions

Do not overcrowd the dashboard.

---

# 19. DESIGN

Use a professional **Quantum Laboratory / University** visual identity.

Avoid generic cyberpunk/neon gaming design.

Use:

- Clean dark/light compatible UI
- Deep navy/dark backgrounds where appropriate
- Cyan/blue/purple quantum accents
- Clear typography
- Subtle quantum/circuit patterns
- Smooth transitions
- Circuit visualizations
- Probability bars
- Bloch sphere
- State transitions
- Quantum animations

The UI should communicate:

**education + science + experimentation + technology**

not just "AI".

---

# 20. IMPORTANT VISUALIZATIONS

Use interactive educational visualizations for:

- Qubit state
- Bloch sphere
- Probability amplitudes
- Measurement probabilities
- Histograms
- Quantum circuits
- Gate effects
- State transitions
- Entanglement
- Interference
- Grover amplification
- QFT
- Noise
- Circuit optimization

Animations should explain concepts rather than exist only for decoration.

---

# 21. FLAGSHIP DEMO

The primary demonstration should be:

## Bell State Experiment

Student sees:

```text
|0> ── H ──●── M
           │
|0> ───────X── M
```

Then:

1. Explain prediction
2. Student predicts output
3. Show actual Qiskit code
4. Run Aer simulation
5. Show probabilities
6. Show measurement counts
7. Visualize entanglement
8. AI explains result
9. Student removes H
10. Run again
11. Compare results
12. Explain why the result changed

This should demonstrate the entire platform philosophy.

---

# 22. FLAGSHIP ALGORITHM DEMO

Use **Grover's Algorithm**.

Student:

1. Selects search space
2. Selects target
3. Sees classical search
4. Builds quantum oracle
5. Sees amplitude amplification
6. Predicts result
7. Runs actual Qiskit simulation
8. Sees probability distribution
9. Views executable code
10. Modifies circuit/code
11. Runs again
12. Gets AI explanation
13. Completes a reasoning challenge
14. Completes a quiz
15. Receives a personalized next-step recommendation

---

# 23. BACKEND ARCHITECTURE

Reuse the existing backend.

If the project already uses Python/FastAPI, extend it.

Recommended endpoints:

```text
POST /api/simulate
POST /api/ai/ask
POST /api/ai/explain-circuit
POST /api/ai/explain-code
POST /api/ai/hint

GET  /api/algorithms
GET  /api/lessons

POST /api/quiz/generate
POST /api/quiz/submit

GET  /api/progress
POST /api/progress/update

GET  /api/recommendations

GET  /api/labs
POST /api/labs/run

GET  /api/challenges
POST /api/challenges/submit
```

Only create missing endpoints. Reuse existing APIs when possible.

---

# 24. STANDARD CIRCUIT DATA MODEL

Use a reusable circuit representation such as:

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

Do not create different incompatible circuit formats for every lab.

---

# 25. CODE-SIMULATION-CIRCUIT CONSISTENCY

This is extremely important.

There must never be:

**Displayed Circuit ≠ Displayed Code ≠ Executed Simulation**

All three must represent the same experiment.

Correct architecture:

**Student Input**
↓
**Validated Circuit/Code**
↓
**Quantum Execution Engine**
↓
**Actual Results**
↓
**Visualization**
↓
**AI Explanation**

The quantum execution engine is the source of truth.

---

# 26. PERFORMANCE AND LOW-CREDIT DEVELOPMENT

Because development resources/AI coding credits are limited:

### DO:
- Inspect existing code first
- Reuse existing components
- Create reusable components
- Create reusable lab framework
- Create reusable lesson schema
- Create reusable simulation engine
- Create reusable code editor
- Create reusable result visualization
- Use configuration/data files for curriculum
- Use one generic LabPage where possible
- Use one generic LessonPage where possible
- Build shared components
- Implement in small safe increments

### DO NOT:
- Rebuild existing authentication
- Rebuild existing State Visualizer
- Duplicate components
- Create separate hard-coded architecture for every lab
- Create fake quantum results
- Add unnecessary libraries
- Rewrite working code
- Generate huge duplicate files
- Create unnecessary animations
- Change the entire UI unnecessarily

The goal is **maximum functionality with minimum code duplication**.

---

# 27. IMPLEMENTATION STRATEGY

Work in this order:

### PHASE 1
Inspect existing project.

Identify:

- Frontend
- Backend
- Database
- Authentication
- Existing Quantum State Visualizer
- Existing routes
- Existing components
- Existing APIs
- Existing styling

Do not modify anything yet.

### PHASE 2
Create/reuse shared:

- Lesson schema
- Module schema
- Lab schema
- Circuit schema
- Simulation service
- Code editor
- Result viewer
- AI context layer

### PHASE 3
Build Classroom framework.

### PHASE 4
Populate complete 30-level syllabus structure.

Do not manually duplicate page code for every lesson.

Use reusable lesson data/components.

### PHASE 5
Build reusable Quantum Lab framework.

### PHASE 6
Connect Qiskit/Aer execution.

### PHASE 7
Connect:

**Circuit ↔ Code ↔ Simulation ↔ Visualization**

### PHASE 8
Add AI Tutor context.

### PHASE 9
Add practice, challenges, prediction system and progress tracking.

### PHASE 10
Polish flagship Bell State + Grover experiences.

### PHASE 11
Test existing features and prevent regressions.

---

# 28. QUALITY REQUIREMENTS

Before considering the work complete, verify:

- Existing authentication still works
- Existing Quantum State Visualizer still works
- Classroom works
- Lab works
- Lessons connect to labs
- Qiskit simulation actually executes
- Displayed code corresponds to simulation
- Circuit corresponds to code
- Results are real
- Code editing works for supported code
- Errors are understandable
- AI explanations use actual context
- Progress saves
- Quizzes work
- Challenges work
- Responsive layout works
- No major console errors
- No broken routes
- No fake quantum outputs

---

# 29. MOST IMPORTANT PRODUCT PRINCIPLE

The platform is NOT simply:

**"a website that teaches quantum computing."**

It is:

**"An AI-powered interactive quantum laboratory where students don't just learn quantum algorithms—they build them, predict their behavior, simulate them, visualize them, inspect the actual code behind them, modify them, analyze the results, and learn from their mistakes."**

The central learning loop must remain:

**CLASSROOM**
↓
**CONCEPT**
↓
**PREDICT**
↓
**EXPLORE IN LAB**
↓
**BUILD CIRCUIT**
↓
**SEE ACTUAL CODE**
↓
**RUN REAL SIMULATION**
↓
**VISUALIZE RESULT**
↓
**AI EXPLANATION**
↓
**MODIFY**
↓
**RUN AGAIN**
↓
**PRACTICE**
↓
**MASTER**

Implement this by **extending the current project**, not rebuilding it.
Prioritize reusable architecture, real quantum execution, educational clarity, and minimal code duplication.