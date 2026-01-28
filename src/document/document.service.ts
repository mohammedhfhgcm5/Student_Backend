// src/document/document.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentDto) {
    return this.prisma.document.create({ data: dto });
  }

  async findAll( studentId : number ,skip = 0, limit = 10) {
    return this.prisma.document.findMany({
      where: {studentId},
      include: { student: true },
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { student: true },
    });
    if (!doc) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return doc;
  }

  async update(id: number, dto: UpdateDocumentDto) {
    return this.prisma.document.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.document.delete({ where: { id } });
  }

  async search(query: string, skip = 0, limit = 10) {
    return this.prisma.document.findMany({
      where: {
        OR: [
          { fileType: { contains: query, mode: "insensitive" } },
          { filePath: { contains: query, mode: "insensitive" } },
          { student: { fullName: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: { student: true },
      skip,
      take: limit,
    });
  }
}
