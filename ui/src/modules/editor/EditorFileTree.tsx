import { FC, useEffect, useState } from 'react';

import FileTree from '../../components/FileTree';
import { useSocket } from '../../context/SocketProvider';
import { TreeNode } from '../../utils/types';

interface Props {
  selectedFile: string;
  onSelectFile: (fileName: string) => void;
}

const EditorFileTree: FC<Props> = ({ selectedFile, onSelectFile }) => {
  const { socket } = useSocket();
  const [data, setData] = useState<TreeNode[]>([]);

  useEffect(() => {
    socket.emit('fetchFileTree', (data: TreeNode[]) => {
      setData(data);
    });

    socket.on('fileTreeChange', (data: TreeNode[]) => {
      setData(data);
    });
  }, []);

  return (
    <FileTree
      data={data}
      selectedFile={selectedFile}
      onSelectFile={onSelectFile}
    />
  );
};

export default EditorFileTree;
