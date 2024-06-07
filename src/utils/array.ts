export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export function getUniqueObjects<T>(arr: T[], key?: keyof T): T[] {
  if (key) {
    const uniqueIds = new Set();
    return arr.filter((obj) => {
      const id = obj[key];
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        return true;
      }
      return false;
    });
  } else {
    return [...new Set(arr)];
  }
}
