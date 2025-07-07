import React, { useState } from 'react';

const Questions = () => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Physical Development */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Physical Development</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Gross Motor Skills</h3>
          
          {['sit_support', 'crawl_walk', 'climb_stairs', 'throw_ball'].map((name, index) => (
            <div key={name} className="space-y-2">
              <label className="block text-gray-700">
                {index === 0 && "Can the child sit without support?"}
                {index === 1 && "Can the child crawl, walk, or run appropriately for their age?"}
                {index === 2 && "Does the child have difficulty climbing stairs or maintaining balance while walking?"}
                {index === 3 && "Can the child throw a ball or kick it towards a target?"}
              </label>
              <select 
                name={name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="sometimes">Sometimes</option>
              </select>
            </div>
          ))}
        </div>

        {/* Fine Motor Skills */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Fine Motor Skills</h3>
          
          {['pincer_grasp', 'stack_blocks', 'hold_crayon'].map((name, index) => (
            <div key={name} className="space-y-2">
              <label className="block text-gray-700">
                {index === 0 && "Can the child pick up small objects using their thumb and fingers?"}
                {index === 1 && "Is the child able to stack blocks or complete simple puzzles?"}
                {index === 2 && "Can the child hold a crayon, pencil, or marker and attempt to draw?"}
              </label>
              <select 
                name={name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an answer</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="sometimes">Sometimes</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* Hearing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Hearing</h2>
        
        {['respond_name', 'follow_instructions', 'react_sounds'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Does the child respond when called by name or to familiar sounds?"}
              {index === 1 && "Does the child follow simple verbal instructions?"}
              {index === 2 && "Does the child react to soft sounds or whispers?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Vision */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Vision</h2>
        
        {['track_object', 'eye_contact', 'distinguish_objects'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Can the child track a moving object?"}
              {index === 1 && "Does the child make eye contact with caregivers or others during interaction?"}
              {index === 2 && "Can the child distinguish between objects of varying sizes, colors, or shapes?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Communication and Language */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Communication and Language</h2>
        
        {['babble', 'two_word_sentences', 'use_pronouns', 'express_needs'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Does the child attempt to babble, coo, or make sounds by 12 months?"}
              {index === 1 && "By age 2, can the child form simple two-word sentences?"}
              {index === 2 && "By age 3, can the child understand and use basic pronouns?"}
              {index === 3 && "Does the child have difficulty expressing their needs using gestures, words, or phrases?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Cognitive Development */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Cognitive Development</h2>
        
        {['explore_toys', 'recognize_people', 'pretend_play', 'solve_problems'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Does the child explore toys and objects in their surroundings?"}
              {index === 1 && "Can the child recognize and name familiar people, animals, or objects?"}
              {index === 2 && "By age 2-3, does the child show interest in simple pretend play?"}
              {index === 3 && "Can the child solve basic problems, such as retrieving a toy from under furniture?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Social and Emotional Development */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Social and Emotional Development</h2>
        
        {['smile_response', 'show_attachment', 'play_with_others', 'share_toys'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Does the child smile in response to social interaction by 6 months?"}
              {index === 1 && "By age 1, does the child show attachment to primary caregivers?"}
              {index === 2 && "By age 2, can the child show interest in playing with other children or imitate their actions?"}
              {index === 3 && "By age 3-4, does the child share toys or take turns when playing?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Adaptive/Self-Help Skills */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Adaptive/Self-Help Skills</h2>
        
        {['feed_self', 'drink_cup', 'cooperate_dressing', 'use_toilet'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Can the child feed themselves using fingers or utensils as appropriate for their age?"}
              {index === 1 && "Is the child able to drink from a cup without assistance?"}
              {index === 2 && "Does the child cooperate during dressing or undressing?"}
              {index === 3 && "Can the child use the toilet with minimal assistance by age 4-5?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Red Flags */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Red Flags</h2>
        
        {['no_babbling', 'no_words', 'difficulty_walking', 'regression', 'repetitive_behaviors', 'no_eye_contact'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "By Age 1: No babbling, pointing, or meaningful gestures."}
              {index === 1 && "By Age 2: No words or failure to follow simple instructions."}
              {index === 2 && "By Age 3: Difficulty walking, minimal interaction with others, or inability to recognize caregivers."}
              {index === 3 && "At Any Age: Loss of previously acquired skills (regression)."}
              {index === 4 && "Persistent hand flapping, toe walking, or repetitive behaviors."}
              {index === 5 && "Inability to make eye contact or interact socially."}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Observation-Based Questions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Observation-Based Questions</h2>
        
        {['frustrated', 'avoid_touch', 'growth_concerns'].map((name, index) => (
          <div key={name} className="space-y-2">
            <label className="block text-gray-700">
              {index === 0 && "Does the child often seem to get frustrated or distressed during daily activities?"}
              {index === 1 && "Does the child avoid physical touch or interaction with others?"}
              {index === 2 && "Are there concerns about the child’s growth, such as being noticeably smaller or larger than peers of the same age?"}
            </label>
            <select 
              name={name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
            </select>
          </div>
        ))}
      </section>

      {/* Submit Button */}
      <button 
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Submit Assessment
      </button>

      {submitted && (
        <div className="mt-4 text-green-500">
          Form submitted successfully!
        </div>
      )}
    </form>
  );
};

export default Questions;