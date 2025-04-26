```mermaid
graph TD
    A[Dashboard] --> B[Navigate to Jobs]
    A --> C[Navigate to New Item]
    B --> D[View Jobs List]
    C --> E[Select Create New Job]
    D --> F[Start New Job]
    
    E --> G[Job Creation Wizard]
    F --> G
    
    G --> H[Step 1: Select Dataset]
    H --> I[Step 2: Choose Task Type]
    I --> J{Algorithm Selection}
    J -->|Auto-Select| K[Configure Auto-Select]
    J -->|Manual| L[Choose Specific Algorithm]
    
    K --> M[Set Target Column]
    L --> M
    M --> N[Set Features/Parameters]
    N --> O[Configure Training Options]
    O --> P[Review Configuration]
    P --> Q[Start Training Job]
    
    Q --> R[Live Training Progress]
    R --> S{Training Status}
    S -->|Completed| T[View Results]
    S -->|Failed| U[View Error Logs]
    S -->|In Progress| R
    
    T --> V[Model Performance Metrics]
    V --> W[Feature Importance]
    W --> X[Export/Deploy Model]
    
    U --> Y[Troubleshoot]
    Y --> Z[Adjust Parameters]
    Z --> Q
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style G fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style J fill:#ede7f6,stroke:#673ab7,stroke-width:2px
    style S fill:#fff8e1,stroke:#ffa000,stroke-width:2px
```

# Model Training User Flow

This diagram presents the complete model training workflow in PackageML:

1. **Entry Points**: Users can start a new job from the dashboard, jobs list, or "New Item" page
2. **Job Creation Wizard**: A step-by-step process guides users through job configuration
3. **Dataset Selection**: Users choose a dataset from previously uploaded options
4. **Task & Algorithm Selection**:
   - Choose task type (classification, regression, etc.)
   - Decide between Auto-Select (for novices) or manual algorithm choice
5. **Model Configuration**:
   - Set target variable and features
   - Configure algorithm-specific parameters
   - Set training options (validation split, etc.)
6. **Training Process**:
   - Real-time progress tracking
   - Status monitoring with success/failure paths
7. **Results Analysis**:
   - Performance metrics visualization
   - Feature importance charts
   - Model explanation in plain language
8. **Deployment Options**:
   - Export model
   - Deploy as API endpoint

The flow emphasizes a guided experience with clear steps, making ML accessible to non-experts while still providing flexibility for advanced users. 