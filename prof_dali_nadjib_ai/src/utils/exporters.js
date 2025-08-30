// src/utils/exporters.js
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// حفظ المحتوى كـ Word (DOCX)
export async function saveAsDocx(title, htmlContent) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(title),
              new TextRun('\n')
            ]
          }),
          new Paragraph(htmlContent)
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title}.docx`);
}

// حفظ المحتوى كـ PDF
export function saveAsPdf(domNode, filename) {
  const opt = {
    margin: 0.5,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {},
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  // html2pdf موجود في الباندل الأمامي
  // eslint-disable-next-line no-undef
  html2pdf().from(domNode).set(opt).save();
}
