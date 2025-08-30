// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { saveAsDocx, saveAsPdf } from './utils/exporters';

export default function App() {
  const [stage, setStage] = useState('الابتدائي');
  const [subject, setSubject] = useState('الرياضيات');
  const [grade, setGrade] = useState('4');
  const [lang, setLang] = useState('ar');
  const [type, setType] = useState('مذكرة');
  const [title, setTitle] = useState('مذكرة جديدة');
  const [loading, setLoading] = useState(false);
  const [outputHtml, setOutputHtml] = useState('');

  const generate = async () => {
    setLoading(true);
    try {
      const payload = { stage, subject, grade, lang, type, title, curriculum: 'algeria' };
      const res = await axios.post('/api/generate', payload);
      setOutputHtml(res.data.html || res.data.text || 'لا يوجد ناتج');
    } catch (e) {
      console.error(e);
      setOutputHtml('حدث خطأ: ' + (e.response?.data?.error || e.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl mb-4">prof_dali nadjib AI — منشئ مذكرات</h1>

        <div className="grid grid-cols-2 gap-3">
          <label>الطور
            <select value={stage} onChange={e=>setStage(e.target.value)} className="w-full p-2 border rounded mt-1">
              <option>الابتدائي</option>
              <option>المتوسط</option>
              <option>الثانوي</option>
            </select>
          </label>

          <label>المادة
            <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full p-2 border rounded mt-1">
              <option>الرياضيات</option>
              <option>اللغة العربية</option>
              <option>اللغة الفرنسية</option>
              <option>العلوم</option>
            </select>
          </label>

          <label>المستوى
            <select value={grade} onChange={e=>setGrade(e.target.value)} className="w-full p-2 border rounded mt-1">
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>

          <label>اللغة
            <select value={lang} onChange={e=>setLang(e.target.value)} className="w-full p-2 border rounded mt-1">
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>

          <label>نوع المحتوى
            <select value={type} onChange={e=>setType(e.target.value)} className="w-full p-2 border rounded mt-1">
              <option>مذكرة</option>
              <option>فرض</option>
              <option>اختبار</option>
            </select>
          </label>

          <label>العنوان
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 border rounded mt-1" />
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={generate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading? 'جارٍ...': 'إنشاء'}
          </button>
          <button onClick={()=>{ if(!outputHtml) return alert('لا يوجد محتوى'); saveAsDocx(title, outputHtml); }} className="px-4 py-2 bg-green-600 text-white rounded">
            حفظ كـ Word
          </button>
          <button onClick={()=>{ const el = document.getElementById('output'); if(!el) return alert('لا يوجد محتوى'); saveAsPdf(el, `${title}.pdf`); }} className="px-4 py-2 bg-gray-700 text-white rounded">
            حفظ كـ PDF
          </button>
        </div>

        <div id="output" className="mt-6 p-4 border rounded min-h-[200px]" 
             dangerouslySetInnerHTML={{__html: outputHtml}} />
      </div>
    </div>
  );
}
