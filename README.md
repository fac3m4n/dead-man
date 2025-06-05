# Dead Man's NFT

![Dead Man's NFT Hero Image](/public//hero.png)

Protect your sensitive data on-chain and ensure it is only revealed if you stop checking in. Inspired by the "dead man's switch" concept, this dApp leverages iExec Data Protector, Supabase, and blockchain technology to provide a secure, decentralized, and automated way to safeguard and reveal your secrets.

## Overview

Dead Man's NFT allows users to:

- Protect sensitive data using iExec Data Protector.
- Check in periodically to keep their data private.
- Automatically reveal data if the user fails to check in for 7 days.
- Manually reveal data at any time via a "Reveal" button.
- Store check-in history and protected data using Supabase.

## Features

- **Data Protection:** Encrypt and store your secrets using iExec Data Protector.
- **Check-In System:** Users must check in every 24 hours to keep their data private.
- **Automatic Reveal:** If no check-in occurs for 7 days, the data can be revealed.
- **Manual Reveal:** Users can reveal their data at any time.
- **Blockchain Integration:** Connect your wallet and manage your data securely.
- **IPFS Support:** Protected data is stored on IPFS for decentralized access.
- **Notification System:** Get feedback on actions via toast notifications.

## Technologies Used

- Next.js (React)
- TypeScript
- Tailwind CSS (with custom theming)
- iExec Data Protector
- Supabase (database and authentication)
- Wagmi (wallet connection)
- React Query (data fetching/caching)
- IPFS (decentralized storage)
- Sonner (toast notifications)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Supabase project (for database and authentication)
- iExec account and wallet

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fac3m4n/dead-man.git
   cd dead-man
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_PROJECT_ID=your_project_id
     ```
   - (Optional) Add any other required environment variables.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Protect Data:** Go to the "Protect" page, enter your secret, select a reveal method (Twitter/X or Telegram), and protect your data.
- **Check In:** Visit the "Check-In" page and check in daily to keep your data private.
- **Profile:** View your protected data, check-in history, and reveal your data if eligible.
- **Reveal:** If you don't check in for 7 days, your data can be revealed automatically or manually.

## Project Structure

- `src/app/` – Main application pages (Home, Protect, Check-In, Profile)
- `src/components/` – Reusable UI components (Header, Buttons, etc.)
- `src/config/` – Blockchain and Wagmi configuration
- `src/utils/` – Supabase client/server utilities
- `public/` – Static assets (SVGs, icons)

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [iExec Data Protector](https://docs.iex.ec/docs/dataprotector)
- [Supabase](https://supabase.com/)
- [Wagmi](https://wagmi.sh/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
