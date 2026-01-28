// src/document/document.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { DocumentService } from "./document.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Controller("documents")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.documentService.create(dto);
  }

  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("Student", ParseIntPipe) studentid ,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.documentService.findAll(+studentid,skip, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.documentService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateDocumentDto) {
    return this.documentService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.documentService.remove(id);
  }

  @Get("search")
  search(
    @Query("q") query: string,
    @Query("skip", ParseIntPipe) skip = 0,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.documentService.search(query, skip, limit);
  }
}
