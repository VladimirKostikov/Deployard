export interface DeploymentWarningSummary {
  reason: string;
  message: string;
  count: number;
  lastTimestamp: string;
}

export interface DeploymentEventSummary {
  type: string;
  reason: string;
  message: string;
  count: number;
  lastTimestamp: string;
  involvedKind: string;
  involvedName: string;
}

export interface DeploymentSummary {
  name: string;
  namespace: string;
  replicas: number;
  readyReplicas: number;
  availableReplicas: number;
  updatedReplicas: number;
  image: string;
  revision: number;
  createdAt: string;
  partOf?: string;
  changeCause?: string;
  disabled: boolean;
  previousReplicas?: number;
  disabledWithErrors?: boolean;
  hasLivenessProbe: boolean;
  hasReadinessProbe: boolean;
  hasStartupProbe: boolean;
  latestWarning?: DeploymentWarningSummary;
}

export interface DeploymentRevision {
  revision: number;
  replicas: number;
  image: string;
  createdAt: string;
  changeCause?: string;
}

export interface RollbackRequest {
  revision: number;
}

export interface DeleteProjectGroupResult {
  partOf: string;
  namespace: string;
  deleted: Array<{ kind: 'Deployment' | 'Service' | 'Secret'; name: string }>;
}

export interface RestartProjectGroupResult {
  partOf: string;
  namespace: string;
  restarted: string[];
}

export interface DisableProjectGroupResult {
  partOf: string;
  namespace: string;
  disabled: string[];
}

import type { ContainerEnvVar } from './deployment-config';

export interface CreateDeploymentRequest {
  name: string;
  namespace: string;
  image: string;
  replicas: number;
  containerPort?: number;
  env?: ContainerEnvVar[];
  partOf?: string;
}

export interface UpdateDeploymentImageRequest {
  image: string;
}
