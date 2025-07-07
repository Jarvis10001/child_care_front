import React from "react";

const conditions = [
  { name: "Autism", icon: "🧩" },
  { name: "ADHD", icon: "🧠" },
  { name: "Cerebral Palsy", icon: "🦽" },
  { name: "Intellectual Disability", icon: "🧬" },
  { name: "Down Syndrome", icon: "🧑‍🤝‍🧑" },
  { name: "Learning Disability", icon: "📖" },
  { name: "Sensory Processing Disorder", icon: "🎨" },
  { name: "Dyslexia", icon: "🔡" }
];

const ConditionsList = () => {
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl font-bold mb-6">Conditions We Treat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {conditions.map((condition, index) => (
          <div key={index} className="border p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">{condition.icon}</div>
            <p className="text-lg font-semibold">{condition.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionsList;
