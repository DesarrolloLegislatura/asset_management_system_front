
```mermaid
erDiagram
    provider_companies {
        BIGINT id PK
        VARCHAR name
        VARCHAR contact_name
        VARCHAR contact_email
        TEXT description
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    system_users {
        BIGINT id PK
        VARCHAR full_name
        VARCHAR email
        VARCHAR department
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    ticket_statuses {
        INT id PK
        VARCHAR code
        VARCHAR name
        TEXT description
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    task_categories {
        INT id PK
        VARCHAR name
        TEXT description
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    priorities {
        INT id PK
        VARCHAR name
        VARCHAR code
        TEXT description
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    service_types {
        INT id PK
        VARCHAR name
        VARCHAR code
        TEXT description
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    external_tickets {
        BIGINT id PK
        BIGINT company_id FK
        VARCHAR external_ticket_number
        VARCHAR simple_action_number
        VARCHAR general_title
        TEXT description
        TEXT context
        INT category_id FK
        INT service_type_id FK
        INT global_status_id FK
        INT priority_id FK
        VARCHAR direct_ticket_url
        BIGINT registration_agent_id FK
        TIMESTAMPTZ external_opening_date
        TIMESTAMPTZ external_closing_date
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    additional_requests {
        BIGINT id PK
        BIGINT parent_ticket_id FK
        INT sequence
        TEXT request_description
        TEXT resolution_description
        INT request_status_id FK
        INT priority_id FK
        BIGINT internal_requester_id FK
        TIMESTAMPTZ request_date
        TIMESTAMPTZ completion_date
        BOOLEAN active
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    tracking_history {
        BIGINT id PK
        BIGINT ticket_id FK "NULLABLE"
        BIGINT additional_request_id FK "NULLABLE"
        TIMESTAMPTZ event_date
        VARCHAR update_source
        INT previous_status_id FK
        INT new_status_id FK
        TEXT comment
        BIGINT registered_by_user_id FK
        TIMESTAMPTZ createdat
        TIMESTAMPTZ updatedat
    }

    %% System Relationships
    provider_companies ||--o{ external_tickets : "issues"
    system_users ||--o{ external_tickets : "registers"
    ticket_statuses ||--o{ external_tickets : "assigns_global_status"
    task_categories ||--o{ external_tickets : "classifies"
    service_types ||--o{ external_tickets : "applies_to"
    priorities ||--o{ external_tickets : "prioritizes_ticket"
    
    %% Relation changed to Optional (0 to N)
    external_tickets ||--o{ additional_requests : "contains_optional_tasks"
    ticket_statuses ||--o{ additional_requests : "assigns_request_status"
    priorities ||--o{ additional_requests : "determines_request_urgency"
    system_users ||--o{ additional_requests : "requests"
    
    %% Dual polymorphic history links
    external_tickets ||--o{ tracking_history : "logs_ticket_changes"
    additional_requests ||--o{ tracking_history : "logs_request_changes"
    system_users ||--o{ tracking_history : "writes"