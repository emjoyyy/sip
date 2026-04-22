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

 @Column({ nullable: true })
 requirements!: string;

 @Column({ nullable: true })
 location!: string;

 @Column({ nullable: true })
 salaryRange!: string;

 @Column()
 jobType!: string;

 @ManyToOne(() => User)
 company!: User;

}