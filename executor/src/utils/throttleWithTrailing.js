function throttleWithTrailing(func, limit) {
  let timeoutId = null;
  let lastTime = 0;

  return function throttled(...args) {
    const now = Date.now();
    const remainingTime = limit - (now - lastTime);

    const context = this;

    const executeFunction = () => {
      func.apply(context, args);
      lastTime = Date.now();
      timeoutId = null;
    };

    if (remainingTime <= 0) {
      // Enough time has passed, call the function immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      executeFunction();
    } else if (!timeoutId) {
      // Schedule a trailing call
      timeoutId = setTimeout(executeFunction, remainingTime);
    }
  };
}

module.exports = throttleWithTrailing;
