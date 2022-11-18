import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ChannelUser } from "src/typeorm";
import { ChannelPermissionException } from "src/utils/exceptions";
import { channelRole } from "src/utils/types/types";

// TODO: do it better than that
@Injectable()
export class ChannelPermissionGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const channelUser: ChannelUser = context.switchToHttp().getRequest().channelUser;
		if (channelUser.role === channelRole.MODERATOR || channelRole.OWNER )
			return true;
		throw new ChannelPermissionException();
	}
}