import { Injectable } from '@nestjs/common';
import type { DeploymentEventSummary } from '@dpd/shared';
import { K8sService } from '../k8s.service';
import { DeploymentEventMapper } from '../mappers/deployment-event.mapper';

@Injectable()
export class DeploymentEventsRepository {
  constructor(
    private readonly k8sService: K8sService,
    private readonly eventMapper: DeploymentEventMapper,
  ) {}

  async listWarnings(namespace: string) {
    const response = await this.k8sService.core.listNamespacedEvent({
      namespace,
      fieldSelector: 'type=Warning',
    });

    return response.items ?? [];
  }

  async listForDeployment(
    namespace: string,
    deploymentName: string,
    limit = 8,
  ): Promise<DeploymentEventSummary[]> {
    const response = await this.k8sService.core.listNamespacedEvent({ namespace });
    const matched = (response.items ?? [])
      .filter((event) => this.eventMapper.matchesDeployment(event, deploymentName))
      .sort((left, right) => {
        const leftTs = this.eventMapper.toSummary(left).lastTimestamp;
        const rightTs = this.eventMapper.toSummary(right).lastTimestamp;
        return rightTs.localeCompare(leftTs);
      })
      .slice(0, limit);

    return matched.map((event) => this.eventMapper.toSummary(event));
  }
}
