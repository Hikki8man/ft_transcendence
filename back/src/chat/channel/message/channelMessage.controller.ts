import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ChatGateway } from "src/chat/gateway/chat.gateway";
import { User } from "src/typeorm";
import { GetUser } from "src/utils/decorators";
import { InChannelGuard } from "../guards";
import { ChannelMessageService } from "./ChannelMessage.service";
import { ChannelMessageDto, MessageToSkipDto } from "./dto/channelMessage.dto";

@Controller('channel')
export class ChannelMessageController {
	constructor(
		private messageService: ChannelMessageService,
	) {}

	// @Post()
	// @UseGuards(JwtGuard)
	// async createMessage(
	// @Param('id') chanId: number,
	// @GetUser() user: User,
	// @Body() msg: ChannelMessageDto) {
	// 	return await this.messageService.create(user, msg);
	// }

	@Post(":chanId/messages")
	@UseGuards(JwtGuard, InChannelGuard)
	async getMessages(
	@Param('chanId') chanId: number,
	@Body() data: MessageToSkipDto,
	) {
		const msg = await this.messageService.getMessages(chanId, data.skip);
		// this.chatGateway.sendChannelMessages(data.socketId, msg);
		return msg;
	}
}

