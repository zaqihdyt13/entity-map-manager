<img width="959" height="421" alt="image" src="https://github.com/user-attachments/assets/8b1c14d9-8966-4d76-b7f1-1a5d20116dcb" />

# Entity Map Management

A full-stack web application for managing and visualizing geographically located entities on an interactive map.

This project was developed as part of a Software Developer take-home assessment.

## Features

- Display entities as markers on an interactive map.
- View entity details by clicking a marker.
- Create entities and select their geographic locations on the map.
- Update entity information and coordinates.
- Delete entities through a confirmation dialog.
- Validate entity data on both frontend and backend.
- Display success and error notifications.
- Persist entity data using SQLite.

## Tech Stack

### Frontend

- **React 19 + TypeScript 6** — Component-based development with static typing.
- **Vite 8** — Development server and production build tooling.
- **Tailwind CSS 4** — Utility-first styling.
- **shadcn/ui + Base UI** — Reusable UI components.
- **React Hook Form + Zod** — Form management and validation.
- **React Map GL + MapLibre GL** — Interactive map rendering.
- **OpenFreeMap** — Map tiles and styles.
- **Sonner** — Toast notifications.

### Backend

- **Go 1.26.4** — Backend programming language.
- **Gin** — HTTP framework for REST API endpoints.
- **GORM** — ORM for database operations.
- **SQLite** — Lightweight file-based database.

## Getting Started

### Prerequisites

Install the following tools:

- Go 1.26.4
- Node.js compatible with Vite 8
- pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/zaqihdyt13/entity-map-manager.git
cd entity-map-manager
```

### 2. Run the Backend

Open a terminal:

```bash
cd backend
go mod download
go run .
```

The backend starts at:

`http://localhost:8080`

The SQLite database is automatically initialized when the backend starts.

- Database file: `backend/database.db`
- Tables are created or migrated automatically using GORM's `AutoMigrate()`.

No separate database server or manual migration command is required.

### 3. Run the Frontend

Open another terminal from the repository root:

```bash
cd frontend
pnpm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the frontend:

```bash
pnpm dev
```

Open:

`http://localhost:5173`

Keep the backend running while using the frontend.

## How to Use

1. Open the application in your browser.
2. Click **Add Entity**.
3. Enter the entity name, type, and status.
4. Click **Select Location** and choose a position on the map.
5. Submit the form to create the entity.
6. Click an entity marker to view its details.
7. Use the available actions to edit or delete the entity.

## API Endpoints

Base URL: `http://localhost:8080`

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/api/entities`     | Retrieve all entities     |
| POST   | `/api/entities`     | Create a new entity       |
| PUT    | `/api/entities/:id` | Update an existing entity |
| DELETE | `/api/entities/:id` | Delete an existing entity |

### Example Request Body

```json
{
  "name": "Vehicle A",
  "type": "vehicle",
  "status": "active",
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

### Entity Fields

| Field     | Type   | Description                            |
| --------- | ------ | -------------------------------------- |
| id        | number | Unique entity identifier               |
| name      | string | Entity name                            |
| type      | string | `vehicle`, `iot_device`, or `facility` |
| status    | string | `active` or `inactive`                 |
| latitude  | number | Geographic latitude                    |
| longitude | number | Geographic longitude                   |

## Technology Decisions

**Vite** provides a fast development environment and straightforward production builds.

**GORM** simplifies database operations, while **SQLite** allows the application to run locally without installing a separate database server.

**React Map GL and MapLibre GL** provide interactive maps and integration with React.

**OpenFreeMap** provides map styles and tiles without requiring an API key in this implementation.

**React Hook Form and Zod** support form state management and client-side validation.

**Tailwind CSS and shadcn/ui** provide consistent styling and reusable interface components.

**Sonner** provides non-blocking feedback for successful and failed operations.

**State Management** Zustand was considered but not implemented because the application's current state management needs can be handled effectively using React's built-in `useState` and `useEffect` hooks. Most state is managed within a small number of related components, so introducing a global state management library would add unnecessary complexity at this stage. Zustand may be considered in the future if the application grows and requires more complex shared state management.

## AI Usage Workflow

ChatGPT was used as an AI-assisted development tool during this project.

The workflow involved:

1. Discussing implementation approaches and technology choices.
2. Requesting explanations and code examples for specific features.
3. Reviewing suggestions before manually applying changes.
4. Running the application and testing functionality manually.
5. Sharing errors or unexpected behavior for further troubleshooting.
6. Refactoring and verifying the implementation incrementally.

The developer remained responsible for implementation decisions, source code changes, and testing.

No autonomous coding agent was used to directly modify the repository, execute commands, or independently complete development tasks.

## Testing

The following functionality was manually tested:

- Creating entities.
- Viewing entities on the map.
- Editing entity information and locations.
- Deleting entities.
- Form validation.
- Success and error notifications.
- Handling backend connection failures.

### Frontend Checks

```bash
cd frontend
pnpm lint
pnpm build
```

### Backend Build

```bash
cd backend
go build ./...
```

## Known Limitations

The application focuses on the functional requirements of the take-home assessment.

It does not currently include:

- User authentication and authorization.
- Real-time synchronization between multiple clients.
- Automated unit or integration tests.
- Entity-specific map markers: All entity types currently use the same default map marker. Custom marker icons representing each entity type (such as a vehicle icon for vehicles, a device icon for IoT devices, and a building icon for facilities) have not yet been implemented.

## License

Developed for a Software Developer take-home assessment.
