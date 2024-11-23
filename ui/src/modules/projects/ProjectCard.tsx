import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import ProjectDelete from './ProjectDelete';
import { ProjectType } from '../../utils/types';

export interface ProjectCardProps {
  title: string;
  description: string;
  date: string;
  projectId: string;
  projectType: string;
}

type AvatarMap = {
  [key in ProjectType]: {
    src: string;
    alt: string;
  };
};
const AVATAR_MAP: AvatarMap = {
  nodejs: {
    src: 'https://firebasestorage.googleapis.com/v0/b/cloude-ide-96b39.appspot.com/o/ui-imgs%2Fproject-avatar%2Fjs.png?alt=media&token=5ebf1aed-1f6f-43d7-9a28-553ccf7199aa',
    alt: 'JS',
  },
  python: {
    src: 'https://firebasestorage.googleapis.com/v0/b/cloude-ide-96b39.appspot.com/o/ui-imgs%2Fproject-avatar%2Fpython.png?alt=media&token=1ca7813f-f6cf-427f-b7ba-fcc1e6d00d91',
    alt: 'Python',
  },
};

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  description,
  date,
  projectId,
  projectType,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const avatar = AVATAR_MAP[projectType as keyof typeof AVATAR_MAP];

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartProject = () => {
    navigate(`/editor/${projectId}`);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        title={<Typography variant="body1">{title}</Typography>}
        subheader={description}
        action={<Avatar src={avatar.src} alt={avatar.alt} />}
        sx={{
          '& .MuiCardHeader-action': {
            margin: 0,
          },
        }}
      />
      <CardActions
        sx={{
          justifyContent: 'space-between',
          padding: '0 16px 8px',
        }}
      >
        <Typography variant="caption">{date}</Typography>

        <div>
          <IconButton aria-label="Start Project" onClick={handleStartProject}>
            <PlayArrowRoundedIcon />
          </IconButton>
          <IconButton aria-label="Actions" onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {/*TODO: <MenuItem onClick={handleClose}>Deactivate</MenuItem> */}
            <ProjectDelete projectId={projectId} />
          </Menu>
        </div>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
