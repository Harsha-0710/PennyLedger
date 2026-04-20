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

/* =========================
   🔥 FIREBASE ADMIN (RENDER SAFE)
========================= */
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

/* =========================
   🔹 SAVE USER
========================= */
const saveUser = async (uid, email) => {
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      email,
      name: "User",
      createdAt: new Date(),
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
      { email, password, returnSecureToken: true }
    );

    const { idToken, localId } = response.data;

    await saveUser(localId, email);

    res.json({ message: "User created", idToken });

  } catch (err) {
    res.status(400).json({
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
      { email, password, returnSecureToken: true }
    );

    const { idToken, localId } = response.data;

    await saveUser(localId, email);

    res.json({ message: "Login success", idToken });

  } catch (err) {
    res.status(400).json({
      error: err.response?.data?.error?.message || "Invalid credentials",
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
    res.status(401).json({ error: "Unauthorized" });
  }
};

/* =========================
   💸 ADD EXPENSE
========================= */
app.post("/add-expenses", authMiddleware, async (req, res) => {
  try {
    const expense = {
      ...req.body,
      userId: req.userId,
      createdAt: new Date(),
    };

    const doc = await db.collection("expenses").add(expense);

    res.json({ id: doc.id, ...expense });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📊 GET EXPENSES
========================= */
app.get("/get-expenses", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db
      .collection("expenses")
      .where("userId", "==", req.userId)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📊 ANALYTICS
========================= */
app.get("/analytics/category", authMiddleware, async (req, res) => {
  const snapshot = await db.collection("expenses").where("userId","==",req.userId).get();
  const data = {};

  snapshot.forEach(doc => {
    const e = doc.data();
    data[e.category] = (data[e.category] || 0) + Number(e.amount);
  });

  res.json(data);
});

app.get("/analytics/monthly", authMiddleware, async (req, res) => {
  const snapshot = await db.collection("expenses").where("userId","==",req.userId).get();
  const data = {};

  snapshot.forEach(doc => {
    const e = doc.data();
    const month = new Date(e.date).toLocaleString("default",{month:"short"});
    data[month] = (data[month] || 0) + Number(e.amount);
  });

  res.json(data);
});

app.get("/analytics/vendors", authMiddleware, async (req, res) => {
  const snapshot = await db.collection("expenses").where("userId","==",req.userId).get();
  const data = {};

  snapshot.forEach(doc => {
    const e = doc.data();
    data[e.title] = (data[e.title] || 0) + Number(e.amount);
  });

  res.json(data);
});

/* =========================
   👤 PROFILE
========================= */
app.get("/profile", authMiddleware, async (req, res) => {
  const userDoc = await db.collection("users").doc(req.userId).get();

  if (!userDoc.exists) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = userDoc.data();

  res.json({
    name: user.name || "User",
    email: user.email,
  });
});

/* ========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});