## Project: Synapse Risk-Coach Pro

### Phase 1: قراءة وتحليل متطلبات المشروع
- [x] قراءة ملف المتطلبات `pasted_content.txt`.
- [x] تحليل وفهم المكونات الرئيسية والمتطلبات التقنية.

### Phase 2: تصميم هيكل المشروع والتخطيط التقني
- [ ] تحديد هيكل مجلدات المشروع.
- [ ] تحديد التقنيات والأدوات المستخدمة (React, TypeScript, Tailwind, Java, NewsAPI, OpenAI).
- [ ] تصميم قاعدة البيانات (IndexedDB for frontend).
- [ ] تصميم API للواجهة الخلفية (Cloud Function).

### Phase 3: إعداد البيئة وتهيئة المشروع
- [x] تهيئة بيئة تطوير React/TypeScript.
- [x] تهيئة بيئة تطوير Java.
- [x] إعداد Tailwind CSS.
- [x] إعداد i18n.

### Phase 4: تطوير الواجهة الخلفية (Backend)
- [x] إنشاء Cloud Function لجلب الأخبار من NewsAPI.org.
- [x] دمج OpenAI/DeepSeek لتحليل المشاعر.
- [x] اختبار الواجهة الخلفية.

### Phase 5: تطوير الواجهة الأمامية (Frontend)
- [x] تطوير مكون Risk-Meter.
- [x] تطوير مكون Smart Journal (نافذة العلامات، تخزين IndexedDB، الرسوم البيانية).
- [x] تطوير مكون Market-Pulse Mini.
- [x] تطوير وظيفة Share-My-Stats (HTML2Canvas، Blob، Share).
- [x] تنفيذ PWA ووضع عدم الاتصال (SW Offline Mode).
- [x] تحسين الأداء واختبار الجوال (Bundle < 250 KB, Time-to-Interactive < 1 s).
- [x] تطبيق جودة UI & UX (Dark/Light theme, consistent fonts, aria-labels).

### Phase 6: اختبار المشروع محلياً
- [x] اختبار التكامل بين الواجهة الأمامية والخلفية.
- [x] اختبار جميع الميزات.
- [x] اختبار الأداء.

### Phase 7: نشر المشروع وتسليم النتائج
- [x] نشر الواجهة الخلفية (Cloud Function).
- [x] نشر الواجهة الأمامية (PWA).
- [x] تقديم المشروع.


- [x] تحديد هيكل مجلدات المشروع.
  - `synapse-risk-coach-pro/`
    - `frontend/` (React, TypeScript, Tailwind, PWA)
      - `public/`
      - `src/`
        - `components/` (RiskMeter, SmartJournal, MarketPulseMini, ShareMyStats)
        - `hooks/`
        - `utils/`
        - `services/` (IndexedDB, cTrader SDK interaction)
        - `styles/`
        - `i18n/`
        - `App.tsx`
        - `index.tsx`
    - `backend/` (Cloud Function for NewsAPI and OpenAI/DeepSeek)
      - `src/`
      - `package.json` (for Node.js cloud function)
      - `server.js` (or similar for cloud function entry point)
    - `docs/` (for design documents, API specs)
    - `README.md`
    - `package.json` (for overall project scripts if needed)



- [x] تحديد التقنيات والأدوات المستخدمة (React, TypeScript, Tailwind, Java, NewsAPI, OpenAI).
  - **Frontend**: React, TypeScript, Tailwind CSS, IndexedDB, HTML2Canvas, navigator.share API, PWA (Service Worker).
  - **Backend**: Node.js (for Cloud Function), NewsAPI.org, OpenAI/DeepSeek (for sentiment analysis).
  - **Deployment**: cTrader WebView Frame, Cloud Function deployment.
- [x] تصميم قاعدة البيانات (IndexedDB for frontend).
  - **IndexedDB Schema for Smart Journal**: Store trade sentiment tags, trade results, and related statistics. Key-value store with object stores for `trades` (id, symbol, sentiment, result, timestamp) and `statistics` (date, aggregated_sentiment, performance_metrics).
- [x] تصميم API للواجهة الخلفية (Cloud Function).
  - **Endpoint**: `/api/news-sentiment`
  - **Method**: `GET`
  - **Parameters**: `symbol` (e.g., 


  - **Parameters**: `symbol` (e.g., 'EURUSD'), `count` (number of news articles to fetch, default 1).
  - **Response**: JSON object containing `title` (news headline) and `sentiment` (positive/negative/neutral).
- [x] تصميم API للواجهة الخلفية (Cloud Function).
  - **Endpoint**: `/api/summarize-week`
  - **Method**: `POST`
  - **Parameters**: `trade_data` (JSON array of trade details for the week).
  - **Response**: JSON object containing `summary` (AI-generated summary of the trading week).


