import api from './axiosConfig';

export const submitAssessment = async (answers, assessmentNumber) => {
  try {
    // First check if assessment is already completed
    const checkResponse = await api.get(`/assessments/check/${assessmentNumber}`);
    if (checkResponse.data.completed) {
      throw new Error('Assessment already completed');
    }

    // First create a new assessment
    const startResponse = await api.post('/assessments/start', {
      assessmentNumber
    });

    // Then submit the answers
    const submitResponse = await api.post(
      `/assessments/${startResponse.data.assessment._id}/submit`,
      {
        answers: formatAnswers(answers),
        concerns: '' // Add concerns field if needed
      }
    );

    return submitResponse.data;
  } catch (error) {
    if (error.response?.data?.completed) {
      throw new Error('Assessment already completed');
    }
    throw error.response?.data || { message: 'Error submitting assessment' };
  }
};

export const checkAssessmentStatus = async (assessmentNumber) => {
  try {
    const response = await api.get(`/assessments/check/${assessmentNumber}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error checking assessment status' };
  }
};

// Helper function to format answers for the API
const formatAnswers = (answers) => {
  return Object.entries(answers).map(([questionId, answer]) => {
    // Determine category based on question ID
    let category = 'Gross Motor';
    if (questionId.includes('fineMotor')) category = 'Fine Motor';
    if (questionId.includes('language')) category = 'Language/Communication';
    if (questionId.includes('cognitive')) category = 'Cognitive';
    if (questionId.includes('socialEmotional')) category = 'Social/Emotional';

    return {
      questionId,
      answer,
      category
    };
  });
};
