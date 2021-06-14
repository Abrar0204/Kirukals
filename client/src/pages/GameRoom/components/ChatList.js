import React from "react";

const ChatList = ({ chats }) => {
	return (
		<div>
			{chats.map(({ msg, sender, playerName }, index) => (
				<p key={index + sender}>
					{playerName} said {msg}
				</p>
			))}
		</div>
	);
};

export default ChatList;
