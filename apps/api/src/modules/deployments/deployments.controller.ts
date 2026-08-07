import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  DeploymentConfigSummary,
  DeploymentEventSummary,
  DeploymentHealthInsight,
  DeploymentRevision,
  DeploymentSummary,
  ImageDefaultsResponse,
  AccessLevel,
  AppSection,
  DeleteProjectGroupResult,
  DisableProjectGroupResult,
  RestartProjectGroupResult,
} from '@dpd/shared';
import { RequireAccess, CurrentUser } from '../auth/decorators/auth.decorators';
import {
  CreateDeploymentDto,
  UpdateDeploymentConfigDto,
  UpdateDeploymentImageDto,
} from './dto/deployment-write.dto';
import { RollbackDeploymentDto } from './dto/rollback-deployment.dto';
import { ScaleDeploymentDto } from './dto/scale-deployment.dto';
import { DeploymentsService } from './deployments.service';
import { AuthUser } from '@dpd/shared';

@ApiTags('deployments')
@Controller('deployments')
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Get()
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'namespace', required: true })
  list(@Query('namespace') namespace: string, @CurrentUser() user: AuthUser): Promise<DeploymentSummary[]> {
    return this.deploymentsService.list(namespace, user);
  }

  @Post()
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.MANAGE)
  create(@Body() dto: CreateDeploymentDto): Promise<DeploymentSummary> {
    return this.deploymentsService.create(dto);
  }

  @Get('image-defaults')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'image', required: true })
  @ApiQuery({ name: 'containerPort', required: false })
  imageDefaults(
    @Query('image') image: string,
    @Query('containerPort') containerPort?: string,
  ): ImageDefaultsResponse {
    const parsedPort = containerPort ? Number(containerPort) : undefined;
    return this.deploymentsService.getImageDefaults(image, parsedPort);
  }

  @Get(':name')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  get(@Query('namespace') namespace: string, @Param('name') name: string): Promise<DeploymentSummary> {
    return this.deploymentsService.get(namespace, name);
  }

  @Get(':name/events')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  events(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentEventSummary[]> {
    return this.deploymentsService.listEvents(namespace, name);
  }

  @Post('project-groups/:partOf/restart')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'partOf' })
  restartProjectGroup(
    @Query('namespace') namespace: string,
    @Param('partOf') partOf: string,
    @CurrentUser() user: AuthUser,
  ): Promise<RestartProjectGroupResult> {
    return this.deploymentsService.restartProjectGroup(namespace, partOf, user);
  }

  @Post('project-groups/:partOf/disable')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'partOf' })
  disableProjectGroup(
    @Query('namespace') namespace: string,
    @Param('partOf') partOf: string,
    @CurrentUser() user: AuthUser,
  ): Promise<DisableProjectGroupResult> {
    return this.deploymentsService.disableProjectGroup(namespace, partOf, user);
  }

  @Delete('project-groups/:partOf')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.MANAGE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'partOf' })
  deleteProjectGroup(
    @Query('namespace') namespace: string,
    @Param('partOf') partOf: string,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteProjectGroupResult> {
    return this.deploymentsService.deleteProjectGroup(namespace, partOf, user);
  }

  @Delete(':name')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.MANAGE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  delete(@Query('namespace') namespace: string, @Param('name') name: string): Promise<{ ok: true }> {
    return this.deploymentsService.delete(namespace, name).then(() => ({ ok: true as const }));
  }

  @Get(':name/history')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  history(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentRevision[]> {
    return this.deploymentsService.history(namespace, name);
  }

  @Post(':name/rollback')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  rollback(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
    @Body() dto: RollbackDeploymentDto,
  ): Promise<DeploymentSummary> {
    return this.deploymentsService.rollback(namespace, name, dto);
  }

  @Patch(':name/scale')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  scale(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
    @Body() dto: ScaleDeploymentDto,
  ): Promise<DeploymentSummary> {
    return this.deploymentsService.scale(namespace, name, dto.replicas);
  }

  @Patch(':name/image')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  updateImage(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
    @Body() dto: UpdateDeploymentImageDto,
  ): Promise<DeploymentSummary> {
    return this.deploymentsService.updateImage(namespace, name, dto);
  }

  @Post(':name/restart')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  restart(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentSummary> {
    return this.deploymentsService.restart(namespace, name);
  }

  @Post(':name/disable')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  disable(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentSummary> {
    return this.deploymentsService.disable(namespace, name);
  }

  @Post(':name/enable')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  enable(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentSummary> {
    return this.deploymentsService.enable(namespace, name);
  }

  @Get(':name/health')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  healthInsight(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentHealthInsight> {
    return this.deploymentsService.getHealthInsight(namespace, name);
  }

  @Get(':name/config')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.VIEW)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  getConfig(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
  ): Promise<DeploymentConfigSummary> {
    return this.deploymentsService.getConfig(namespace, name);
  }

  @Patch(':name/config')
  @RequireAccess(AppSection.DEPLOYMENTS, AccessLevel.OPERATE)
  @ApiQuery({ name: 'namespace', required: true })
  @ApiParam({ name: 'name' })
  updateConfig(
    @Query('namespace') namespace: string,
    @Param('name') name: string,
    @Body() dto: UpdateDeploymentConfigDto,
  ): Promise<DeploymentConfigSummary> {
    return this.deploymentsService.updateConfig(namespace, name, dto);
  }
}
