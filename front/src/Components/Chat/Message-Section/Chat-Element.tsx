import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { IconSend } from "@tabler/icons";

import { ChatInterface, ChannelsDatas} from "../../../Types/Datas-Examples";
import MessageItem from "./Message-Item";
import ChatHeader from "./Chat-Header";
import UsersSidebar from "./Users-Sidebar";

function ChatElement() {
    const [chatDatas, setChatDatas] = useState<ChatInterface | undefined>(undefined);
    const [showUsersSidebar, setShowUsersSidebar] = useState<boolean>(false);

    const changeSidebarStatus = () => {
        setShowUsersSidebar(!showUsersSidebar);
    }
    // const messagesEndRef = useRef<null | HTMLDivElement>(null);
    let params = useParams();

    // const scrollToBottom = () => {
    //     console.log(messagesEndRef);
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }
    // useEffect(() => {
    //     scrollToBottom()
    // }, [params]);

    useEffect(() => {
        if (params) {
            // Fetch to get Chat datas
            setChatDatas(ChannelsDatas.find((elem) => elem.id === parseInt(params.chatId!, 10)));
        }
    }, [params])

    return (chatDatas === undefined) ? (
        <div className="no-target-message">
            <p> Sélectionnez un message ou un channel </p>
        </div>
    ) : (
        <div className="message-container">
            <div className="message-container-main">
                <div className="message-wrapper">
                    <ChatHeader chatItem={chatDatas} showUsersSidebar={showUsersSidebar} changeSidebarStatus={changeSidebarStatus} />
                    <div className="ul-container">
                        <ul>
                            {
                                chatDatas!.messages.map((elem, index) =>
                                    <MessageItem key={index} sender={elem.sender} message={elem.message} />
                                )
                            }
                        </ul>
                        {/* <div ref={messagesEndRef} /> */}
                    </div>
                </div>
                <div className="message-input-container">
                    <input type="text" placeholder="Type Your Message..." />
                    <IconSend />
                </div>
            </div>
            { showUsersSidebar && chatDatas.isChannel && <UsersSidebar usersList={chatDatas.users} /> }
        </div>
    );
}

export default ChatElement;