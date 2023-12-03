import React, { createRef, useEffect, useState } from "react";
import axios from "axios";
import QuestionAnswerCard from "../../components/QuestionAnswerCard.js";
import {
	removeBackslashes,
	replaceHTMLTags,
} from "../../utils/replace-text.js";
import { supabase } from "../../utils/supabaseClient.js";

import {
	Box,
	Heading,
	VStack,
	HStack,
	Flex,
	Spacer,
	Button,
	Center,
	useColorModeValue,
	useBreakpointValue,
	useToast,
	Text,
	Wrap,
} from "@chakra-ui/react";
import BackButton from "../../components/BackButton";
import Head from "next/head";
import { returnIndex } from "../../utils/return-index.js";
import { useUser } from "../../context/user.js";

export async function getServerSideProps(context) {
	var questionJSON = [];
	const color = context.query.color;
	const assignmentTitle = context.query.assignmentTitle;
	const attemptId = context.query.attemptId;
	const userToken = context.query.userToken;
	const classroomID = context.query.classroomID;
	const assignmentID = context.query.assignmentID;
	const contentId = context.query.contentId;

	try {
		// only works with public edpuzzles now, private will fail
		const response = await axios.get(
			`https://edpuzzle.com/api/v3/media/${contentId}`,
			{
				headers: {
					Cookie: `G_ENABLED_IDPS=google; G_AUTHUSER_H=2`,
					"x-edpuzzle-web-version": "7.31.320.9991544718109210",
					"User-Agent":
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15",
					"x-edpuzzle-referrer": `https://edpuzzle.com/classes`,
				},
			}
		);
		const questions = response.data.questions;

		questions.forEach((question) => {
			console.log(question);
			if (question.type === "open-ended") {
				// no answer -> need openai
				const questionObj = {};

				const openEndedAnswer = "";
				questionObj["bodyDisplay"] = removeBackslashes(question.body[0].html);
				questionObj["body"] = replaceHTMLTags(question.body[0].html);
				questionObj["type"] = question.type;
				questionObj["id"] = question._id;

				questionObj["openEndedAnswer"] = openEndedAnswer;

				questionJSON.push(questionObj);
			} else {
				// is multiple choice
				const questionObj = {};
				questionObj["bodyDisplay"] = removeBackslashes(question.body[0].html);
				questionObj["body"] = replaceHTMLTags(question.body[0].html);
				questionObj["type"] = question.type;
				questionObj["id"] = question._id;

				const qChoices = question.choices;
				const correctChoices = [];
				qChoices.forEach((choice) => {
					if (choice.isCorrect === true) {
						const choiceObj = {
							choiceText: `${removeBackslashes(choice.body[0].html)}`,
							choiceNumber: `${choice.choiceNumber}`,
							choiceID: `${choice._id}`,
						};

						correctChoices.push(choiceObj);
					}
				});

				questionObj["correctChoices"] = correctChoices;
				questionJSON.push(questionObj);
			}
		});

		return {
			props: {
				answers: questionJSON,
				color: color,
				assignmentTitle: assignmentTitle,
				attemptId: attemptId,
				userToken: userToken,
			},
		};
	} catch (err) {
		return {
			props: {
				answers: [],
				color: color,
				assignmentTitle:
					"unfortunately, edpuzzle patched solving private edpuzzles. unpuzzle should still work on public edpuzzles",
			},
		};
	}
}

export default function Assignment({
	answers,
	color,
	assignmentTitle,
	attemptId,
	userToken,
}) {
	const [elRefs, setElRefs] = useState([]);
	const { user } = useUser();

	useEffect(() => {
		setElRefs((elRefs) => answers.map((_, i) => elRefs[i] || createRef()));
	}, []);

	const [isLoading, setIsLoading] = React.useState(false);
	const toast = useToast();

	const submitAnswers = async () => {
		let arrayRefCount = 0;

		let noError = true;
		setIsLoading(true);

		var csrf = "blank";

		// console.log(attemptId);

		// auto complete video

		await axios
			.post("/api/get-csrf", { userToken: userToken })
			.then(async (response) => {
				csrf = response.data.CSRFToken;
				await axios.post("/api/complete-video", {
					attemptId: attemptId,
					userToken: userToken,
					csrf: csrf,
				});
			});

		const count = answers.length;
		if (count == 0 && noError) {
			setIsLoading(false);
			toast({
				title: "Completed assignment.",
				description: "We've submitted the answers for you.",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
		}

		for (let question of answers) {
			if (question.type === "open-ended") {
				const openEndedAns =
					elRefs[arrayRefCount].getElementsByClassName("chakra-textarea")[0]
						.value;

				const response = await axios
					.post("/api/complete-questions", {
						type: question.type,
						attemptId: attemptId,
						questionId: question.id,
						userToken: userToken,
						csrf: csrf,
						openEndedBody: question.body,
						openEndedAnswer: openEndedAns,
					})
					.catch((error) => {
						noError = false;
					});

				count -= 1;

				if (count == 0 && noError) {
					setIsLoading(false);
					toast({
						title: "Completed assignment.",
						description: "We've submitted the answers for you.",
						status: "success",
						duration: 9000,
						isClosable: true,
					});
				}
			} else {
				const response = await axios
					.post("/api/complete-questions", {
						type: question.type,
						attemptId: attemptId,
						questionId: question.id,
						userToken: userToken,
						correctChoices: question.correctChoices,
						csrf: csrf,
					})
					.catch((error) => {
						noError = false;
					});

				count -= 1;

				if (count == 0 && noError) {
					setIsLoading(false);
					toast({
						title: "Completed assignment.",
						description: "We've submitted the answers for you.",
						status: "success",
						duration: 9000,
						isClosable: true,
					});
				}
			}
			arrayRefCount += 1;
		}
		if (!noError) {
			setIsLoading(false);
			toast({
				title: "Error submitting answers.",
				description: "Sorry, we ran into some trouble submitting your answers.",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
		await supabase.rpc("increment_solved_edpuzzles");
		if (user) {
			await supabase.rpc("increment_user_solved_edpuzzles", {
				client_id: user.id,
			});
		}
	};

	return (
		<>
			<Head>
				<title>Answers</title>
			</Head>
			<Box m={10}>
				<VStack spacing={0}>
					<Flex w="100%">
						<BackButton />
						<Spacer />

						<HStack align mx={10}>
							<Wrap>
								<Heading color={`${color}`} size="xl">
									{assignmentTitle}
								</Heading>
								<Heading color={useColorModeValue("black", "white")} size="xl">
									{" "}
									answers
								</Heading>
							</Wrap>
						</HStack>

						<Spacer />
					</Flex>

					<VStack spacing={-5}>
						<Button
							onClick={() => submitAnswers()}
							m={10}
							loadingText={"Submitting answers..."}
							isLoading={isLoading}
							w={answers.length > 0 ? "40%" : "100%"}
							minW={"250px"}
							h={"8vh"}
							colorScheme="blue"
							rounded={"3xl"}
						>
							<Text
								fontSize={useBreakpointValue({ base: "lg", md: "xl" })}
								fontWeight={"semibold"}
							>
								Finish assignment for me
							</Text>
						</Button>

						<VStack spacing={0}>
							{answers.map((question, index) => (
								<div key={index} ref={(el) => (elRefs[index] = el)}>
									<QuestionAnswerCard
										key={index}
										question={question}
										assignmentTitle={assignmentTitle}
										number={returnIndex(index + 1, 3)}
									/>
								</div>
							))}
						</VStack>
					</VStack>
				</VStack>
			</Box>
		</>
	);
}
