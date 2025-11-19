# 🕴️ The Corelli Dashboard

> *"Never let them know what you're thinking."*

A high-fidelity, distraction-free personal command centre designed for the disciplined operator. This dashboard enforces strict separation between **Deep Work (Focus Mode)** and **Decompression (Relax Mode)** using a Noir/Mafia aesthetic.

Built with **Next.js**, **Tailwind CSS**, and **TypeScript**. Zero database. Zero paper trail.

![Dashboard Preview](https://github.com/user-attachments/assets/placeholder-image)

---

## 📂 The Dossier (Features)

The dashboard operates in two distinct modes, controlled by "The Fuse" (Timer).

### 💼 The Grind (Focus Mode)
* **The Fuse:** A strict 25-minute countdown. You cannot leave until the job is done.
* **Operations:** A session-based task list. Cross them out as you execute them.
* **The Ledger:** A distraction-free notepad with `.txt` export capabilities ("The Drop").
* **The Consigliere:** A secure, encrypted chat line to **Google Gemini AI** for strategy and intel.
* **Vinyl Player:** Minimalist audio controls playing Noir Jazz.

### 🥃 The Lounge (Relax Mode)
* **The Pulse:** A hypnotic breathing visualizer to lower your heart rate.
* **The Chain:** A habit tracker to ensure your daily rituals are respected.
* **The Outlook:** Live weather data (via Open-Meteo) to check the atmosphere.
* **The Wire:** A digital dictaphone for recording voice notes/ideas.
* **The Wisdom:** A shuffled deck of non-repeating quotes from history's greatest strategists.

### 🔒 Security Protocols
* **The Blind:** Press `Esc` to instantly black out the screen ("Operations Suspended").
* **The Incinerator:** A kill-switch that wipes all Session Storage and resets the room.
* **Session Storage:** Data lives only in your browser tab. Close it, and it's gone.

---

## 🔫 The Armoury (Tech Stack)

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Framer Motion (for the smooth, smoky animations)
* **Language:** TypeScript (Strict typing, no loose ends)
* **State:** Zustand (Global store for mode switching)
* **Icons:** Lucide React
* **AI:** Google Generative AI SDK (`@google/genai`)

---

## 🏗️ Establishing the Safe House (Installation)

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/mafia-dashboard.git](https://github.com/your-username/mafia-dashboard.git)
    cd mafia-dashboard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure the Safe (`.env.local`)**
    Create a `.env.local` file in the root directory. You need one key for the AI.
    ```env
    GEMINI_API_KEY=your_google_gemini_key_here
    ```
    *Note: The Weather widget uses Open-Meteo and requires no key.*

4.  **Start the Operation**
    ```bash
    npm run dev
    ```
    Access the dashboard at `http://localhost:3000`.

---

## 🚀 Going Public (Deployment)

This project is optimized for **Vercel**.

1.  Push your code to a private GitHub repository.
2.  Import the project into Vercel.
3.  **CRITICAL:** Add your `GEMINI_API_KEY` in the Vercel **Environment Variables** settings.
4.  Deploy.

---

## 📜 License

**MIT License**. Use it freely. Just don't rat on your friends.

---

*Architected by "The Metronome".*
