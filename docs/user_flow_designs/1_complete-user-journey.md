```mermaid
graph TD
    %% Main user journey flow
    A[New User] --> B[Onboarding]
    B --> C[Dashboard Home]
    
    C --> D[Dataset Management]
    C --> E[Model Training & Results]
    C --> F[API & MCP Integration]
    
    %% Dataset flow connections
    D --> D1[Upload Dataset]
    D --> D2[View Datasets]
    D1 --> E
    D2 --> E
    
    %% Training flow connections
    E --> E1[Create Job]
    E1 --> E2[Configure Model]
    E2 --> E3[Run Training]
    E3 --> E4[View Results]
    
    %% Results connections
    E4 --> E5[Performance Metrics]
    E4 --> E6[Feature Importance]
    E4 --> E7[Model Explanations]
    
    %% API integration connections
    F --> F1[Generate API Keys]
    F --> F2[Access API Documentation]
    F --> F3[Deploy Model Endpoints]
    
    %% API Usage paths
    F1 --> F4[Programmatic Access]
    F2 --> F4
    F4 --> D
    F4 --> E
    F4 --> E4
    F3 --> F5[External Applications]
    
    %% Styling
    classDef primary fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef dataset fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    classDef training fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef api fill:#ffebee,stroke:#e53935,stroke-width:2px
    classDef results fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    
    class A,B,C primary
    class D,D1,D2 dataset
    class E,E1,E2,E3 training
    class E4,E5,E6,E7 results
    class F,F1,F2,F3,F4,F5 api
```

# Complete PackageML User Journey

This diagram presents the comprehensive user journey through PackageML, connecting all the primary user flows:

## 1. Entry & Onboarding
- New users begin with the onboarding process (sign-up or self-hosting)
- After authentication, all users land on the central dashboard

## 2. Core User Flows
From the dashboard, users can access three primary flows:

### Dataset Management
- Upload and configure new datasets
- View and manage existing datasets
- Datasets feed into the model training process

### Model Training & Results
- Create new machine learning jobs
- Configure models (auto or manual)
- Run training processes
- Analyze results:
  - Performance metrics and visualizations
  - Feature importance and impact analysis
  - Natural language explanations
  - Create and test predictions

### API & MCP Integration
- Generate and manage API keys with specific permissions
- Access comprehensive API documentation
- Deploy models as REST endpoints with MCP support
- Programmatically access all platform functionality:
  - Dataset management via API
  - Job creation and monitoring via API
  - Results retrieval via API
  - Predictions with context via MCP

## 3. Integration Points
- Dataset Management → Model Training (use datasets)
- Model Training → Results (immediate visualization)
- API & MCP → All Functionality (full programmatic access)
- Deployed Models → External Applications (consume predictions with context)

The PackageML user journey emphasizes accessibility for non-experts while providing depth for advanced users. The platform can be used entirely through the UI or programmatically via the comprehensive API, with the MCP ensuring context-rich integration for all predictions. 