type ProjectType = 'nodejs' | 'python';

interface File {
  content: string;
  name: string;
  id: string;
  relativePath: string;
}

interface TreeNode {
  name: string;
  type: 'file' | 'dir';
  children?: TreeNode[];
  id: string;
  relativePath: string;
}

interface User {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  loginProvider: string;
  verified: boolean;
  image_url: string;

  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  created: any;
  preferences: any;
  metadata: string;
}

interface DefaultResponse {
  message: string;
}

export type { File, TreeNode, User, ProjectType, DefaultResponse };
