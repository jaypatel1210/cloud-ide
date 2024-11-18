import {
  addRecord,
  createCurriedQuery,
  deleteRecord,
} from './utils/firestore-db.js';
import verifyFirebaseToken from './middleware/verify-token.js';
import generateRandomID from './utils/generateRandomID.js';
import copyBaseCode from './utils/copyBaseCode.js';

function registerProjectRoutes(app) {
  app.post('/create-project', verifyFirebaseToken, async (req, res) => {
    const projectId = generateRandomID('prj');
    const projectType = req.body?.project?.projectType || 'nodejs';

    const isCopied = await copyBaseCode(
      `base/${projectType}`,
      `code/${projectId}`
    );

    if (!isCopied) {
      res.status(500).send({
        message: 'Error copying project code.',
      });
      return;
    }

    if (!req.body?.project?.projectName) {
      res.status(400).send({
        message: 'Project name is required.',
      });
      return;
    }

    const project = {
      projectId,
      projectType,
      projectName: req.body.project.projectName,
      projectDesc: req.body?.project?.projectDesc,
      status: 'ACTIVE',
      created: new Date(),
      uid: req.user.uid,
    };

    try {
      const newProject = await addRecord('projects', project, projectId);
      res.status(201).send({
        project: newProject,
        message: 'Project created successfully.',
      });
    } catch (error) {
      console.error('Error creating project');
      res.status(500).send({
        message: 'Error creating project',
      });
    }
  });

  app.delete('/project/:projectId', verifyFirebaseToken, async (req, res) => {
    const projectId = req.params.projectId;

    try {
      await deleteRecord('projects', projectId);
      res.status(200).send({
        message: 'Project deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting project');
      res.status(500).send({
        message: 'Error deleting project.',
      });
    }
  });

  app.get('/projects', verifyFirebaseToken, async (req, res) => {
    const uid = req.user.uid;

    if (!uid) {
      res.status(400).send({
        message: 'UID is required.',
        projects: [],
      });
      return;
    }

    try {
      const projects = await createCurriedQuery('projects')([
        ['uid', '==', uid],
      ])('created')('desc')();

      res.status(200).send({
        projects,
        message: 'Projects retrieved successfully.',
      });
    } catch (error) {
      console.error('Error getting projects');
      res.status(500).send({
        message: 'Error getting projects.',
      });
    }
  });
}

export default registerProjectRoutes;
