const VISITOR_KEY = "election2082_visitor_id";

const createVisitorId = () => {
  const randomPart = Math.random().toString(36).slice(2);
  return `v_${Date.now().toString(36)}_${randomPart}`;
};

export const getOrCreateVisitorId = () => {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const newId = createVisitorId();
  localStorage.setItem(VISITOR_KEY, newId);
  return newId;
};
