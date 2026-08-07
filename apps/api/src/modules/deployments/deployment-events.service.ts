import { Injectable } from '@nestjs/common';
import type { DeploymentEventSummary, DeploymentSummary } from '@dpd/shared';
import { DeploymentEventMapper } from '../../k8s/mappers/deployment-event.mapper';
import { DeploymentEventsRepository } from '../../k8s/repositories/deployment-events.repository';

@Injectable()
export class DeploymentEventsService {
  constructor(
    private readonly deploymentEventsRepository: DeploymentEventsRepository,
    private readonly deploymentEventMapper: DeploymentEventMapper,
  ) {}

  listForDeployment(namespace: string, name: string): Promise<DeploymentEventSummary[]> {
    return this.deploymentEventsRepository.listForDeployment(namespace, name);
  }

  async attachLatestWarnings(
    namespace: string,
    deployments: DeploymentSummary[],
  ): Promise<DeploymentSummary[]> {
    if (deployments.length === 0) {
      return deployments;
    }

    try {
      const warnings = await this.deploymentEventsRepository.listWarnings(namespace);
      return deployments.map((deployment) => ({
        ...deployment,
        latestWarning: this.deploymentEventMapper.pickLatestWarning(warnings, deployment.name),
      }));
    } catch {
      return deployments;
    }
  }
}
