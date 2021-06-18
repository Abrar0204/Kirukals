import React, { useEffect, useState } from "react";
//ChakraUI
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
	useDisclosure,
	Flex,
} from "@chakra-ui/react";
import { useSocket } from "../../../context/socketContext";
import { useGame } from "../../../context/gameContext";
const ChooseWord = ({ lobbyID }) => {
	const socket = useSocket();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const [words, setWords] = useState([]);
	const { updateData } = useGame();
	useEffect(() => {
		socket.on("choose-word", words => {
			setWords(words);
			onOpen();
		});
		socket.on("word-chosen", chosenWordLength => {
			updateData("chosenWordLength", chosenWordLength);
		});
	}, [socket, onOpen, updateData]);

	const chooseWord = word => {
		socket.emit("word-chosen", lobbyID, word);
		onClose();
	};
	return (
		<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Choose a Word</ModalHeader>
				<ModalBody>
					<Flex
						flexDirection="column"
						justifyContent="space-evenly"
						alignItems="center"
					>
						{words.map(word => (
							<Button
								key={word}
								onClick={() => chooseWord(word)}
								width="100%"
								margin="4"
							>
								{word}
							</Button>
						))}
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ChooseWord;
