// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;
// const API_KEY = process.env.FIREBASE_API_KEY;

// /* =========================
//    🔹 SIGNUP (NO VERIFICATION)
// ========================= */
// app.post("/signup", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const response = await axios.post(
//       `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
//       {
//         email,
//         password,
//         returnSecureToken: true,
//       }
//     );

//     res.json({
//       message: "User created successfully",
//       idToken: response.data.idToken,
//     });

//   } catch (err) {
//     res.status(400).json({
//       error: err.response?.data?.error?.message || "Signup failed",
//     });
//   }
// });

// /* =========================
//    🔹 LOGIN (NO EMAIL CHECK)
// ========================= */
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const response = await axios.post(
//       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
//       {
//         email,
//         password,
//         returnSecureToken: true,
//       }
//     );

//     res.json({
//       message: "Login successful",
//       idToken: response.data.idToken,
//     });

//   } catch (err) {
//     res.status(400).json({
//       error: err.response?.data?.error?.message || "Invalid email or password",
//     });
//   }
// });

// /* ========================= */
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.FIREBASE_API_KEY;

// 🔥 Firebase Admin Init
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/* =========================
   🔹 SAVE USER IN FIRESTORE
========================= */
const saveUser = async (uid, email) => {
    const userRef = db.collection("users").doc(uid);

    const doc = await userRef.get();

    if (!doc.exists) {
        await userRef.set({
            email,
            createdAt: new Date()
        });
    }
};

/* =========================
   🔹 SIGNUP
========================= */
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        const { idToken, localId } = response.data;

        // ✅ Save user in Firestore
        await saveUser(localId, email);

        res.json({
            message: "User created successfully",
            idToken,
        });

    } catch (err) {
        console.error("Firebase signup error:", err.response?.data);
        return res.status(400).json({
            error: err.response?.data?.error?.message || "Signup failed",
        });
    }
});

/* =========================
   🔹 LOGIN
========================= */
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        const { idToken, localId } = response.data;

        // ✅ Ensure user exists in Firestore
        await saveUser(localId, email);

        res.json({
            message: "Login successful",
            idToken,
        });

    } catch (err) {
        res.status(400).json({
            error: err.response?.data?.error?.message || "Invalid email or password",
        });
    }
});

/* =========================
   🔐 AUTH MIDDLEWARE
========================= */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ error: "No token" });

        const decoded = await admin.auth().verifyIdToken(token);

        req.userId = decoded.uid;

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

/* =========================
   🔹 ADD EXPENSE
========================= */
app.post("/add-expenses", authMiddleware, async (req, res) => {
    try {
        const expense = {
            ...req.body,
            userId: req.userId,
            createdAt: new Date()
        };

        const docRef = await db.collection("expenses").add(expense);

        res.json({
            id: docRef.id,
            ...expense
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* =========================
   🔹 GET EXPENSES
========================= */
app.get("/get-expenses", authMiddleware, async (req, res) => {
    try {
        const snapshot = await db
            .collection("expenses")
            .where("userId", "==", req.userId)
            .get();

        const expenses = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(expenses);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/analytics/category", authMiddleware, async (req, res) => {
    try {
        const snapshot = await db
            .collection("expenses")
            .where("userId", "==", req.userId)
            .get();

        const data = {};

        snapshot.forEach(doc => {
            const exp = doc.data();
            const category = exp.category || "Other";

            data[category] = (data[category] || 0) + Number(exp.amount);
        });

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/analytics/monthly", authMiddleware, async (req, res) => {
    try {
        const snapshot = await db
            .collection("expenses")
            .where("userId", "==", req.userId)
            .get();

        const data = {};

        snapshot.forEach(doc => {
            const exp = doc.data();
            const month = new Date(exp.date).toLocaleString("default", { month: "short" });

            data[month] = (data[month] || 0) + Number(exp.amount);
        });

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/analytics/vendors", authMiddleware, async (req, res) => {
    try {
        const snapshot = await db
            .collection("expenses")
            .where("userId", "==", req.userId)
            .get();

        const data = {};

        snapshot.forEach(doc => {
            const exp = doc.data();
            const vendor = exp.title || "Unknown";

            data[vendor] = (data[vendor] || 0) + Number(exp.amount);
        });

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 GET USER PROFILE
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    res.json({
      name: userData.name || "User",
      email: userData.email
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* ========================= */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});