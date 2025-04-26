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
    
    %% Results visualization section (incorporated from results flow)
    T --> V[Job Results Overview]
    V --> W[Model Performance Metrics]
    V --> X[Feature Importance Charts]
    V --> Y[Model Explanations]
    V --> Z[Test Predictions]
    
    W --> W1[Performance Charts]
    W1 --> W2{Chart Type}
    W2 -->|Classification| W3[Confusion Matrix/ROC]
    W2 -->|Regression| W4[Actual vs Predicted]
    
    X --> X1[Feature Ranking]
    X1 --> X2[Impact Analysis]
    
    Y --> Y1[Plain-Language Summary]
    Y1 --> Y2[Technical Details]
    Y2 --> Y3[Export Report]
    
    Z --> Z1[Create Predictions]
    Z1 --> Z2[View/Export Results]
    
    V --> V1[Compare Models]
    V1 --> V2[Side-by-Side Comparison]
    
    %% Deployment options
    V --> AA[Export/Deploy Model]
    
    U --> BB[Troubleshoot]
    BB --> CC[Adjust Parameters]
    CC --> Q
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style G fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style J fill:#ede7f6,stroke:#673ab7,stroke-width:2px
    style S fill:#fff8e1,stroke:#ffa000,stroke-width:2px
    style V fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style W fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    style X fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style Y fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style Z fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
```

# Model Training and Results User Flow

This diagram presents the complete model training and results workflow in PackageML:

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
   - **Performance Metrics**: View metrics relevant to the task (accuracy, F1, RMSE, etc.)
   - **Performance Charts**: Explore visualizations like confusion matrices, ROC curves, residual plots
   - **Feature Importance**: See which inputs most affect predictions and explore their impact
   - **Explanations**: Access plain-language summaries and technical details about how the model works
   - **Test Predictions**: Create predictions using new data and visualize/export results
   - **Model Comparison**: Compare multiple models side-by-side on key metrics

8. **Deployment Options**:
   - Export model for offline use
   - Deploy as API endpoint with MCP integration

The flow emphasizes a guided experience with clear steps, making ML accessible to non-experts while still providing flexibility for advanced users. Results are presented immediately in the interface after training completion, with options to export visualizations and deploy models for real-world use. 