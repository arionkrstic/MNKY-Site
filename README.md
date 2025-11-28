# MNKY - The Anti-App

A beautifully designed, minimalist landing page for **MNKY**, an iMessage-based personal productivity assistant. This project focuses on a high-end, mystery-driven aesthetic to drive user sign-ups via a Supabase OTP (One-Time Password) authentication flow.

![MNKY Landing Page Preview](https://via.placeholder.com/800x400?text=MNKY+Landing+Page+Preview)

## ✨ Features

-   **Minimalist "Anti-App" Design**: Dark mode aesthetic, glassmorphism effects, and subtle gradients to convey a premium feel.
-   **Interactive Sign-Up Flow**:
    -   **Fluid Morphing**: The "Request Early Access" button smoothly transforms into an email input field using `framer-motion` layout animations.
    -   **Supabase Auth Integration**: Secure passwordless sign-up using email OTP (Magic Link/Code).
    -   **Seamless UX**: Auto-focusing inputs, auto-submission upon entering the 6th digit, and intuitive error handling (shake animation).
-   **Robust Error Handling**:
    -   Visual feedback for incorrect codes (shake effect, red borders) without layout shifts.
    -   Specific handling for rate-limiting (HTTP 429) and other API errors.
    -   Persistent instruction text to maintain layout stability.
-   **Smart Persistence**:
    -   Uses cookies to remember signed-up users.
    -   Displays a clean "You are signed up for updates" message for returning users, hiding the form.
-   **Responsive & Accessible**: Fully responsive layout that works across devices, with attention to focus states and keyboard navigation.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Backend/Auth**: [Supabase](https://supabase.com/) (Auth & Edge Functions)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ installed
-   A Supabase project with Email Auth enabled

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/mnky-site.git
    cd mnky-site
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the site**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
/app
  /components
    Hero.tsx       # Main interactive component (Sign up flow & animations)
  /lib
    supabase.ts    # Supabase client initialization
  globals.css      # Global Tailwind styles & theme variables
  layout.tsx       # Root layout & metadata
  page.tsx         # Main entry point
```

## 🎨 Design Philosophy

The design philosophy is "No new apps. No clutter. Just text." This is reflected in the UI:
-   **No distractions**: The focus is entirely on the value proposition and the sign-up action.
-   **Fluidity**: Elements morph and flow rather than appearing/disappearing abruptly.
-   **Stability**: Layouts are anchored to prevent content jumping during state changes.

## 📄 License

[MIT](LICENSE)
