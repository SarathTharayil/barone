# Bar One - Sheffield University's Student Bar

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-13.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)](https://supabase.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-339933?logo=nodedotjs)](https://nodejs.org/)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SarathTharayil/barone/graphs/commit-activity)
[![GitHub stars](https://img.shields.io/github/stars/SarathTharayil/barone?style=social)](https://github.com/SarathTharayil/barone/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/SarathTharayil/barone?style=social)](https://github.com/SarathTharayil/barone/network/members)
[![GitHub issues](https://img.shields.io/github/issues/SarathTharayil/barone)](https://github.com/SarathTharayil/barone/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/SarathTharayil/barone)](https://github.com/SarathTharayil/barone/pulls)

A modern web application for Bar One, Sheffield University's student bar, featuring real-time information about deals, events, policies, and inventory alerts.

## 🚀 Features

- **Deals & Promotions**: View daily specials and ongoing promotions
- **Events Calendar**: 
  - Weekly recurring events
  - Special events and ticketed shows
  - Beer & Cider Festival information
- **Bar Policies**: Quick access to important bar policies and guidelines
- **Inventory Alerts**: Real-time updates on stock availability and special items
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js with TypeScript
- **UI Components**: Custom components with Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SarathTharayil/barone.git
   cd barone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
barone/
├── app/                    # Next.js app directory
│   ├── components/        # Reusable UI components
│   ├── information/       # Information page components
│   └── lib/              # Utility functions and configurations
├── public/               # Static assets
└── styles/              # Global styles and Tailwind config
```

## 🎨 Design System

The project uses a custom design system with the following color palette:

- **Primary**: Bar One Dark Teal
- **Secondary**: Bar One Coral
- **Accent**: Bar One Teal

## 📱 Features in Detail

### Information Display
- Dynamic tabs for different types of information
- Real-time updates for inventory alerts
- Interactive cards with detailed information
- Modal dialogs for expanded information view

### Event Management
- Weekly recurring events display
- Special events with ticketing information
- Date and time formatting
- Event type categorization

### Inventory Alerts
- Real-time stock updates
- Date range display
- Active/inactive status tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Sarath Tharayil

## 🙏 Acknowledgments

- Sheffield University Students' Union
