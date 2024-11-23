import { FC, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  MenuItem,
  Typography,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingButton from '@mui/lab/LoadingButton';

import axiosInstance from '../../axios/axiosInstance';

interface Props {
  projectId: string;
}

const deleteProject = async ({
  projectId,
}: {
  projectId: string;
}): Promise<any> => {
  const { data } = await axiosInstance.post(`/delete-project`, {
    projectId,
  });

  return data;
};

const ProjectDelete: FC<Props> = ({ projectId }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });

      handleClose();
    },
  });

  const handleDelete = async () => {
    mutation.mutate({ projectId });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography>Delete</Typography>
      </MenuItem>

      {open && (
        <Dialog
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            elevation: 0,
            variant: 'outlined',
          }}
        >
          <DialogTitle id="alert-dialog-title">Delete Project</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              autoFocus
              loading={mutation.status == 'pending'}
              onClick={handleDelete}
              variant="contained"
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ProjectDelete;
