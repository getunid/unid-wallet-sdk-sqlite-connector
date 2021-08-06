import { Entity, UpdateDateColumn, CreateDateColumn, BaseEntity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ orderBy: { 'created_at': 'ASC' } })
export class Base extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @CreateDateColumn({ type: 'datetime', nullable: false })
    createdAt!: Date

    @UpdateDateColumn({ type: 'datetime', nullable: false })
    updatedAt!: Date
}