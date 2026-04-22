import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Job {

 @PrimaryGeneratedColumn()
 id!: number;

 @Column()
 title!: string;

 @Column()
 description!: string;

 @Column({ type: "text", nullable: true })
 requirements!: string | null;

 @Column({ type: "varchar", length: 255, nullable: true })
 location!: string | null;

 @Column({ type: "varchar", length: 255, nullable: true })
 salaryRange!: string | null;

 @Column()
 jobType!: string;

 @ManyToOne(() => User)
 company!: User;

}