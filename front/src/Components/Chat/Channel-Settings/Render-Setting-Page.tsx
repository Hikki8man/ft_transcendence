import ChannelInvitations from "./Channel-Invitations";
import ChannelUsers from "./Channel-Users";
import GlobalSettings from "./Global-Settings";
import { Channel } from "../../../Types/Chat-Types";

function RenderSettingPage(props: {item: string, channelDatas: Channel}) {
    const { item, channelDatas } = props;

    if (item === "Invitations") {
        return (
            <ChannelInvitations />
        );
    } else if (item === "Settings") {
        return (
            <GlobalSettings chanDatas={channelDatas} />
        );
    } else {
        return (
            <ChannelUsers users={channelDatas.channelUsers} />
        );
    }
}

export default RenderSettingPage;