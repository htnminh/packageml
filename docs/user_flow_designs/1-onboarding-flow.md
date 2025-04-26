```mermaid
graph TD
    A[User Visits Landing Page] --> B[View Features & Benefits]
    B --> C{User Decision}
    C -->|Sign Up| D[Registration Form]
    C -->|Learn More| E[View Documentation]
    C -->|Download| F[Download Docker Compose Files]
    D --> G[Create Account]
    G --> H[First-time Login]
    H --> I[Dashboard Home]
    E --> C
    F --> J[Deploy Self-Hosted Instance]
    J --> K[Setup Admin Account]
    K --> I
    
    style A fill:#f5f5f5,stroke:#333,stroke-width:2px
    style I fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    style C fill:#ede7f6,stroke:#673ab7,stroke-width:2px
```

# Onboarding User Flow

This diagram shows the main onboarding paths for new users of PackageML:

1. **Landing Page Entry**: Users visit the site and learn about the platform
2. **Information Gathering**: Users can explore features, benefits, and use cases
3. **Decision Points**: Users can choose to sign up directly, learn more, or download for self-hosting
4. **Account Creation**: Standard sign-up flow leading to dashboard
5. **Self-Hosting Path**: Users can download and deploy their own instance

The onboarding is designed to accommodate both cloud users and self-hosters, with minimal friction to reach the dashboard where the core functionality begins. 