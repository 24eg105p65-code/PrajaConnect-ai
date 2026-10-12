# PrajaConnect AI (Version 1 - Village Edition)

AI-Powered Indian Village Public Service & Complaint Management Platform built for 10 configurable wards.

## 🚀 Getting Started in VS Code

1. Extract the downloaded `prajaconnect-ai-nextjs.zip` folder.
2. Open the extracted folder in **Visual Studio Code**.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Copy `.env.example` to `.env.local`.
   - Provide your Supabase URL & Anon Key.
5. Apply database schema:
   - Open `supabase/migrations/01_schema_and_rls.sql`.
   - Paste it into the SQL Editor of your Supabase dashboard and click **Run**.
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Hardware & Device Permissions
- **Camera:** Uses `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` for live pothole/wire snapshots.
- **Microphone:** Uses `MediaRecorder` to record native Telugu audio memos.
- **GPS:** Uses `navigator.geolocation.getCurrentPosition` with `enableHighAccuracy: true`.
- **Direct Dial:** Integrated Prajavani 1902 helpline and Ward Member tele-calling.
