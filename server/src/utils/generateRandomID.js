function generateRandomID(level) {
  return (
    level +
    '_' +
    Date.now().toString(35) +
    Math.random().toString(36).substr(2, 9)
  );
}

export default generateRandomID;
