# Coach AbdelNasser — Unified Platform

نسخة موحدة تجمع التصميم الكبير `css/index.css` مع صفحات الطالب والإدارة وFirebase.

## الهيكل
- `index.html` الصفحة العامة
- `login.html` دخول الطلاب/الإدارة
- `register.html` تسجيل طالب
- `student.html` لوحة الطالب
- `quiz.html` محرك الاختبار
- `admin-login.html` دخول الإدارة
- `admin.html` لوحة الإدارة
- `css/index.css` ملف التصميم الرئيسي الكبير
- `js/` منطق الصفحات
- `functions/` Cloud Functions لتسجيل دخول الطالب وإشعارات Telegram
- `database.rules.json` قواعد Firebase Realtime Database

## مهم قبل النشر
1. استبدل `assets/1783950091830.jpg` بالصورة الحقيقية بنفس الاسم. الملف الموجود داخل الحزمة قد يكون مجرد placeholder.
2. فعّل Email/Password في Firebase Authentication.
3. أنشئ حسابي الإدارة في Firebase Authentication. لا تضع كلمات المرور داخل GitHub.
4. أضف UID لكل حساب في `/adminUsers/{uid}/role` بقيمة `primary` أو `backup`.
5. ضع Telegram Bot Token وChat ID كـFirebase Functions secrets باسم `TELEGRAM_BOT_TOKEN` و`TELEGRAM_CHAT_ID`.
6. انشر Realtime Database Rules الموجودة في `database.rules.json`.
7. انشر Functions ثم Hosting.

## صلاحيات الإدارة
- Primary Admin: الطلاب + المحتوى + الاختبارات + النتائج + الإشعارات + الإعدادات.
- Backup Admin: المحتوى والاختبارات فقط. لا يستطيع قراءة الطلاب أو النتائج أو تعديل إعدادات الإدارة من خلال Rules.

## ملاحظة عن البيانات القديمة
المنصة تحافظ على أسماء العقد القديمة مثل `students`, `notifications`, `quiz_results`, `quizzes`, `stats`, `content_views` حيث أمكن، لكن تسجيل دخول الطالب في النسخة الآمنة الجديدة يستخدم Cloud Function + Firebase Custom Token حتى لا يحتاج المتصفح إلى قراءة كل الطلاب. السجلات القديمة التي لا تحمل نفس بنية الهوية يمكن إبقاؤها حتى تتم مراجعتها/ترحيلها.
