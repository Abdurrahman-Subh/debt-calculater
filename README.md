# Muhasebeji (Debt & Expense Tracker)

A comprehensive debt tracking and personal expense management application built with modern web technologies. Muhasebeji helps you manage financial relationships with friends, track personal expenses, and gain insights through detailed analytics and visualizations.

## 🚀 Features

### Core Functionality

- **Debt Management**: Track money lent to and borrowed from friends
- **Personal Expense Tracking**: Categorized expense management with analytics
- **Payment Tracking**: Record partial and full payments between friends
- **Friend Management**: Add, edit, and organize your financial contacts
- **Multi-Currency Support**: Optimized for Turkish Lira (₺) with full localization

### User Experience

- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Real-time Sync**: Instant data synchronization across devices
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Dark/Light Mode**: Adaptive theming support
- **Turkish Localization**: Complete Turkish language support

### Analytics & Insights

- **Interactive Charts**: Visual debt summaries and expense analytics using Recharts
- **Category Statistics**: Detailed breakdown of expenses by category
- **Monthly Statistics**: Track spending patterns and debt changes over time
- **Friend-wise Analytics**: Individual debt summaries for each friend
- **Export Capabilities**: Share summaries and generate reports

### Sharing & Collaboration

- **QR Code Generation**: Easy sharing of debt summaries
- **WhatsApp Integration**: Direct sharing to WhatsApp
- **Public Share Links**: Secure sharing with customizable permissions
- **Transaction Export**: Export data for external use

### Advanced Features

- **Recurring Transactions**: Set up automatic recurring payments/expenses
- **Partial Payment Management**: Handle complex payment scenarios
- **Category Management**: 10+ predefined expense categories
- **Search & Filter**: Advanced filtering by date, category, and amount
- **Notifications**: Toast notifications for all actions

## 🛠 Tech Stack

### Frontend Framework & Language

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router for enhanced performance
- **[React 18](https://react.dev/)** - Modern React with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for better development experience

### Styling & UI Components

- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework for rapid styling
- **[Shadcn/UI](https://ui.shadcn.com/)** - Re-usable component library built on Radix UI
- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives for accessibility
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library for animations

### State Management & Data Flow

- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management solution
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation

### Backend & Database

- **[Firebase Firestore](https://firebase.google.com/products/firestore)** - NoSQL cloud database
- **[Firebase Authentication](https://firebase.google.com/products/auth)** - Secure user authentication
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Server-side API endpoints

### Charts & Visualization

- **[Recharts](https://recharts.org/)** - Composable charting library for React
- **Custom Analytics** - Built-in statistical calculations and data processing

### Utilities & Libraries

- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[date-fns/locale/tr](https://date-fns.org/v2.29.3/docs/Locale)** - Turkish localization support
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notification system
- **[QR Code Generator](https://www.npmjs.com/package/qrcode)** - QR code generation for sharing

### Development & Build Tools

- **[Turbopack](https://turbo.build/pack)** - Next.js 15's fast bundler for development
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript Compiler](https://www.typescriptlang.org/)** - Type checking and compilation

### Fonts & Assets

- **[Poppins](https://fonts.google.com/specimen/Poppins)** - Modern Google Font for headings
- **[Inter](https://rsms.me/inter/)** - System font for body text
- **Custom Logo** - Emerald green themed branding

### Deployment & Infrastructure

- **[Vercel](https://vercel.com/)** - Optimized for Next.js deployment
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Alternative hosting option
- **Edge Functions** - Server-side rendering at the edge

## 🏗 Architecture

### Project Structure

```
app/
├── (protected)/          # Protected routes requiring authentication
├── api/                  # Next.js API routes for Firebase operations
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/UI base components
│   └── ...              # Custom components
├── context/             # React context providers
├── expenses/            # Personal expense tracking pages
├── friend/              # Friend management pages
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Helper functions and utilities
└── ...                  # Page components and layouts
```

### Data Flow

1. **Authentication**: Firebase Auth handles user management
2. **State Management**: Zustand stores global application state
3. **Data Persistence**: Firestore for real-time data synchronization
4. **API Layer**: Next.js API routes handle server-side operations
5. **UI Updates**: React components update based on state changes

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm or yarn** - Package manager
- **Firebase Account** - For backend services

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/debt-calculater.git
   cd debt-calculater
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase:**

   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Get your Firebase configuration

4. **Environment setup:**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📱 Usage Guide

### Getting Started

1. **Create Account**: Sign up with email and password
2. **Add Friends**: Use "Arkadaş Ekle" to add financial contacts
3. **Record Transactions**: Track debts, loans, and payments
4. **Track Expenses**: Monitor personal spending by category
5. **View Analytics**: Access detailed statistics and charts
6. **Share Summaries**: Generate QR codes or links to share

### Key Features

- **Dashboard**: Overview of all financial activities
- **Debt Tracking**: Manage money lent to/borrowed from friends
- **Expense Management**: Personal spending categorization
- **Payment Records**: Track partial and full payments
- **Statistics**: Visual analytics and insights
- **Sharing**: QR codes and WhatsApp integration

## 🔧 Configuration

### Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /friends/{friendId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }

    match /transactions/{transactionId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Customization

- **Colors**: Modify `app/globals.css` for custom theming
- **Categories**: Update expense categories in `app/types/index.ts`
- **Currency**: Configure currency formatting in `app/utils/currency.ts`
- **Localization**: Add new languages in `date-fns` locale imports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/UI** for the excellent component library
- **Firebase** for the robust backend infrastructure
- **Vercel** for seamless deployment experience
- **Next.js Team** for the amazing framework
- **Turkish Community** for localization feedback
