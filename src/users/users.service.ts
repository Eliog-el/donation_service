import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { firstName, lastName, email, password, phoneNumber } =
        createUserDto;
      const user = new User();

      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.password = await this.hashingService.hash(password);

      const newUser = await this.usersRepository.save(user);

      return newUser;
    } catch (err) {
      const uniqueViolationErrorCode = 'ER_DUP_ENTRY';
      if (err.code === uniqueViolationErrorCode) {
        return { error: 'Email already exists' } as any;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return user;
  }

  async getUserProfile(email: string, id: string) {
    const userRepository = this.dataSource.getRepository(User);

    const columns = userRepository.metadata.columns
      .filter((column) => column.propertyName !== 'password')
      .map((column) => `user.${column.propertyName}`);

    const profileData = await userRepository
      .createQueryBuilder('user')
      .select(columns)
      .where('user.id = :id OR user.email = :email', { id: id, email: email })
      .getOne();

    console.log(profileData);

    return profileData;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async save(user: User): Promise<User> {
    console.log('in herer');
    const userDeatils = await this.usersRepository.save(user);
    delete userDeatils.password; // Remove password before returning
    delete userDeatils.transactionPin;

    return userDeatils;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
