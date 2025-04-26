```mermaid
graph TD
    A[Dashboard] --> B[Navigate to Jobs]
    B --> C[View Jobs List]
    C --> D[Select Completed Job]
    D --> E[Job Results Overview]
    
    E --> F[Model Performance Tab]
    E --> G[Feature Importance Tab]
    E --> H[Explanations Tab]
    E --> I[Predictions Tab]
    
    F --> J[View Performance Metrics]
    J --> K[View Performance Charts]
    K --> L{Chart Type}
    L -->|Classification| M[Confusion Matrix]
    L -->|Classification| N[ROC Curve]
    L -->|Regression| O[Actual vs Predicted]
    L -->|Regression| P[Residual Plot]
    
    G --> Q[View Feature Importance Chart]
    Q --> R[Interactive Feature Analysis]
    R --> S[Feature Impact Explanation]
    
    H --> T[View Natural Language Explanation]
    T --> U[Technical Details Accordion]
    U --> V[Export Explanation Report]
    
    I --> W[Create Test Predictions]
    W --> X[View Results Table]
    X --> Y[Export Predictions]
    X --> Z[Visualize Predictions]
    
    E --> AA[Compare Models]
    AA --> AB[Select Models to Compare]
    AB --> AC[View Comparison Table]
    AC --> AD[View Comparison Charts]
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style E fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style F fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    style G fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style H fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style I fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px
```

# Results Visualization User Flow

This diagram illustrates the results visualization workflow in PackageML:

1. **Results Access**:
   - Navigate to a completed job from the jobs list
   - View an overview of the job results
   
2. **Performance Analysis**:
   - View performance metrics relevant to the task type
   - Explore various visualization types:
     - Classification: confusion matrix, ROC curve, precision-recall
     - Regression: actual vs predicted, residual plots
   
3. **Feature Importance Analysis**:
   - Visual ranking of feature importance
   - Interactive exploration of how features impact predictions
   - Drill-down into specific feature effects
   
4. **Model Explanation**:
   - Plain-language explanations of how the model works
   - Technical details available for advanced users
   - Exportable reports for sharing with stakeholders
   
5. **Prediction Testing**:
   - Create test predictions using sample data
   - View and export prediction results
   - Visualize predictions on charts
   
6. **Model Comparison**:
   - Compare multiple trained models side-by-side
   - Analyze differences in performance and feature importance

The visualization flow is designed to make complex ML results accessible and actionable for both technical and non-technical users, with a focus on transparent, explainable AI. 