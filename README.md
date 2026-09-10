# SCRUMiGO

## Database Model
```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string surname
        string email
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    SPRINT {
        ObjectId _id PK
        number sprintNumber
        string name
        string goal
        date startDate
        date endDate
        string status
        datetime createdAt
        datetime updatedAt
    }

    USERSTORY {
        ObjectId _id PK
        ObjectId sprintId FK
        string title
        string description
        number storyPoints
        string priority
        ObjectId createdBy FK
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        ObjectId _id PK
        ObjectId userStoryId FK
        ObjectId assigneeId FK
        string title
        string description
        string status
        number Position
        datetime blockedAt
        datetime createdAt
        datetime updatedAt
    }

    COMMENT {
        ObjectId _id PK
        ObjectId taskId FK
        ObjectId authorId FK
        string content
        datetime createdAt
        datetime updatedAt
    }

    SPRINT ||--o{ USERSTORY : contains
    USER ||--o{ USERSTORY : creates

    USERSTORY ||--o{ TASK : contains
    USER ||--o{ TASK : assigned_to

    TASK ||--o{ COMMENT : has
    USER ||--o{ COMMENT : writes
```