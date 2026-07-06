export const mockStudyData = {
  questions: [
    { type: 'MCQ', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], answer: 'Mitochondria', explanation: 'Mitochondria generate most of the chemical energy needed to power the cell\'s biochemical reactions.', difficulty: 'Easy' },
    { type: 'True/False', question: 'Photosynthesis occurs in mitochondria.', answer: 'False', explanation: 'Photosynthesis occurs in chloroplasts.', difficulty: 'Easy' },
    { type: 'Short Answer', question: 'Explain the function of ribosomes.', answer: 'Ribosomes are responsible for protein synthesis.', difficulty: 'Medium' }
  ],
  summary: {
    oneLine: 'Cells are the fundamental unit of life, consisting of various organelles with specific functions.',
    bulletPoints: [
      'The cell is the basic structural and functional unit of all living organisms.',
      'Eukaryotic cells contain membrane-bound organelles like the nucleus and mitochondria.',
      'Mitochondria produce energy through cellular respiration.'
    ],
    detailed: 'The cell is the basic structural, functional, and biological unit of all known organisms. A cell is the smallest unit of life. Cells are often called the "building blocks of life". The study of cells is called cell biology, cellular biology, or cytology. Cells consist of cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids.'
  },
  vocabulary: [
    { word: 'Mitochondria', meaning: 'An organelle found in large numbers in most cells, in which the biochemical processes of respiration and energy production occur.', hinglish: 'Cell ka power house jo energy banata hai.', synonym: 'Powerhouse', antonym: 'N/A', pos: 'Noun', example: 'Mitochondria are abundant in muscle cells.' },
    { word: 'Organelle', meaning: 'Any of a number of organized or specialized structures within a living cell.', hinglish: 'Cell ke andar ke chote ang.', synonym: 'Structure', antonym: 'N/A', pos: 'Noun', example: 'The nucleus is the largest organelle in the cell.' }
  ],
  keyPoints: {
    concepts: ['Cellular Respiration', 'Protein Synthesis'],
    definitions: ['Cell: The fundamental unit of life.', 'Organelle: Specialized structure within a cell.'],
    facts: ['Adult humans consist of an estimated 30 trillion cells.']
  },
  keywords: [
    { keyword: 'Cell', meaning: 'Basic unit of life', hinglish: 'Jeevan ki ikai', synonym: 'Unit', antonym: 'N/A', importance: 'High' },
    { keyword: 'Nucleus', meaning: 'Control center of the cell', hinglish: 'Cell ka dimag', synonym: 'Core', antonym: 'N/A', importance: 'High' }
  ]
};
