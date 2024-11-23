import { FC, useState } from 'react';
import { IconButton, styled } from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import JavascriptIcon from '@mui/icons-material/Javascript';

import { TreeNode as TreeNodeType } from '../utils/types';

interface TreeNodeProps {
  node: TreeNodeType;
  level: number;
  selectedFile: string | null;
  onSelectFile: (fileName: string) => void;
}

interface Props {
  data: TreeNodeType[];
  selectedFile: string;
  onSelectFile: (fileName: string) => void;
}

const FILE_ICONS: { [key: string]: JSX.Element } = {
  js: <JavascriptIcon fontSize="medium" />,
};

const ICONS_AVAILABLE = ['js'];

const DivTreeRow = styled('div')<{ bgColor?: boolean; isFile?: boolean }>(
  ({ bgColor }) => ({
    display: 'flex',
    alignItems: 'center',
    background: bgColor ? '#343434' : '',
    padding: '7px 0 7px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    justifyContent: 'space-between',
  })
);

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  selectedFile,
  onSelectFile,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'dir') {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (node.type === 'file') {
      onSelectFile(node.relativePath);
    } else {
      toggleExpand(e);
    }
  };

  const indent =
    node.type == 'file' ? (level == 0 ? 20 : level * 20) : level * 20;

  const extension = node.name.split('.').pop();

  return (
    <div>
      <DivTreeRow
        bgColor={node.type === 'file' && selectedFile == node.relativePath}
        style={{ paddingLeft: `${indent}px` }}
        onClick={handleClick}
        isFile={node.type === 'file'}
      >
        <div
          style={{
            display: 'flex',
          }}
        >
          {node.type === 'dir' ? (
            <FolderIcon fontSize="medium" />
          ) : ICONS_AVAILABLE.includes(extension!) ? (
            FILE_ICONS[extension!]
          ) : (
            <InsertDriveFileIcon fontSize="medium" />
          )}
          <span
            style={{
              paddingLeft: '1rem',
            }}
          >
            {node.name}
          </span>
        </div>
        {node.type === 'dir' && (
          <IconButton onClick={toggleExpand}>
            {isExpanded ? (
              <KeyboardArrowDownIcon fontSize="medium" />
            ) : (
              <KeyboardArrowRightIcon fontSize="medium" />
            )}
          </IconButton>
        )}
      </DivTreeRow>
      {node.type === 'dir' && isExpanded && node.children && (
        <div>
          {node.children.map(childNode => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree: FC<Props> = ({ data, selectedFile, onSelectFile }) => {
  if (!data || data.length === 0) {
    return <p>Empty</p>;
  }

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <div
        style={{
          margin: '1.3rem',
        }}
      >
        {data.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileTree;
