import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Setup pdf worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const extractTextFromFile = async (file: File): Promise<string> => {
  const type = file.type;

  if (type === 'application/pdf') {
    return await extractTextFromPDF(file);
  } else if (type.startsWith('image/')) {
    return await extractTextFromImage(file);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or Image.');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    // We limit to first 15 pages to prevent massive payloads crashing the AI or taking too long
    const numPages = Math.min(pdf.numPages, 15);

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      fullText += strings.join(' ') + '\n';
    }

    if (!fullText.trim()) {
      throw new Error("Could not extract any text from this PDF. It might be a scanned image.");
    }
    
    return fullText;
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    throw new Error("Failed to read PDF file.");
  }
};

const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    const result = await Tesseract.recognize(
      file,
      'eng',
      { logger: m => console.log(m) } // Optional: could hook up to UI progress
    );
    
    const text = result.data.text;
    if (!text.trim()) {
      throw new Error("Could not extract any text from this Image.");
    }
    
    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from Image.");
  }
};
