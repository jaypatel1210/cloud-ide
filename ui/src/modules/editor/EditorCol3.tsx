import { FC, ReactNode, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';

import EditorTerminal from './EditorTerminal';
import EditorPreview from './EditorPreview';

interface Col2LayoutProps {
  col1: ReactNode;
  col2: ReactNode;
}

const Col2Layout: FC<Col2LayoutProps> = ({ col1, col2 }) => {
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  return (
    <Stack direction="column" spacing="0.5" className="fit-to-parent">
      <Button variant="contained" color="primary" onClick={togglePreview}>
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </Button>
      {showPreview ? <Box sx={{ height: '40%' }}>{col1}</Box> : null}
      <Box sx={{ height: '50%' }}>{col2}</Box>
    </Stack>
  );
};

const EditorCol3 = () => {
  return <Col2Layout col1={<EditorPreview />} col2={<EditorTerminal />} />;
};

export default EditorCol3;
