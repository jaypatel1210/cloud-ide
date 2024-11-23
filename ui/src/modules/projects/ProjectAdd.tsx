import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectType } from '../../utils/types';
import axiosInstance from '../../axios/axiosInstance';

interface ProjectAdd {
  projectType: ProjectType;
  projectName: string;
  projectDesc: string;
}

const addProject = async ({
  projectType,
  projectName,
  projectDesc,
}: ProjectAdd): Promise<any> => {
  const { data } = await axiosInstance.post(`/create-project`, {
    project: {
      projectType,
      projectName,
      projectDesc,
    },
  });

  return data;
};

const ProjectAdd = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
      });

      handleClose();
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const formJson = Object.fromEntries((formData as any).entries());

    mutation.mutate({
      projectType: formJson.projectType,
      projectName: formJson.projectName,
      projectDesc: formJson.projectDesc,
    });
  }

  return (
    <>
      <Card variant="outlined">
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="fit-to-parent"
        >
          <Tooltip title="New Project">
            <Button
              startIcon={<AddOutlinedIcon fontSize="large" />}
              sx={{
                color: 'var(--mui-palette-text-primary)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={handleClickOpen}
            >
              New Project
            </Button>
          </Tooltip>
        </CardActions>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,

          elevation: 0,
          variant: 'outlined',
        }}
      >
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} my={1}>
            <Grid size={12}>
              <TextField
                fullWidth
                required
                name="projectName"
                id="project-name"
                label="Project Name"
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel id="projectType">Template</InputLabel>
                <Select
                  fullWidth
                  required
                  name="projectType"
                  labelId="projectType"
                  id="project-type"
                  label="Template"
                >
                  {/* TODO: language icon */}
                  <MenuItem value="nodejs">Node.js</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                name="projectDesc"
                id="project-desc"
                label="Description"
                variant="outlined"
                rows="2"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton type="submit" loading={mutation.status == 'pending'}>
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectAdd;
