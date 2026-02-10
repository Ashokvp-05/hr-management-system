# Nexus AI Chatbot - Feature Documentation

## 1. Overview
The **Nexus AI Chatbot** is an intelligent assistant integrated into the HR Management System. It provides instant answers to common employee queries, reducing the load on HR personnel and improving information accessibility.

## 2. Key Capabilities
The chatbot currently supports the following intents:

| Feature | Trigger Keywords | Functionality |
| :--- | :--- | :--- |
| **Leave Balance** | `leave`, `balance`, `remaining` | Checks the user's specific leave quota (Earned, Casual, Sick). |
| **Attendance** | `attendance`, `hours`, `work` | Calculates total hours worked in the current week. |
| **Holidays** | `holiday`, `festival`, `off` | Retrieves the next upcoming holiday from the database. |
| **Kudos** | `kudos`, `appreciation` | Displays the total count and latest kudos message received. |
| **Policies** | `policy`, `rule`, `handbook` | Explains overtime and leave policies instantly. |
| **Support** | `ticket`, `issue`, `bug` | Guides users on how to raise a support ticket. |

## 3. Technical Architecture & Efficiency
The chatbot module (`ai.controller.ts`) has been optimized for performance and scalability:

- **Efficient Intent Matching:** refined from linear regex scanning to a **keyword-set analysis** model. This reduces false positives and improves processing speed.
- **Targeted Database Queries:**
  - Uses `prisma.findUnique` for O(1) balance retrieval.
  - Uses `prisma.findFirst` with date filters for holiday lookups (no full table scans).
  - Fetches only necessary fields (e.g., `select: { name: true }`) to minimize data transfer.
- **Context Awareness:** Automatically identifies the logged-in user securely via the JWT token, preventing unauthorized access to personal data.

## 4. Usage Guide
Users can access the bot via the "Nexus" widget in the bottom right.
**Example Queries:**
- *"How many leaves do I have left?"*
- *"When is the next holiday?"*
- *"Show my attendance for this week."*
- *"Any recent kudos?"*

## 5. Extending the Bot
To add new features, modify `backend/src/controllers/ai.controller.ts`:
1. Add a new `else if (has('keyword'))` block.
2. Implement the specific business logic or database query.
3. Return the `responseText`.
