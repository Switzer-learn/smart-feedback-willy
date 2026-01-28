# Smart Feedback Portal

A "Smart" Customer Feedback Portal built with Next.js, Supabase, and n8n. This application allows users to submit feedback, which is then automatically classified and prioritized by an n8n workflow.

## Features

-   **User Authentication**: Email/Password login using Supabase Auth. (without email confirmation for comfort)
-   **Feedback Submission**: Users can submit feedback (Title + Description).
-   **Real-time Dashboard**: Feedback list updates automatically via Supabase Realtime when processed.
-   **Automated Processing**: n8n workflow analyzes text to assign Category and Priority.
-   **Security**: Row Level Security (RLS) ensures users only access their own data.

## Prerequisites

-   **Node.js** (v18 or later recommended)
-   **npm** or **yarn** or **pnpm**
-   **Supabase Account** (Free tier)
-   **n8n Account** (Cloud or Self-hosted)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Switzer-learn/smart-feedback-willy.git
cd smart-feedback-portal
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gdeeoqtkozyhvnqwynkh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_786WLzqtX2EdeWrFaXM-TA_KHOsV3Gn
OPENROUTER_API_KEY=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 (i have limited the credit to 1$ as free tier gemini keep hitting the limit :D)
NEXT_SUPABASE_SECRET_KEY=sb_secret_EmIu5gGuqRJKZNDDRUqQOw_x5GrYi7d (need this for n8n if you want to use mine)
```

### 3. Supabase Setup

1.  Create a new project in Supabase.
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy the contents of `db.sql` from this repository and run it to create the `feedback` table and set up RLS policies.

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## n8n Workflow Setup

1.  **Import Workflow**:
    -   Open your n8n dashboard.
    -   Go to **Workflows** > **Import from File**.
    -   Select `workflows/My workflow.json` from this project.

2.  **Configure Credentials**:
    -   **Supabase Trigger**: Set up credentials using your Supabase URL and Service Role Key (to bypass RLS for reading new rows if needed, though Anon logic works if configured correctly, Service Role is recommended for backend automation).
    -   **Supabase Update Node**: Ensure you use the **Service Role Key** so n8n can update the `category`, `priority`, and `status` fields (since users do not have permissions to UPDATE rows).

3.  **Activate**:
    -   Toggle the workflow to **Active**.

---

## Architecture & Security

### Row Level Security (RLS) Policies

We implement two strict RLS policies to ensure data data isolation:

1.  **View Policy (SELECT)**:
    -   `Users can view own feedback`: Users can only see rows where their `auth.uid()` matches the record's `user_id`.
    
2.  **Insert Policy (INSERT)**:
    -   `Users can insert own feedback`: Users can only create records if they assign the `user_id` to their own account ID.

**Note**: There is intentionally **no UPDATE policy** for authenticated users. This means users cannot change their feedback status or category once submitted; only the system (n8n via Service Role) can perform these updates.

---

## Technologies Used

-   **Frontend**: Next.js 15 (App Router), Tailwind CSS
-   **Backend**: Supabase (PostgreSQL, Auth, Realtime)
-   **Automation**: n8n (Webhook/Polling, Logic, Database Update)

