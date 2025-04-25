- [Define the app idea](#define-the-app-idea)
- [Describe the app in detail](#describe-the-app-in-detail)
- [List specific features](#list-specific-features)

# Define the app idea
Small organisations and individual enthusiasts often sit on useful data but hit a wall when they try to apply machine-learning. Installing Python libraries, wrestling with GPUs, or paying for managed cloud AutoML is beyond their budget and skill set. Even when they succeed, models feel opaque and their predictions are hard to integrate back into daily workflows. A universal, low-cost, self-hosted tool that bundles training, explainability, and easy integration is missing. PackageML targets exactly this gap.

PackageML is a lightweight, GNU GPL v3-licensed web application that ships as a single Docker-Compose stack (frontend, Python backend, MySQL, and an MCP context server). Users upload datasets, launch training jobs, receive clear explanations and charts, and pull predictions through REST endpoints—all without writing code. The curated algorithm list keeps resource use modest, while an Auto-Select option helps novices pick a good model quickly. Every action—dataset upload, model run, prediction request—is also exposed through the API served by the MCP layer, making integration with spreadsheets, dashboards, or low-code tools trivial. The UI is HTML + CSS with a dash of vanilla JS to stay fast on small servers. On an 8 GB / 4 vCPU VPS the stack installs in minutes and runs reliably for classroom, NGO, or small-business workloads. By combining no-code usability with explainability and seamless context-aware APIs, PackageML turns raw CSVs into trustworthy, actionable insights.

# Describe the app in detail
| **Aspect** | **Detail** |
| --- | --- |
| **Goal of the app** | Turn raw tabular data into interpretable machine-learning models and context-rich prediction APIs without coding or expensive cloud services. |
| **Target audience** | Educators, NGO analysts, small-business owners, and hobbyists who have data but limited programming expertise or infrastructure budget. |
| **Main functions** | 1) **Train models** on chosen algorithms, 2) **Manage datasets** (upload, validate, preview), 3) **Auto-select best algorithms** for novices, 4) **Generate explanations & visualisations**, 5) **Track experiment history**, 6) **Serve predictions via REST/MCP**. |
| **Data storage & security** | Datasets, models, and run logs are stored in MySQL (uploads on disk); passwords are salted-hashes and role-based access controls restrict sensitive endpoints. TLS can be added with a reverse proxy container. |
| **Deployment footprint** | Entire stack runs comfortably on an 8 GB RAM / 4 vCPU VPS; one `docker-compose.yml` orchestrates services for fast setup and repeatable upgrades. |
| **Licensing model** | Open-source under GNU GPL v3; commercial users must share improvements, keeping the ecosystem transparent and community-driven. |

# List specific features
**Dataset Management**
-   Upload CSV/Excel/JSON files via UI or REST
-   Validate schema and detect data types
-   Preview data table with basic stats (rows, missing values)
-   Tag and organise datasets by project

**Model Training & Selection**
-   Choose algorithm manually from a curated list
-   Auto-select best algorithms based on data 
-   Adjust hyper-parameters with form inputs and sensible defaults
-   Train asynchronously with progress bar

**Result Explanation & Visualisation**
-   Generate plain-language summary of model performance
-   Display feature importance charts (bar/pie)
-   Export visualisations as PNG/SVG for reports

**Experiment History & Versioning**
-   Log each run with dataset version, algorithm, parameters, and metrics
-   Compare past runs side-by-side in a sortable table
-   Re-run an experiment with tweaked settings ("clone run")

**Integration & Deployment (MCP / API)**
-   Serve predictions through a REST endpoint implementing the Model-Context-Protocol
-   Stream prediction context (inputs, timestamp, user) back to calling apps
-   Provide API keys and usage analytics per user/project

**User Account & Security**
-   Email-based sign-up/login with password reset
-   Audit log of user actions (login, dataset upload, model run)
-   Manage API keys

