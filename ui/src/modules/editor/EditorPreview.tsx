const EditorPreview = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {/* TODO: replace with actual preview url */}
      <iframe src={`http://localhost:9999`} height="100%" width="100%" />
    </div>
  );
};

export default EditorPreview;
