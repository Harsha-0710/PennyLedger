# 💰 PennyLedger

PennyLedger is a full-stack expense tracking application that allows users to record, manage, and analyze their expenses with a clean UI and simple analytics.

---

## 🚀 Features

- Add and manage expenses
- Filter and sort expenses
- View total spending
- Analytics with charts (category, monthly, vendors)
- Secure authentication using Firebase (via backend)
- Profile and logout functionality

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), Recharts, React Router
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication (handled via backend)

---

## 🔑 Demo Login (For Testing)

You can use the following demo account to explore the application:

- **Email:** test123@gmail.com  
- **Password:** 12341234  

⚠️ Note:
- This account is for testing purposes only  
- Do not store personal or sensitive data  
- Credentials may be reset anytime  

---

## 🧠 Key Design Decisions

- **Backend-controlled authentication**  
  Authentication is handled through backend APIs using Firebase instead of directly in the frontend. This keeps credentials secure and allows better control over user validation.

- **Simple state management**  
  Used React hooks (`useState`, `useEffect`) to keep the application lightweight and easy to maintain.

- **Clear separation of concerns**  
  Components are organized into pages, hooks, and styles for better readability and scalability.

- **User-based data isolation**  
  Each user’s expenses are stored separately in Firestore using `userId`.

- **Lightweight analytics implementation**  
  Charts are implemented using Recharts with backend aggregation to keep frontend logic simple.

---

## ⚖️ Trade-offs (Due to Time Constraints)

- No pagination (all expenses are fetched at once)
- Basic validation only
- Limited error handling UI (toast-based)
- No token refresh handling
- Simplified analytics (no deep insights)

---

## 🚫 What Was Intentionally Not Done

- Edit/Delete expense functionality
- Advanced analytics (AI insights, forecasting)
- Global loading system (used simple local loading instead)
- Complex UI features (themes, heavy animations)
- Offline support or caching

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Harsha-0710/PennyLedger.git
cd PennyLedger
