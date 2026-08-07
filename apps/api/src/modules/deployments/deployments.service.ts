import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AuthUser,
  ALL_NAMESPACES,
  DeploymentConfigSummary,
  DeploymentEventSummary,
  DeploymentHealthInsight,
  DeploymentRevision,
  DeploymentSummary,
  DeleteProjectGroupResult,
  DisableProjectGroupResult,
  RestartProjectGroupResult,
  ImageDefaultsResponse,
} from '@dpd/shared';
import {
  DEPLOYMENTS_REPOSITORY,
  IDeploymentsRepository,
} from '../../k8s/interfaces/deployments.repository.interface';
import { DeploymentsConfigRepository } from '../../k8s/repositories/deployments-config.repository';
import { DeploymentsHealthRepository } from '../../k8s/repositories/deployments-health.repository';
import { resolveImageDefaults } from '../../k8s/config/deployment-config.resolver';
import { PermissionChecker } from '../auth/permission-checker.service';
import { DeploymentEventsService } from './deployment-events.service';
import {
  CreateDeploymentDto,
  UpdateDeploymentConfigDto,
  UpdateDeploymentImageDto,
} from './dto/deployment-write.dto';
import { RollbackDeploymentDto } from './dto/rollback-deployment.dto';

@Injectable()
export class DeploymentsService {
  constructor(
    @Inject(DEPLOYMENTS_REPOSITORY)
    private readonly deploymentsRepository: IDeploymentsRepository,
    private readonly deploymentsConfigRepository: DeploymentsConfigRepository,
    private readonly deploymentsHealthRepository: DeploymentsHealthRepository,
    private readonly deploymentEventsService: DeploymentEventsService,
    private readonly permissionChecker: PermissionChecker,
  ) {}

  async list(namespace: string, user: AuthUser): Promise<DeploymentSummary[]> {
    const items = await this.deploymentsRepository.list(namespace);

    const filtered =
      namespace === ALL_NAMESPACES
        ? this.permissionChecker.filterDeploymentsAcrossNamespaces(user, items)
        : this.permissionChecker.filterDeployments(user, namespace, items);

    if (namespace === ALL_NAMESPACES) {
      return filtered;
    }

    return this.deploymentEventsService.attachLatestWarnings(namespace, filtered);
  }

  async get(namespace: string, name: string): Promise<DeploymentSummary> {
    const summary = await this.deploymentsRepository.findByName(namespace, name);
    const [enriched] = await this.deploymentEventsService.attachLatestWarnings(namespace, [summary]);
    return enriched ?? summary;
  }

  async listEvents(namespace: string, name: string): Promise<DeploymentEventSummary[]> {
    await this.deploymentsRepository.findByName(namespace, name);
    return this.deploymentEventsService.listForDeployment(namespace, name);
  }

  async history(namespace: string, name: string): Promise<DeploymentRevision[]> {
    await this.deploymentsRepository.findByName(namespace, name);
    return this.deploymentsRepository.listRevisions(namespace, name);
  }

  rollback(namespace: string, name: string, dto: RollbackDeploymentDto): Promise<DeploymentSummary> {
    return this.deploymentsRepository.rollback(namespace, name, dto.revision);
  }

  scale(namespace: string, name: string, replicas: number): Promise<DeploymentSummary> {
    return this.deploymentsRepository.scale(namespace, name, replicas);
  }

  disable(namespace: string, name: string): Promise<DeploymentSummary> {
    return this.deploymentsRepository.disable(namespace, name);
  }

  enable(namespace: string, name: string): Promise<DeploymentSummary> {
    return this.deploymentsRepository.enable(namespace, name);
  }

  create(dto: CreateDeploymentDto): Promise<DeploymentSummary> {
    return this.deploymentsRepository.create(
      dto.namespace,
      dto.name,
      dto.image,
      dto.replicas,
      dto.containerPort,
      dto.env,
      dto.partOf,
    );
  }

  getImageDefaults(image: string, containerPort?: number): ImageDefaultsResponse {
    return resolveImageDefaults(image, containerPort);
  }

  async getConfig(namespace: string, name: string): Promise<DeploymentConfigSummary> {
    await this.deploymentsRepository.findByName(namespace, name);
    return this.deploymentsConfigRepository.getConfig(namespace, name);
  }

  getHealthInsight(namespace: string, name: string): Promise<DeploymentHealthInsight> {
    return this.deploymentsHealthRepository.getHealthInsight(namespace, name);
  }

  async updateConfig(
    namespace: string,
    name: string,
    dto: UpdateDeploymentConfigDto,
  ): Promise<DeploymentConfigSummary> {
    await this.deploymentsRepository.findByName(namespace, name);
    return this.deploymentsConfigRepository.updateConfig(namespace, name, dto.env);
  }

  delete(namespace: string, name: string): Promise<void> {
    return this.deploymentsRepository.delete(namespace, name);
  }

  async deleteProjectGroup(
    namespace: string,
    partOf: string,
    user: AuthUser,
  ): Promise<DeleteProjectGroupResult> {
    const deployments = await this.deploymentsRepository.list(namespace);
    const inGroup = deployments.filter((deployment) => deployment.partOf?.trim() === partOf.trim());

    if (inGroup.length === 0) {
      throw new NotFoundException({
        message: `Project group "${partOf}" not found in namespace "${namespace}"`,
      });
    }

    const permitted = this.permissionChecker.filterDeployments(user, namespace, inGroup);
    if (permitted.length === 0) {
      throw new NotFoundException({
        message: `Project group "${partOf}" not found in namespace "${namespace}"`,
      });
    }

    return this.deploymentsRepository.deleteProjectGroup(
      namespace,
      partOf,
      permitted.map((deployment) => deployment.name),
    );
  }

  async restartProjectGroup(
    namespace: string,
    partOf: string,
    user: AuthUser,
  ): Promise<RestartProjectGroupResult> {
    const deployments = await this.deploymentsRepository.list(namespace);
    const inGroup = deployments.filter((deployment) => deployment.partOf?.trim() === partOf.trim());

    if (inGroup.length === 0) {
      throw new NotFoundException({
        message: `Project group "${partOf}" not found in namespace "${namespace}"`,
      });
    }

    const permitted = this.permissionChecker.filterDeployments(user, namespace, inGroup);
    if (permitted.length === 0) {
      throw new NotFoundException({
        message: `Project group "${partOf}" not found in namespace "${namespace}"`,
      });
    }

    return this.deploymentsRepository.restartProjectGroup(
      namespace,
      partOf,
      permitted.map((deployment) => deployment.name),
    );
  }

  async disableProjectGroup(
    namespace: string,
    partOf: string,
    user: AuthUser,
  ): Promise<DisableProjectGroupResult> {
    const deployments = await this.deploymentsRepository.list(namespace);
    const inGroup = deployments.filter((deployment) => deployment.partOf?.trim() === partOf.trim());

    if (inGroup.length === 0) {
      throw new NotFoundException({
        message: `Project group "${partOf}" not found in namespace "${namespace}"`,
      });
    }

    const permitted = this.permissionChecker.filterDeployments(user, namespace, inGroup);
    if (permitted.length === 0) {
      throw new NotFoundException({
        message: `Project group "${partOf}" not found in namespace "${namespace}"`,
      });
    }

    const active = permitted.filter(
      (deployment) => !deployment.disabled && deployment.replicas > 0,
    );

    if (active.length === 0) {
      throw new NotFoundException({
        message: `No active deployments in project group "${partOf}"`,
      });
    }

    return this.deploymentsRepository.disableProjectGroup(
      namespace,
      partOf,
      active.map((deployment) => deployment.name),
    );
  }

  updateImage(namespace: string, name: string, dto: UpdateDeploymentImageDto): Promise<DeploymentSummary> {
    return this.deploymentsRepository.updateImage(namespace, name, dto.image);
  }

  restart(namespace: string, name: string): Promise<DeploymentSummary> {
    return this.deploymentsRepository.restart(namespace, name);
  }
}
