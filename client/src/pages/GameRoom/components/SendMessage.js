import React, { useState } from "react";

const SendMessage = ({ sendMessage }) => {
	const [message, setMessage] = useState("");
	const handleInput = e => {
		const { value } = e.target;
		setMessage(value);
	};

	const sendMessageHandler = e => {
		e.preventDefault();
		sendMessage(message);
		setMessage("");
	};
	return (
		<form onSubmit={sendMessageHandler}>
			<div>
				<label htmlFor="message">Message</label>
				<input
					name="message"
					type="text"
					value={message}
					onChange={handleInput}
				/>
			</div>
			<button type="submit">Send</button>
		</form>
	);
};

export default SendMessage;
