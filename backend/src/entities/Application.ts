import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Job } from "./Job";

@Entity()
export class Application {

 @PrimaryGeneratedColumn()
 id!: number;

 @Column({ default: "pending" })
 status!: string;

 @Column({ nullable: true })
 coverLetter!: string;

 @ManyToOne(() => User)
 student!: User;

@ManyToOne(() => Job, { onDelete: "CASCADE" })
job!: Job;

}