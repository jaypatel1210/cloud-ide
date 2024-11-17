const fbAdmin = require('firebase-admin');
const throttleWithTrailing = require('./throttleWithTrailing');
const db = fbAdmin.firestore();

const MINUTE = 60 * 1000;

// TODO: separate logEvent function
function logEvent(resourceId) {
  function logEventToDB() {
    try {
      const docRef = db.collection('resources-logs').doc(resourceId);
      docRef.update({
        lastRequestOn: new Date(),
      });
    } catch (error) {
      console.error('Failed to log event');
    }
  }
  return logEventToDB;
}

function withLogging(io) {
  //   const originalOn = io.on.bind(io);
  //   const originalEmit = io.emit.bind(io);

  // io.on = (event, listener) => {
  //   originalOn(event, (socket, ...args) => {
  //     logEvent();
  //     listener(socket, ...args);
  //   });
  // };

  // io.emit = (event, data) => {
  //   logEvent();
  //   originalEmit(event, data);
  // };

  io.use((socket, next) => {
    const resourceId = socket.handshake.query.resourceId;

    const logEventWithId = logEvent(resourceId);
    const throttledLogEvent = throttleWithTrailing(logEventWithId, MINUTE * 2);
    socket.onAny(() => {
      throttledLogEvent();
    });
    const originalEmit = socket.emit.bind(socket);
    socket.emit = (event, data) => {
      throttledLogEvent();
      originalEmit(event, data);
    };
    next();
  });

  return io;
}

module.exports = { withLogging };
