# Event Feedback Hub

## Description

**Event Feedback Hub** is a cloud-based web application where users can share feedback on events they attended (workshops, webinars, conferences) and view others' feedback in real time. Users select an event, submit feedback with a 1–5 star rating, and see a live stream of feedback for the selected event with filtering and pagination.

---

## Tech Stack

| Layer   | Technologies |
|--------|---------------|
| **Frontend** | Vite, React 19, TypeScript, Apollo Client, Material UI, GraphQL Code Generator |
| **Backend**  | Node.js, Express, Apollo Server, GraphQL, graphql-ws (WebSocket) |
| **Data**     | In-memory storage |
| **Real time** | GraphQL subscriptions over WebSocket |

---

## How to Run Locally

1. **Install dependencies** (from repo root):

   ```bash
   npm install
   ```

2. **Start client and server** (from repo root):

   ```bash
   npm run dev
   ```

   This runs:

   - **Client**: Vite dev server (default: `http://localhost:5173`)
   - **Server**: GraphQL API + WebSocket (default: `http://localhost:4000/graphql`)

3. **Optional — run client or server only**:

   ```bash
   npm run dev -w client   # frontend only
   npm run dev -w server   # backend only
   ```

4. **Client scripts** (from repo root or from `client/`):

   - `npm run codegen -w client` — regenerate GraphQL types and operations
   - `npm run build -w client` — production build
   - `npm run test -w client` — run Vitest
   - `npm run lint -w client` — run ESLint

5. **Server scripts** (from repo root or from `server/`):

   - `npm run build -w server` — compile TypeScript to `dist/`
   - `npm run start -w server` — run compiled server
   - `npm run lint -w server` — run ESLint

---

## Architecture

### Monorepo layout

- **Root**: npm workspaces for `client` and `server`, shared Prettier, and a single `npm run dev` to start both apps.
- **`client/`**: Vite + React SPA.
- **`server/`**: Express app with Apollo Server (HTTP + WebSocket).

### Backend

- **GraphQL**: Schema in `server/src/schema/schema.graphql`. Types: `Event`, `Feedback`, `FeedbackPage` (cursor pagination). Operations: `events`, `feedback(eventId, rating?, cursor?, limit?)`, `createFeedback`, subscription `feedbackCreated(eventId?)`.
- **Resolvers**: Thin resolvers in `server/src/resolvers/` that delegate to services.
- **Services**: Business logic in `server/src/services/` (e.g. `eventService`, `feedbackService`). Validation and domain rules live here; resolvers stay minimal.
- **Store**: In-memory stores in `server/src/store/` for events and feedback (seed data, no persistence).
- **Subscriptions**: `graphql-ws` + `ws` on the same HTTP server; `feedbackCreated` publishes when new feedback is created and supports filtering by `eventId`.

### Frontend

- **Feature-based structure**: Features under `client/src/features/` (e.g. `events`, `feedback`). Each feature can contain components, hooks, and GraphQL operations.
- **GraphQL**: Types generated with GraphQL Code Generator into `client/src/generated/`. Operations are defined using the `graphql()` helper, which produces fully typed DocumentNodes used directly in React hooks.
- **Apollo Client**: HTTP + WebSocket link split (subscriptions over WS, queries/mutations over HTTP). Cache policies for `feedback` (e.g. keyed by `eventId`, `rating`) and cursor-based pagination merge.
- **UI**: Material UI; shared components (e.g. `Rating`) under `client/src/shared/`.

### Data flow

- User selects event and submits feedback via the form → `createFeedback` mutation → server validates, stores, publishes `feedbackCreated` → subscribed clients receive the event and update the feedback stream.
- Feedback stream: `feedback` query with `eventId`, optional `rating`, `cursor`, `limit`; subscription adds new items in real time.

---

## Potential Improvements

### Server

- Use DataLoader to avoid potential N+1 query issues when resolving event relations.
- Generate strongly typed GraphQL resolvers using GraphQL Code Generator.

### Client

- Move API URLs to environment variables for better configurability.
- Add pre-commit hooks (e.g. Husky + lint-staged) to enforce linting before commits.
- Use a dedicated form library such as React Hook Form to simplify form state management and validation.
- Use direct Apollo cache updates after mutations instead of refetching queries.

### UI / UX

- Implement optimistic UI updates when submitting feedback.
- Make the feedback stream scrollable to prevent the page from growing indefinitely.
- Prevent users from submitting multiple feedback entries for the same event.
