# Take Home Test

# Technical Assessment: The "Smart" Feedback Portal

### **Objective**

Build a **Customer Feedback Portal** where users can submit feedback, and an automated backend workflow classifies and prioritizes that feedback in real-time.

This test assesses your ability to integrate a modern frontend (**Next.js**) with a Backend-as-a-Service (**Supabase**) and an automation workflow tool (**n8n**).

### **Timeframe**

- **Estimated Effort:** 6–10 hours.
- **Deadline:** 48 hours from receipt.

---

### **1. Core Requirements**

### **A. Database & Auth (Supabase)**

1. **Authentication:**
    - Enable simple Email/Password login.
    - Users must be logged in to submit feedback.
2. **Database Schema:**
    - Create a table named `feedback` with the following columns:
        - `id` (UUID, primary key)
        - `user_id` (Foreign Key to auth.users)
        - `title` (Text)
        - `description` (Text)
        - `category` (Text) – *Initially empty, filled by n8n*
        - `priority` (Text) – *Initially empty, filled by n8n*
        - `status` (Text) – Default: 'Pending'
        - `created_at` (Timestamp)
3. **Security:**
    - Enable **Row Level Security (RLS)**.
    - Users should only be able to read/create their own feedback.

### **B. Automation Workflow (n8n)**

- **Trigger:** The workflow should run automatically when a new row is inserted into the `feedback` table. (You can use Supabase Database Webhooks or an n8n Polling trigger).
- **Logic (The "AI" Simulation):**
    - Analyze the `description` text.
    - If the text contains words like "urgent", "broken", or "error", set **Priority** to `High` and **Category** to `Bug`.
    - Otherwise, set **Priority** to `Low` and **Category** to `General`.
    - *(Bonus points for using a real AI node like OpenAI/HuggingFace, but simple "If/Else" logic is acceptable).*
- **Action:** Update the specific row in Supabase with the new `category`, `priority`, and change `status` to `Processed`.

### **C. Frontend (Next.js)**

1. **Framework:** Use Next.js 14/15 (App Router preferred).
2. **Pages:**
    - **Login Page:** Simple form to authenticate.
    - **Dashboard:**
        - A form to create new feedback (Title + Description).
        - A list view displaying the user's past feedback.
3. **Real-Time UI:**
    - The list view should automatically update (using Supabase Realtime) when n8n finishes processing the item (i.e., when the status changes from 'Pending' to 'Processed' without a page refresh).

---

### **2. Technical Constraints & Setup**

- **Styling:** You may use Tailwind CSS, ShadCN, or any CSS library you prefer. Keep it clean but don't obsess over pixel perfection.
- **n8n Hosting:** You can use the n8n Cloud free trial or run n8n locally (via Docker/npm). If running locally, you may need `ngrok` to expose your webhook to Supabase.
- **Supabase:** Use the free tier.

---

### **3. Evaluation Criteria**

We are not just looking for "code that works," but for "code that is ready for production."

| **Criterion** | **What we look for** |
| --- | --- |
| **Architecture** | Clean separation of concerns. Proper use of Server Components vs. Client Components in Next.js. |
| **Integration** | Correct usage of Supabase Hooks/Client and robust error handling in the n8n workflow. |
| **UX/UI** | Loading states (e.g., "Processing..." status) and optimistic updates. |
| **Security** | Correct RLS policies in Supabase. API keys managed in environment variables. |
| **Documentation** | Clear instructions on how to run the project and import the n8n workflow. |

---

### **4. Submission Instructions**

Please send an email with the following:

1. **GitHub Repository Link:** containing the Next.js source code.
2. **n8n Workflow JSON:** Export your workflow and include it in the repo (e.g., inside a `/workflows` folder).
3. **README.md:** Must include:
    - Prerequisites (Node version, etc.).
    - Setup steps (env variables needed).
    - A screenshot or brief explanation of the RLS policies you created.
    - *(Optional)* A brief video/Loom showing the real-time update in action.
4. Send email to [development@outbound.sg](mailto:development@outbound.sg) 

---

### **Helpful Resources**

- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [n8n Webhook Triggers](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Supabase Database Webhooks](https://supabase.com/docs/guides/database/webhooks)

Good luck! We look forward to seeing your solution.