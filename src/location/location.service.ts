// ../location/location.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { PayloadDto } from "../auth/dto/auth.dto";

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService,
     private activityLogService: ActivityLogService,
  ) {}

  async create(dto: CreateLocationDto , user : PayloadDto) {
    const create =  this.prisma.location.create({ data: dto });

     // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'CREATE Location',
        description: `User ${user.fullName} his email ${user.email}  created a new location  ${dto.region}  `,
      } as any); 

      return create;
  }

  async findAll() {
    return this.prisma.location.findMany({
      include: { students: true },
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: { students: true },
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(id: number, dto: UpdateLocationDto , user: PayloadDto) {
    const update =  this.prisma.location.update({
      where: { id },
      data: dto,
    });


     // create a simple activity log: user created (logged against the created user)
      await this.activityLogService.create({
        userId: user.id,
        action: 'UPDATE Location',
        description: `User ${user.fullName} his email ${user.email}  update location Id  ${id}  `,
      } as any); 


      return update;

  }

  async remove(id: number , user : PayloadDto) {
    const d = this.prisma.location.delete({ where: { id } });

        await this.activityLogService.create({
        userId: user.id,
        action: 'Delete Location',
        description: `User ${user.fullName} his email ${user.email}  Delete location Id  ${id}  `,
      } as any); 

      return d;

  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.location.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { region: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { students: true },
      skip,
      take: limit,
    });
  }
}
