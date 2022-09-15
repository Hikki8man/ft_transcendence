import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";
import { Friendship, friendShipStatus } from "src/entities/friendship.entity";
import { Statistic } from "src/entities/statistic.entity";
import { Avatar } from "src/entities/avatar.entity";
import { AuthService } from "src/auth/auth.service";
import { use } from "passport";
import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepo: Repository<User>,
		@InjectRepository(Friendship)
		private friendshipsRepo: Repository<Friendship>,
		@InjectRepository(Statistic)
		private statisticsRepo: Repository<Statistic>,
		@Inject(forwardRef(() => AuthService))
		private authService: AuthService,
	) {}

	async create(userdto: CreateUserDto) {
		try {
			const user = this.usersRepo.create(userdto);
			user.statistic = await this.statisticsRepo.save(new Statistic());
			await this.usersRepo.save(user);
			return user;

		} catch (error) {
			if (error.code === '23505') {
				throw new ForbiddenException('Username taken');
			}
			throw error;
		}
	}
	
	async findById(id: number): Promise<User | undefined> {
		const user = await this.usersRepo.findOneBy({ id });
		if (!user)
			throw new NotFoundException('Username not found');
		return user
	}

	async findBy42Id(id42: number): Promise<User | undefined> {
		return await this.usersRepo.findOneBy({ id42 });
	}

	async findByUsername(username: string): Promise<User | undefined> {
		return await this.usersRepo.findOneBy({ username });
	}

	async editUsername(user: User, name: string) {
		try {
			user.username = name;
			await this.usersRepo.save(user);
			return {
				token: (await this.authService.signToken(user.id, user.username)).access_token,
				user: user,
			}
		} catch(error) {
			console.log(error.message);
			throw new ForbiddenException();
		}
	}

	async getUsers() {
		return await this.usersRepo.find();
	}

	async getFriendlist(user: User) {
		const rawFriendList = await this.friendshipsRepo.find({
			relations: {
				requester: true,
				addressee: true
			},
			where: [
				{ requester: user, status: 'accepted' },
				{ addressee: user, status: 'accepted' }
			]
		});
		let friendList: User[] = [];
		rawFriendList.forEach((friendship) => {
			if (friendship.requester.id === user.id) {
				friendList.push(friendship.addressee);
			} else {
				friendList.push(friendship.requester);
			}
		});
		return friendList;
	}

	async sendFriendRequest(requester: User, addressee: User) {
		return this.friendshipsRepo.save({ requester, addressee, status: 'requested' });
	}

	async respondFriendRequest(addressee: User, requester: User, status: friendShipStatus) {
		const friendship = await this.friendshipsRepo.findOne({
			where: { addressee, requester, status: 'requested' },
		});
		if (!friendship) {
			throw new Error('Request not found');
		}
		friendship.status = status;
		return this.friendshipsRepo.save(friendship);
	}

	async addWin(user: User) {
		user.statistic.matchWon++;
		await this.usersRepo.save(user);
	}

	async addLoss(user: User) {
		user.statistic.matchLost++;
		await this.usersRepo.save(user);
	}

	async updateAvatar(user: User, fileName: string) {
		user.avatar = fileName;
		await this.usersRepo.save(user);
	}
}