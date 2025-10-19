# Supabase Setup Guide

Follow these steps to set up your Supabase backend for the e-commerce application.

## 1. Create a Supabase Project

1.  Go to [Supabase](https://supabase.com/) and sign in or create a new account.
2.  Click on **New project** and choose your organization.
3.  Fill in the project details:
    *   **Name**: Give your project a name (e.g., `cleaning-ecommerce`).
    *   **Database Password**: Generate a secure password and save it somewhere safe.
    *   **Region**: Choose the region closest to your users.
4.  Click **Create new project**.

## 2. Get Your API Keys

Once your project is created, you'll need to get your API keys.

1.  In the Supabase dashboard, go to **Project Settings** (the gear icon in the left sidebar).
2.  Click on **API**.
3.  You will find your **Project URL** and **Project API Keys** (specifically the `anon` `public` key).

## 3. Configure Your `.env` File

Update your `.env` file in the root of your project with the credentials you just copied:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with the values from your Supabase project.

## 4. Run the SQL Scripts

You need to run the SQL scripts to create the necessary tables and policies in your Supabase database.

1.  In the Supabase dashboard, go to the **SQL Editor** (the SQL icon in the left sidebar).
2.  Click on **New query**.
3.  Copy the contents of `scripts/01-create-tables.sql` and paste it into the SQL editor.
4.  Click **Run**.
5.  Create a new query, copy the contents of `scripts/02-seed-products.sql`, and run it.
6.  Create another new query, copy the contents of `scripts/03-create-billing-tables.sql`, and run it.

Your Supabase backend is now set up and ready to be used with your Next.js application.