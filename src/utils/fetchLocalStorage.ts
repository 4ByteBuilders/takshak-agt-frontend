export const setWithExpiry = (key: string, value: string, ttl: number) => {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

export const removeLocalData = (key: string) => {
  localStorage.removeItem(key);
};
