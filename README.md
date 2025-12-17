# 👟 Sneaker Studio – Product Customizer Tool

Sneaker Studio is a modern, interactive e-commerce product customizer that allows users to design sneakers in real time. Users can choose base products, customize colors, materials, textures, add engravings, preview changes instantly, save designs, and get AI-powered style suggestions.

This project was built as part of a **Frontend Developer Intern technical assignment**.

---

## 🚀 Live Demo

👉 **Live URL:** https://sneaker-studio-customizer.vercel.app/
                                                            /signup
                                                            /login
                                                            /customizer
                                                            /gallery
👉 **GitHub Repository:** https://github.com/Shreyaschauhan/sneaker-studio-customizer  

---

## 🔐 Test Credentials

Use the following credentials to explore the application:

```
Email: test@gmail.com
Password: Test@123
```

(You may also create a new account using the signup page.)

---

## ✨ Features

### 1️⃣ User Authentication
- Custom Login & Signup UI
- Email & password validation with error handling
- Password masking
- JWT-like session handling using `localStorage`
- Protected routes (Customizer & Gallery)

### 2️⃣ Product Selection & Customization
- Base product selection (Air Max, Jordan)
- Color customization for sneaker parts
- Material selection (Leather / Canvas)
- Texture & finish swatches
- Text engraving input
- Real-time compatibility validation with user-friendly warnings

### 3️⃣ Live Preview Canvas
- Real-time 2D sneaker preview
- Instant updates as customizations change
- Zoom controls for better inspection
- Export final design as a high-quality PNG image

### 4️⃣ Design Gallery Management
- Save customized designs
- View designs in a responsive gallery
- Load and edit existing designs (Update / Overwrite)
- Delete designs
- Search & filter designs
- Lightweight infinite scroll / load-more experience

### ⭐ Bonus Feature – AI-Powered Suggestions
- Integrated Google Gemini API
- Natural language prompts for design ideas
- AI-generated customization suggestions applied instantly

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router) + TypeScript
- React
- Tailwind CSS
- Shadcn UI
- Framer Motion

**State & Data**
- Zustand (State Management)
- LocalStorage (Mock persistence)

**AI Integration**
- Google Gemini API

**Deployment**
- Vercel

**Tooling**
- Cursor (AI-assisted development)
- GitHub (Version control)

---

## 📁 Project Structure

```
app/
 ├─ login/
 ├─ signup/
 ├─ customizer/
 ├─ gallery/
 └─ api/ai-suggest/
components/
 ├─ SneakerPreview.tsx
 ├─ ColorPicker.tsx
 ├─ MaterialToggle.tsx
store/
 └─ useCustomizerStore.ts
lib/
 ├─ auth.ts
 └─ designStorage.ts
```

---

## ▶️ Run Locally

1. Clone the repository
```bash
git clone https://github.com/Shreyaschauhan/sneaker-studio-customizer
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local`
```env
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server
```bash
npm run dev
```

5. Open in browser  
👉 http://localhost:3000

---

## 🧒 Explain Like I’m 10 (50 words)

Sneaker Studio lets you design your own shoes online.  
You can change colors, materials, and add your name.  
The shoe updates instantly as you customize it.  
You can save your designs and come back to them later,  
just like creating your own sneaker collection.

---

## 📌 Notes
- The sneaker preview is a **conceptual 2D representation**.
- The focus of this project is frontend architecture, UX, and interactivity.

---

## 🙌 Acknowledgements
Built as part of a Frontend Developer Intern assignment to demonstrate modern frontend development skills, real-time UI updates, state management, and AI integration.
