# SCRUMiGO

***SCRUMiGO*** is a simple SCRUM collaboration app, with a sprint board that supports tracking the work progress of multiple users.

## Additional Information

### Data Model
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
        ObjectId userStories FK "array"
        datetime createdAt
        datetime updatedAt
    }

    USERSTORY {
        ObjectId _id PK
        number userStoryNumber
        ObjectId sprintId FK "optional"
        string title
        string description
        string status
        number storyPoints
        ObjectId tasks FK "array"
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        ObjectId _id PK
        number taskNumber
        string title
        string description
        string status
        ObjectId userStoryId FK
        ObjectId assigneeId FK "optional"
        datetime createdAt
        datetime updatedAt
    }

    SPRINT o|--o{ USERSTORY : contains
    USER ||--o{ USERSTORY : creates
    USERSTORY ||--o{ TASK : contains
    USER o|--o{ TASK : assigned_to
```

### Tools Used

[Figma](https://www.figma.com/)\
[Visual Studio Code](https://code.visualstudio.com/)\
[Adobe Photoshop](https://www.adobe.com/products/photoshop.html)\
[ChatGPT 5.6-Sol](https://chatgpt.com/)\
[MongoDB Compass](https://www.mongodb.com/products/tools/compass)\
[Postman](https://www.postman.com/)

### Resources Used

[MDN Web Docs](https://developer.mozilla.org/en-US/)\
[W3Schools](https://www.w3schools.com/)\
[StackOverflow](https://stackoverflow.com/)\
[HeroUI](https://heroui.com/)\
[Tailwind](https://v3.tailwindcss.com/)\
[Lucide Icons](https://lucide.dev/icons/)\
[Vite](https://vite.dev/)\
[React](https://react.dev/)\
[React Router](https://reactrouter.com/)\
[DNDKit](https://dndkit.com/)\
[Express.js](https://expressjs.com/)\
[MongoDB](https://www.mongodb.com/)\
[Mongoose](https://mongoosejs.com/)
