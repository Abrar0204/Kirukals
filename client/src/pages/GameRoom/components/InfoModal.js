import React from "react";

import useWaitForWord from "../hooks/useWaitForWord";
import useChooseWord from "../hooks/useChooseWord";
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
	Text,
} from "@chakra-ui/react";

const InfoModal = ({ lobbyID }) => {
	const { isOpen, onClose, onOpen } = useDisclosure();

	const [words, chooseWord] = useChooseWord(onOpen, onClose, lobbyID);
	const playerName = useWaitForWord(onOpen, onClose);

	return (
		<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					{words.length > 0 ? "Choose a Word" : "Please Wait"}
				</ModalHeader>
				<ModalBody>
					{words.length > 0 ? (
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
					) : (
						<Text margin="4">{playerName} is choosing a word.</Text>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default InfoModal;
