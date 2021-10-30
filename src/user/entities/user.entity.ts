import {
  AfterLoad,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Generated('uuid')
  username: string;

  @Index()
  @Column({ nullable: false, unique: true })
  name: string;

  @Index()
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false, select: false })
  salt: string;

  @Column({ default: true, select: false })
  active: boolean;

  @Column({ default: '/default.png', nullable: false })
  image: string;

  @AfterLoad()
  getImageUrl() {
    return (this.image = `${process.env.IMAGE_URL}${this.image}`);
  }

  @CreateDateColumn({ readonly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
