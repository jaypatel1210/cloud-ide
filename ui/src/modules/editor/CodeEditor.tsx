import { FC, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

import debounce from '../../utils/debounce';
import { File } from '../../utils/types';
import { useSocket } from '../../context/SocketProvider';
import { Typography } from '@mui/material';

interface Props {
  file: File;
}

interface WrapperProps {
  selectedFile: string;
}

const CodeEditor: FC<Props> = ({
  file: { content, id, name, relativePath },
}) => {
  const { socket } = useSocket();
  let language = name.split('.').pop();

  if (language === 'js' || language === 'jsx') language = 'javascript';
  else if (language === 'ts' || language === 'tsx') language = 'typescript';
  else if (language === 'py') language = 'python';

  const handleChange = (value: string | undefined) => {
    socket.emit('updateContent', relativePath, value);
  };

  const debouncedChange = debounce(handleChange, 1000);

  return (
    <Editor
      key={id}
      height="100%"
      language={language}
      value={content}
      theme="vs-dark"
      onChange={debouncedChange}
    />
  );
};

const Wrapper: FC<WrapperProps> = ({ selectedFile }) => {
  const { socket } = useSocket();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!selectedFile) return;
    socket.emit('fetchContent', selectedFile, (data: string) => {
      setFile({
        content: data,
        id: selectedFile.replace(/\//g, ''),
        name: selectedFile.split('/').pop() || '',
        relativePath: selectedFile,
      });
    });

    // return () => {
    //   socket!.disconnect();
    // };
  }, [selectedFile]);

  if (!file) return <Typography>Please Select File</Typography>;

  return <CodeEditor file={file} />;
};

export default Wrapper;
