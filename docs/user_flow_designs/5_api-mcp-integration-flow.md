```mermaid
graph TD
    A[Dashboard] --> B[Navigate to API Keys]
    B --> C[View API Keys List]
    C --> D{User Action}
    D -->|Generate New Key| E[API Key Generation Form]
    D -->|View Details| F[API Key Details]
    D -->|Revoke| G[Confirm Revoke Dialog]
    
    E --> H[Set Key Name/Description]
    H --> I[Set Expiry Date]
    I --> J[Generate Key]
    J --> K[Display New Key]
    K --> L[Copy to Clipboard]
    L --> C
    
    F --> M[View Key Usage Stats]
    M --> N[View API Endpoints Documentation]
    
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
    
    N --> AA[API Documentation]
    Z --> AA
    AA --> AB[Dataset Management API]
    AA --> AC[Job Management API]
    AA --> AD[Model Management API]
    AA --> AE[Prediction API]
    AA --> AF[MCP Protocol Docs]
    
    AF --> AG[MCP Context Examples]
    AF --> AH[Integration Code Samples]
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style C fill:#ffebee,stroke:#e53935,stroke-width:2px
    style X fill:#e8f5e9,stroke:#43a047,stroke-width:2px
    style AA fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
```

# API & MCP Integration Flow

This diagram illustrates the comprehensive API and Model-Context-Protocol (MCP) integration workflow in PackageML:

1. **API Key Management**:
   - Generate new API keys with key name and description
   - Set expiry date for security
   - View existing keys and track usage statistics
   - Revoke keys when needed for security
   
2. **Full Platform API Access**:
   - Every functionality available in the UI is also accessible via API
   - Dataset Management: upload, validate, list, and manage datasets
   - Job Management: create, configure, run, and monitor ML jobs
   - Model Management: access trained models, view metrics, export models
   - Results and Predictions: retrieve performance metrics, explanations, and make predictions
   
3. **Model Deployment**:
   - Deploy trained models as REST endpoints
   - Configure deployment settings (rate limiting, caching)
   - Monitor endpoint performance and usage
   
4. **Model-Context-Protocol (MCP)**:
   - Implement the MCP for context-aware ML predictions
   - Stream prediction context (inputs, timestamp, user) with each request
   - Maintain provenance data for auditing and transparency
   
5. **Integration Resources**:
   - Comprehensive API documentation for all endpoints
   - Code examples for multiple languages/platforms
   - MCP protocol specifications and implementation guides
   - Example integration patterns for common scenarios

The API & MCP integration flow is designed to make PackageML a fully programmable platform, where every action that can be performed through the user interface can also be automated through the API. This enables seamless integration with existing workflows, applications, and systems while maintaining the context awareness provided by the MCP layer. 