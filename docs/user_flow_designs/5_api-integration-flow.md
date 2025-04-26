```mermaid
graph TD
    A[Dashboard] --> B[Navigate to API Keys]
    B --> C[View API Keys List]
    C --> D{User Action}
    D -->|Generate New Key| E[API Key Generation Form]
    D -->|View Details| F[API Key Details]
    D -->|Revoke| G[Confirm Revoke Dialog]
    
    E --> H[Set Key Name/Description]
    H --> I[Set Permissions/Scope]
    I --> J[Generate Key]
    J --> K[Display New Key]
    K --> L[Copy to Clipboard]
    L --> C
    
    F --> M[View Key Usage Stats]
    M --> N[View Endpoints]
    
    G --> O{Confirm?}
    O -->|Yes| P[Revoke Key]
    O -->|No| C
    P --> C
    
    A --> Q[Navigate to Models]
    Q --> R[View Model List]
    R --> S[Select Trained Model]
    S --> T[View Model Details]
    T --> U[Deploy as API Endpoint]
    U --> V[Configure Endpoint Settings]
    V --> W[Endpoint Created]
    W --> X[View Endpoint Details]
    X --> Y[Copy Endpoint URL]
    X --> Z[View Documentation]
    Z --> AA[Integration Examples]
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style C fill:#ffebee,stroke:#e53935,stroke-width:2px
    style X fill:#e8f5e9,stroke:#43a047,stroke-width:2px
```

# API Integration User Flow

This diagram illustrates the API integration workflow in PackageML:

1. **API Key Management**:
   - Generate new API keys with specific permissions
   - View existing keys and usage statistics
   - Revoke keys when needed
   
2. **Model Deployment as API**:
   - Select a trained model from the models list
   - Configure deployment settings (rate limiting, caching)
   - Deploy model as a REST endpoint
   
3. **Endpoint Management**:
   - View endpoint details and performance metrics
   - Access integration documentation
   - Copy endpoint URL for use in applications
   
4. **Integration Resources**:
   - View code examples for different languages/platforms
   - Access Model-Context-Protocol (MCP) documentation
   - Test endpoint with sample requests

The API integration flow is designed to make it simple for users to expose their trained models as services that can be consumed by other applications, with a focus on security (through API keys) and ease of integration. 