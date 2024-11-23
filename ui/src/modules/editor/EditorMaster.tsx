import { FC, ReactNode, useState } from 'react';

import Layout from '../../components/Layout';
import EditorFileTree from './EditorFileTree';
import CodeEditor from './CodeEditor';
import EditorCol3 from './EditorCol3';

interface LayoutWrapperProps {
  children: ReactNode;
}

const LayoutWrapper: FC<LayoutWrapperProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState('');

  const onSelectFile = (file: string) => {
    setSelectedFile(file);
  };

  return (
    <Layout
      col1={
        <EditorFileTree
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
        />
      }
      col2={<CodeEditor selectedFile={selectedFile} />}
      col3={children}
      title="Editor"
    />
  );
};

const EditorMaster = () => {
  return <LayoutWrapper children={<EditorCol3 />} />;
};

export default EditorMaster;
