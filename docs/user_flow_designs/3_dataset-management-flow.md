```mermaid
graph TD
    A[Dashboard] --> B[Navigate to Datasets]
    B --> C[View Dataset List]
    C --> D{User Action}
    D -->|Upload New| E[Dataset Upload Form]
    D -->|View Existing| F[Dataset Details View]
    D -->|Delete| G[Confirm Delete Dialog]
    
    E --> H[Select File]
    H --> I[Configure Dataset Options]
    I --> J[Data Preview]
    J --> K{Validation}
    K -->|Valid| L[Save Dataset]
    K -->|Invalid| M[Show Errors]
    M --> I
    L --> C
    
    F --> N[View Dataset Info & Stats]
    N --> O{User Action}
    O -->|Use in Job| P[Create New Job with Dataset]
    O -->|Edit Metadata| Q[Edit Dataset Metadata]
    O -->|Export| R[Export Dataset]
    
    G --> S{Confirm?}
    S -->|Yes| T[Delete Dataset]
    S -->|No| C
    T --> C
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style C fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    style D fill:#ede7f6,stroke:#673ab7,stroke-width:2px
    style K fill:#fff8e1,stroke:#ffa000,stroke-width:2px
```

# Dataset Management User Flow

This diagram illustrates the complete dataset management flow in PackageML:

1. **Dataset Overview**: Users can view all available datasets from the dashboard
2. **Core Actions**: Upload new datasets, view existing ones, or delete datasets
3. **Upload Process**: 
   - Select dataset file (CSV, Excel, JSON)
   - Configure options (delimiter, encoding, etc.)
   - Preview data before finalizing
   - Validation checks for data quality
4. **Dataset Details**: View statistics, structure, and metadata
5. **Dataset Operations**: 
   - Use a dataset in a new ML job
   - Edit metadata (tags, description)
   - Export in various formats

The flow is designed to be intuitive, with previews and validation to ensure data quality before use in ML models. 