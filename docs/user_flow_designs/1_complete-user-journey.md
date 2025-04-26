```mermaid
graph TD
    %% Main user journey flow
    A[New User] --> B[Onboarding]
    B --> C[Dashboard Home]
    
    C --> D[Dataset Management]
    C --> E[Model Training & Results]
    C --> F[API & MCP Integration]
    
    %% High-level flow connections
    D --> E
    E --> F
    F --> D
    
    %% External connections
    F --> G[External Applications]
    
    %% Styling
    classDef primary fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef dataset fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    classDef training fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef api fill:#ffebee,stroke:#e53935,stroke-width:2px
    
    class A,B,C primary
    class D dataset
    class E training
    class F api
    class G primary
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
- Create and run machine learning jobs
- Configure models and training parameters
- Analyze results through visualizations and explanations

### API & MCP Integration
- Full programmatic access to all platform functionality
- Deploy models as REST endpoints with MCP support
- Integrate with external applications

## 3. Integration Points
- Dataset Management → Model Training (use datasets)
- Model Training → API & MCP (deploy models)
- API & MCP → Dataset Management (programmatic access)
- API & MCP → External Applications (consume predictions with context)

The PackageML user journey emphasizes accessibility for non-experts while providing depth for advanced users. The platform can be used entirely through the UI or programmatically via the comprehensive API, with the MCP ensuring context-rich integration for all predictions. 