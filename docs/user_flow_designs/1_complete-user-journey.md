```mermaid
graph TD
    %% Main user journey flow
    A[New User] --> B[Onboarding]
    B --> C[Dashboard Home]
    
    C --> D[Dataset Management]
    C --> E[Model Training]
    C --> F[API Integration]
    C --> G[Results Visualization]
    
    %% Dataset flow connections
    D --> D1[Upload Dataset]
    D --> D2[View Datasets]
    D1 --> E
    D2 --> E
    
    %% Training flow connections
    E --> E1[Create Job]
    E1 --> E2[Configure Model]
    E2 --> E3[Run Training]
    E3 --> G
    
    %% Results visualization connections
    G --> G1[View Performance]
    G --> G2[View Explanations]
    G --> G3[Export Results]
    G1 --> F
    G2 --> F
    
    %% API integration connections
    F --> F1[Deploy Model]
    F --> F2[Create API Key]
    F1 --> F3[Integration]
    F2 --> F3
    
    %% Styling
    classDef primary fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef dataset fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    classDef training fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef api fill:#ffebee,stroke:#e53935,stroke-width:2px
    classDef results fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    
    class A,B,C primary
    class D,D1,D2 dataset
    class E,E1,E2,E3 training
    class F,F1,F2,F3 api
    class G,G1,G2,G3 results
```

# Complete PackageML User Journey

This diagram presents the comprehensive user journey through PackageML, connecting all the primary user flows:

## 1. Entry & Onboarding
- New users begin with the onboarding process (sign-up or self-hosting)
- After authentication, all users land on the central dashboard

## 2. Core User Flows
From the dashboard, users can access four primary flows:

### Dataset Management
- Upload and configure new datasets
- View and manage existing datasets
- Datasets feed into the model training process

### Model Training
- Create new machine learning jobs
- Configure models (auto or manual)
- Run training processes
- Results feed into visualization and API deployment

### Results Visualization
- Analyze model performance
- Explore feature importance
- View natural language explanations
- Test with predictions
- Compare models

### API Integration
- Deploy models as endpoints
- Generate and manage API keys
- Access integration documentation
- Monitor API usage

## 3. Integration Points
- Dataset Management → Model Training (use datasets)
- Model Training → Results Visualization (view results)
- Results Visualization → API Integration (deploy successful models)
- API Integration → External Applications (consume predictions)

The PackageML user journey emphasizes accessibility for non-experts while providing depth for advanced users, with a focus on making ML actionable through clear visualizations and seamless API integration. 