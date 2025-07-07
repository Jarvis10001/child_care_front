// Collection of all assessment question components

// Age 0-3 months to 54-57 months (19 assessments in total)
export { default as Q1 } from './Q1';  // 0-3 months
export { default as Q2 } from './Q2';  // 3-6 months
export { default as Q3 } from './Q3';  // 6-9 months
export { default as Q4 } from './Q4';  // 9-12 months
export { default as Q5 } from './Q5';  // 12-15 months
export { default as Q6 } from './Q6';  // 15-18 months
export { default as Q7 } from './Q7';  // 18-21 months
export { default as Q8 } from './Q8';  // 21-24 months
export { default as Q9 } from './Q9';  // 24-27 months
export { default as Q10 } from './Q10'; // 27-30 months
export { default as Q11 } from './Q11'; // 30-33 months
export { default as Q12 } from './Q12'; // 33-36 months
export { default as Q13 } from './Q13'; // 36-39 months
export { default as Q14 } from './Q14'; // 39-42 months
export { default as Q15 } from './Q15'; // 42-45 months
export { default as Q16 } from './Q16'; // 45-48 months
export { default as Q17 } from './Q17'; // 48-51 months
export { default as Q18 } from './Q18'; // 51-54 months
export { default as Q19 } from './Q19'; // 54-57 months

// Helper function to get question component by age in months
export const getQuestionComponentByAge = (ageInMonths) => {
  const questionNumber = Math.ceil(ageInMonths / 3);
  const components = {
    1: Q1, 2: Q2, 3: Q3, 4: Q4, 5: Q5,
    6: Q6, 7: Q7, 8: Q8, 9: Q9, 10: Q10,
    11: Q11, 12: Q12, 13: Q13, 14: Q14, 15: Q15,
    16: Q16, 17: Q17, 18: Q18, 19: Q19
  };
  return components[questionNumber] || null;
};

// Get age range for a specific question number
export const getAgeRange = (questionNumber) => {
  const startMonth = (questionNumber - 1) * 3;
  const endMonth = questionNumber * 3;
  return `${startMonth}-${endMonth} months`;
};

// Get total number of available assessments
export const TOTAL_ASSESSMENTS = 19;

// Assessment metadata
export const assessmentMetadata = {
  categories: [
    'Gross Motor',
    'Fine Motor',
    'Language/Communication',
    'Cognitive',
    'Social/Emotional'
  ],
  ageRanges: Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    range: getAgeRange(i + 1)
  }))
};
