export const scriptTemplates = {
  "exercise": "1. Hook: 'Stop wasting time!'\n2. Tip: 10-min workouts\n3. CTA: 'Try now!'",
  // Add more templates...
};

export function getFallbackScript(topic = 'your topic') {
  const key = Object.keys(scriptTemplates).find(k => 
    topic.toLowerCase().includes(k)
  );
  return key ? scriptTemplates[key] : `1. HOOK\n2. ABOUT ${topic.slice(0,20)}\n3. CTA`;
}