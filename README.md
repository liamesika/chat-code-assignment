Chat Feature – TradeMind

מערכת צ'אט מונחית עם מנטור AI, מבוססת Firebase + Cloud Functions + OpenRouter.

✅ מה קיים בפרויקט

1. Frontend (בתוך chat.html):
תצוגת צ'אט מודרנית עם עיצוב Tailwind.
טוען מידע מהמשתמש המחובר (שם מלא, מנטור, פרופיל אישי).
שומר את ההיסטוריה של השיחה ב-Firestore.
קורא לפונקציית שרת /chat ומקבל תגובה מהבוט.
תומך בריבוי שפות: עברית/אנגלית.
שמירת השיחה ב־localStorage למקרה של רענון.
2. Scripts:
firebase-init.js – מכיל את קונפיג Firebase ל־Auth ו־Firestore.
chat-autoload.js –:
מזהה משתמש מחובר (onAuthStateChanged).
טוען פרטי פרופיל + מנטור + שיחה קודמת.
יוצר את הודעת הפתיחה לפי השפה ופרטי המשתמש.
יורה קריאה ראשונית לשרת.
3. Backend – Cloud Function:
functions/index.js:
מקבל את ההיסטוריה כ־messages.
שולח את ההיסטוריה למודל GPT (באמצעות OpenRouter).
מחזיר תשובה בצורת JSON.
תומך בשימוש ב־functions.config().openrouter.key ו־model.
4. firebase.json:
הגדרות Hosting + Functions.
מגדיר ש־index.html יעלה כברירת מחדל.

chat-feature/
│
├── chat.html                         ← עמוד הצ'אט
├── scripts/
│   ├── chat-autoload.js             ← לוגיקת התחברות והצגת שיחה
│   └── firebase-init.js             ← קונפיג Firebase
├── functions/
│   └── index.js                     ← Cloud Function שמחובר ל־GPT
├── firebase.json                    ← הגדרות Firebase Hosting + Functions
└── .firebaserc                      ← מזהה פרויקט (trade-mind-9fe52)


🚩 משימה לביצוע

🧠 לפתור את הקריאה הראשונה – שגיאת הפתיחה ב־chat-autoload.js.
📡 לוודא שכל הקריאות לפונקציה עובדות גם בפרודקשן.
🛠️ לאחד לוגיקה כפולה בין chat.html ל־chat-autoload.js.
💾 לוודא שהיסטוריית שיחה נכתבת ונשלפת מ־Firestore.
🎯 לבצע בדיקה סופית של end-to-end – מהתחברות → שיחה → שמירה → רענון.

