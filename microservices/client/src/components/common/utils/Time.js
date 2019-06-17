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

export const timeParser = (notificationTime = Date.now()) => {
  const time = new Date(notificationTime);
  const now = Date.now();
  const difference = (now - time.getTime()) / 1000;
  if (difference < 60) {
    return 'Now';
  }
  if (difference < 3600) {
    return `${Math.round(difference / 60)} min ago`;
  }
  const parsedMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const parsedHours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
  return `${parsedHours}:${parsedMinutes}`;
}

export const intervalTime = 60 * 1000;