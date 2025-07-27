import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { firebaseConfig } from "./firebase-init.js";

console.log("✅ [0] Chat Autoload Loaded - גרסה יולי 28");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("✅ [1] Firebase Auth & Firestore מאותחלים");

export async function initChatAutoload(chatbox, appendMessage) {
  console.log("✅ [2] initChatAutoload הופעלה");

  onAuthStateChanged(auth, async (user) => {
    console.log("✅ [3] onAuthStateChanged הופעל");

    if (!user) {
      console.warn("⛔ [4] אין משתמש מחובר");
      alert("⛔ אין משתמש מחובר – הפנייה להתחברות");
      window.location.href = "login.html";
      return;
    }

    const userId = user.uid;
    console.log("✅ [5] משתמש מחובר:", userId);

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        console.warn("⚠️ [6] משתמש לא קיים במסד");
        return;
      }

      const data = userSnap.data();
      const fullName = data.fullName || "משתמש";
      localStorage.setItem("userName", fullName);
      const greetingEl = document.getElementById("user-name");
      if (greetingEl) greetingEl.textContent = `שלום, ${fullName}`;

      const mentorName = data.mentorName || "המנטור שלך";
      const mentorImg = data.mentorImg || "image/robot.png";
      // ✂️ בינתיים קבועים
      //const mentorName = "אלכס המנטור שלך";
      //const mentorImg = "image/ai-man.png";

      localStorage.setItem("mentorName", mentorName);
      localStorage.setItem("mentorImg", mentorImg);
      const mentorNameEl = document.getElementById("mentor-name");
      const mentorImgEl = document.getElementById("mentor-img");
      if (mentorNameEl) mentorNameEl.textContent = mentorName;
      if (mentorImgEl) mentorImgEl.src = mentorImg;

      const profile = data.profile || {};
      localStorage.setItem("userProfile", JSON.stringify(profile));

      // ✅ שליפת היסטוריית שיחה מה־Firestore
      const chatRef = doc(db, "users", userId, "chatHistory", "current");
      let chatHistory = [];
      try {
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
          chatHistory = chatSnap.data().messages || [];
          console.log("💬 נטענה היסטוריית שיחה:", chatHistory);
          // הצגה ראשונית של השיחה בצ'אט
          chatHistory.forEach(msg => {
            const label = msg.role === "user" ? "🟢 אתה" : "🤖 " + mentorName;
            appendMessage(label, msg.content, msg.role === "user" ? "user" : "bot");
          });
        } else {
          console.log("ℹ️ אין שיחה קודמת");
        }
      } catch (err) {
        console.warn("⚠️ שגיאה בשליפת chatHistory:", err);
      }

      // הודעת פתיחה לפי שפה
      const lang = localStorage.getItem("lang") || "he";
      const intro =
        lang === "he"
          ? `👋 ברוך הבא לצ'אט עם ${mentorName}, המנטור שלך.`
          : `👋 Welcome to your trading chat with ${mentorName}, your mentor.`;

      const contextMessage = `
      המשתמש שלך הוא ${profile.q1 || "משתמש אנונימי"}.
      הוא סוחר בתדירות של: ${profile.q2 || "לא ידוע"}.
      התחום שבו הוא הכי חזק הוא: ${profile.q3 || "לא צוין"}.
      היעד הגדול שלו לשנה הקרובה הוא: ${profile.q4 || "לא ידוע"}.
      הוא מעדיף לקבל תובנות בצורה של: ${profile.q5 || "לא נבחר"}.

      בהתאם לפרטים הללו, אתה מנטור אישי למסחר.
      ענה לו בהתאם לאופי שלו, תן לו תובנות חכמות והצעות רלוונטיות אישית.
      `;

      // ✅ אם אין שיחה בכלל – שולחים intro כפתיחה
      if (chatHistory.length === 0) {
        chatHistory.push({ role: "system", content: contextMessage });
        chatHistory.push({ role: "user", content: intro });

        const FIREBASE_FUNCTION_URL = "https://us-central1-trade-mind-9fe52.cloudfunctions.net/api"; // <- עדכני לפי שלך

        const res = await fetch(FIREBASE_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatHistory }),
        });


        const resData = await res.json();
        if (!resData.reply) {
          appendMessage("🤖 " + mentorName, "⚠️ שגיאה: לא התקבלה תשובה מהשרת", "bot");
          return;
        }

        const botReply = resData.reply;
        chatHistory.push({ role: "assistant", content: botReply });
        appendMessage("🤖 " + mentorName, botReply, "bot");

        await setDoc(chatRef, { messages: chatHistory });
        console.log("💾 שיחה נשמרה");
      }

      // 🟢 שמירה ל-localStorage למקרה של רענון
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

      // 🟡 תשמרי את `chatRef` ו־`chatHistory` גם ל-use בתוך `chat.html`
      window.chatHistory = chatHistory;
      window.chatRef = chatRef;

    } catch (err) {
      console.error("❌ שגיאה בשליפה או שליחה:", err);
      alert("שגיאה בטעינת נתוני המשתמש");
    }
  });
}
