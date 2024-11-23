function decodeBuffer(buffer: ArrayBuffer) {
  const decoder = new TextDecoder('utf-8');
  const decodedMessage = decoder.decode(new Uint8Array(buffer));
  return decodedMessage;
}

export default decodeBuffer;
