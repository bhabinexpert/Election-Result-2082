const VISITOR_KEY = "election2082_visitor_id";

const createVisitorId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const extra = Math.random().toString(36).substring(2, 8);
  return `v_${timestamp}_${random}_${extra}`;
};

export const getOrCreateVisitorId = () => {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const newId = createVisitorId();
  localStorage.setItem(VISITOR_KEY, newId);
  return newId;
};
