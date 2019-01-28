export const getTimeAgo = (time = Date.now()) => {
  const seconds = Math.round((Date.now() - time) / 1000);
  if (seconds >= 60) {
    const minutes = Math.round(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.round(minutes / 60);
      const rest = minutes - (hours * 60);
      if (rest > 0) return `${hours}hr ${rest}min`;
      return `${hours}hr`;
    } else {
      const rest = seconds - (seconds * 60);
      if (rest > 0) return `${minutes}min ${rest}sec`;
      return `${minutes}min`;
    }
  } else {
    return `${seconds+1}sec`;
  }
};