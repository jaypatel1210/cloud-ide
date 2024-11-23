import { DefaultResponse, ProjectType } from '../../utils/types';

export interface Project extends DefaultResponse {
  projects: {
    id: string;
    projectDesc: string;
    projectId: string;
    projectName: string;
    projectType: ProjectType;
    status: 'ACTIVE' | 'INACTIVE';
    uid: string;
    created: {
      _seconds: number;
      _nanoseconds: number;
    };
  }[];
}
