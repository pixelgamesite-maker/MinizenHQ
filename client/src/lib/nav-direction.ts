let lastIndex = 0;

export function getNavDirection(currentIndex: number) {
  const dir = currentIndex > lastIndex ? 1 : -1;
  lastIndex = currentIndex;
  return dir;
}
