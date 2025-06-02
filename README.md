# Muhasebeji (Debt Tracker)

A simple debt tracking application that helps you manage debts between friends. Built with Next.js, React, TypeScript, and Firebase.

## Features

- Add and manage friends
- Record different types of transactions (borrowed money, lent money, and payments)
- Collapsible transaction form for better UI experience
- Visual debt summaries with color coding
- Detailed statistics dashboard with charts
- Firebase backend for data persistence
- Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **UI Components**: Shadcn/UI
- **State Management**: Zustand
- **Backend**: Firebase Firestore
- **API**: Next.js API routes
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/debt-tracker.git
   cd debt-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a Firebase project:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add a web app to your project
   - Enable Firestore database

4. Create a `.env.local` file with your Firebase configuration:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Add friends using the "Arkadaş Ekle" button
2. Add transactions by clicking "İşlem Ekle" button
3. View debt summaries on the home page
4. See detailed statistics in the dashboard

## App Structure

- `/app` - Next.js App Router structure
  - `/api` - API routes for Firebase operations
  - `/components` - Reusable UI components
  - `/lib` - Firebase configuration
  - `/store` - Zustand state management
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions

## License

MIT
