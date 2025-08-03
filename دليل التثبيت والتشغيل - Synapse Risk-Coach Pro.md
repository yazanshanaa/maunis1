# دليل التثبيت والتشغيل - Synapse Risk-Coach Pro

## المتطلبات الأساسية

### 1. متطلبات النظام
- **نظام التشغيل**: Ubuntu 22.04 أو أحدث (أو أي نظام Linux مشابه)
- **Python**: الإصدار 3.11 أو أحدث
- **Node.js**: الإصدار 20.18.0 أو أحدث
- **npm**: مثبت مع Node.js

### 2. مفاتيح API المطلوبة
- **OpenAI API Key**: للحصول على تحليل المشاعر الذكي
- **NewsAPI Key**: لجلب الأخبار المالية (مجاني حتى 100 طلب يومياً)

## خطوات التثبيت

### الخطوة 1: تحضير البيئة

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Python و pip
sudo apt install python3.11 python3.11-venv python3-pip -y

# تثبيت Node.js و npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### الخطوة 2: إعداد المشروع

```bash
# الانتقال إلى مجلد المشروع
cd synapse-risk-coach-pro

# إعداد البيئة الافتراضية للخادم الخلفي
cd backend/synapse-backend
python3.11 -m venv venv
source venv/bin/activate

# تثبيت متطلبات Python
pip install -r requirements.txt
```

### الخطوة 3: إعداد متغيرات البيئة

```bash
# إنشاء ملف البيئة
cd backend/synapse-backend
nano .env
```

أضف المحتوى التالي:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
NEWS_API_KEY=your_newsapi_key_here
```

### الخطوة 4: تشغيل الخادم

```bash
# من داخل مجلد backend/synapse-backend
source venv/bin/activate
python src/main.py
```

## الاختبار والتحقق

### 1. اختبار الخادم الخلفي

```bash
# اختبار API الأساسي
curl http://localhost:5002/api/users

# اختبار API الأخبار
curl "http://localhost:5002/api/news-sentiment?symbol=EURUSD"
```

### 2. الوصول للتطبيق

افتح المتصفح وانتقل إلى: `http://localhost:5002`

## استكشاف الأخطاء

### مشكلة: الخادم لا يبدأ

**الحل:**
```bash
# تحقق من أن المنفذ 5002 غير مستخدم
sudo netstat -tlnp | grep :5002

# إذا كان مستخدماً، قم بتغيير المنفذ في src/main.py
```

### مشكلة: خطأ في API Keys

**الحل:**
```bash
# تحقق من ملف .env
cat backend/synapse-backend/.env

# تأكد من صحة المفاتيح
echo $OPENAI_API_KEY
```

### مشكلة: خطأ في قاعدة البيانات

**الحل:**
```bash
# حذف قاعدة البيانات وإعادة إنشائها
rm backend/synapse-backend/src/database/app.db
python src/main.py
```

## الاستخدام اليومي

### بدء التشغيل السريع

إنشئ ملف `start.sh`:

```bash
#!/bin/bash
cd backend/synapse-backend
source venv/bin/activate
python src/main.py
```

```bash
chmod +x start.sh
./start.sh
```

### إيقاف التشغيل

```bash
# إيقاف الخادم
Ctrl + C

# أو إيقاف جميع عمليات Python
pkill -f "python src/main.py"
```

## النسخ الاحتياطي

### نسخ احتياطي للبيانات

```bash
# نسخ قاعدة البيانات
cp backend/synapse-backend/src/database/app.db backup_$(date +%Y%m%d).db

# نسخ المشروع كاملاً
tar -czf synapse_backup_$(date +%Y%m%d).tar.gz synapse-risk-coach-pro/
```

## التحديث

### تحديث التبعيات

```bash
# تحديث Python packages
cd backend/synapse-backend
source venv/bin/activate
pip install --upgrade -r requirements.txt

# تحديث Node.js packages (إذا لزم الأمر)
cd ../../frontend
npm update
```

## الأمان

### حماية مفاتيح API

```bash
# تأكد من أن ملف .env محمي
chmod 600 backend/synapse-backend/.env

# لا تشارك ملف .env مع أحد
echo ".env" >> .gitignore
```

### تحديثات الأمان

```bash
# تحديث النظام بانتظام
sudo apt update && sudo apt upgrade -y

# مراقبة التحديثات الأمنية للتبعيات
pip list --outdated
npm audit
```

## الدعم الفني

في حالة مواجهة مشاكل:

1. تحقق من ملفات السجل (logs)
2. تأكد من صحة متغيرات البيئة
3. اختبر الاتصال بالإنترنت
4. تحقق من صحة مفاتيح API

## ملاحظات مهمة

- **لا تشارك مفاتيح API** مع أحد
- **قم بعمل نسخ احتياطية منتظمة** لقاعدة البيانات
- **راقب استخدام API** لتجنب تجاوز الحدود المجانية
- **اختبر التطبيق** بانتظام للتأكد من عمله بشكل صحيح

