import { ClaimsRepository } from "./claimsRepository";
import {
  Claim,
  CreateClaimInput,
  UpdateClaimInput,
  CreateEnrichedClaimInput,
} from "../../types/claim";
import { ProjectsRepository } from "../projects/projectsRepository";
import { ValidationError, NotFoundError } from "../../utils/errors";

export class ClaimsService {
  private claimsRepository: ClaimsRepository;
  private projectsRepository: ProjectsRepository;

  constructor() {
    this.claimsRepository = new ClaimsRepository();
    this.projectsRepository = new ProjectsRepository();
  }

  async createClaim(input: CreateClaimInput): Promise<Claim> {
    const { projectId, claimPeriodStart, claimPeriodEnd, amount, status } =
      input;

    if (!projectId) {
      throw new ValidationError("ProjectId is required");
    }
    if (!claimPeriodStart) {
      throw new ValidationError("Claim Period Start is required");
    }
    if (!claimPeriodEnd) {
      throw new ValidationError("Claim Period End is required");
    }
    if (amount == null) {
      throw new ValidationError("Amount is required");
    }
    if (status && !["Draft", "Submitted"].includes(status)) {
      throw new ValidationError("Invalid status value");
    }
    if (isNaN(amount) || amount <= 0) {
      throw new ValidationError("Amount must be a positive number");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(claimPeriodStart)) {
      throw new ValidationError(
        "Claim Period Start must be in YYYY-MM-DD format",
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(claimPeriodEnd)) {
      throw new ValidationError(
        "Claim Period End must be in YYYY-MM-DD format",
      );
    }

    if (claimPeriodEnd < claimPeriodStart) {
      throw new ValidationError(
        "Claim Period End must be after Claim Period Start",
      );
    }

    const project = await this.projectsRepository.getProject(projectId);
    if (!project) throw new NotFoundError("Project not found");

    const enrichedInput: CreateEnrichedClaimInput = {
      projectId,
      claimPeriodStart,
      claimPeriodEnd,
      status,
      amount,
      companyName: project.companyName,
      projectName: project.projectName,
    };

    return this.claimsRepository.createClaim(enrichedInput);
  }

  async getClaim(claimId: string): Promise<Claim | null> {
    if (!claimId) throw new ValidationError("ClaimId is required");

    return this.claimsRepository.getClaim(claimId);
  }

  async getClaims(projectId?: string): Promise<Claim[]> {
    return this.claimsRepository.getClaims(projectId);
  }

  async updateClaim(
    claimId: string,
    updates: UpdateClaimInput,
  ): Promise<Claim> {
    if (!claimId) {
      throw new ValidationError("claimId is required");
    }

    const hasAnyFieldToUpdate = Object.values(updates).some(
      (v) => v !== undefined && v !== null,
    );
    if (!hasAnyFieldToUpdate) {
      throw new ValidationError("No valid fields provided for update");
    }

    const existing = await this.claimsRepository.getClaim(claimId);
    if (!existing) {
      throw new NotFoundError("Claim not found");
    }

    return this.claimsRepository.updateClaim(claimId, updates);
  }
}
