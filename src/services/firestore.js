// src/services/firestore.js
import { db } from "../firebase"; // ⚠️ Ensure this path points to your actual firebase.js file
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/**
 * Create a new empty resume doc in the "resumes" collection
 * and attach the user's ID to it.
 */
export const createResume = async (uid) => {
  try {
    const resumesRef = collection(db, "resumes");

    const docRef = await addDoc(resumesRef, {
      userId: uid, // Ties this document to the specific user
      title: "Untitled Resume",
      template: "modern1", // default template
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Created resume doc:", docRef.id);
    return docRef.id; // use this as resumeId in routes
  } catch (err) {
    console.error("🔥 Firestore createResume error:", err);
    throw err;
  }
};

/**
 * Save / update resume data
 */
export const saveResumeData = async (uid, resumeId, data) => {
  try {
    const resumeRef = doc(db, "resumes", resumeId);

    const payload = {
      ...data,
      userId: uid, // Reinforce ownership
      updatedAt: serverTimestamp(),
    };

    console.log("📝 Firestore saveResumeData payload:", {
      path: `resumes/${resumeId}`,
      payload,
    });

    // merge: true ensures we don't overwrite fields that aren't passed in
    await setDoc(resumeRef, payload, { merge: true });

    console.log("✅ Firestore saveResumeData success");
    return { ok: true };
  } catch (err) {
    console.error("🔥 Firestore saveResumeData error:", err);
    return { ok: false, error: err };
  }
};

/**
 * Get a single resume
 */
export const getResumeData = async (uid, resumeId) => {
  try {
    const resumeRef = doc(db, "resumes", resumeId);
    const snap = await getDoc(resumeRef);

    if (!snap.exists()) {
      console.log("ℹ️ getResumeData: no document for resumes/", resumeId);
      return null;
    }

    const data = snap.data();
    
    // Security check: ensure the user fetching it actually owns it
    if (data.userId !== uid) {
      console.warn("⚠️ Unauthorized access attempt or missing userId on doc");
      return null; 
    }

    console.log("📄 getResumeData:", data);
    return data;
  } catch (err) {
    console.error("🔥 Firestore getResumeData error:", err);
    throw err;
  }
};

/**
 * List all resumes for this user (newest first)
 */
export const getResumes = async (uid) => {
  try {
    const resumesRef = collection(db, "resumes");

    // Filter by the user's ID, then sort by newest updated
    const q = query(
      resumesRef, 
      where("userId", "==", uid),
      orderBy("updatedAt", "desc")
    );

    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    console.log("📚 getResumes list:", list);
    return list;
  } catch (err) {
    console.error("🔥 Firestore getResumes error:", err);
    throw err;
  }
};