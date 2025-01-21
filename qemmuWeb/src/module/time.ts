export const getRelativeTime = (isoDate: string): string => {
  if (isoDate === "0001-01-01T00:00:00Z") {
    return "";
  }

  const now = new Date();
  let s = "";
  try {
    const date = new Date(isoDate);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    s = `${Math.floor(diff / 86400)} days ago`;
    return s;
  } catch (e) {
    return s;
  }
};
