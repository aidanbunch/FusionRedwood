import React from "react";
import axios from "axios";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Flex,
  Spacer,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import AssignmentCard from "../../components/AssignmentCard";
import BackButton from "../../components/BackButton";

export async function getServerSideProps(context) {
  const classroomID = context.params.classroom;
  const userToken = context.query.userToken;
  const className = context.query.className;
  const color = context.query.bgColor;

  

  try {
    const response = await axios.get(
      `https://edpuzzle.com/api/v3/assignments/classrooms/${classroomID}/students?needle=`,
      {
        headers: {
          Cookie: `G_ENABLED_IDPS=google; token=${userToken}; G_AUTHUSER_H=2`,
          "x-edpuzzle-web-version": "7.31.320.9991544718109210",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15",
          "x-edpuzzle-referrer": `https://edpuzzle.com/classes`,
        },
      }
    );
    const titles = response.data.medias;
    const assignments = response.data.teacherAssignments;
    const assignmentsJSON = [];

    assignments.forEach((assignment) => {
      const assignmentsObj = {};
      assignmentsObj["assignmentTeacherId"] = assignment.contentId;
      assignmentsObj["assignmentId"] = assignment._id;
      titles.forEach((title) => {
        if (assignment.contentId === title._id) {
          assignmentsObj["assignmentTitle"] = title.title;
        }
      });
      assignmentsJSON.push(assignmentsObj);
    });

    // return assignmentsJSON;
    return {
      props: {
        assignmentsData: assignmentsJSON,
        className: className,
        color: color,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        assignmentsData: [],
        className: className,
        color: color,
      },
    };
  }
}

export default function Classroom({ assignmentsData, className, color }) {
  console.log(assignmentsData);
  return (
    <Box m={100}>
      <VStack spacing={20}>
        <Flex w="100%">
          <BackButton />
          <Spacer />

          <HStack align mx={10}>
            <Heading color={`${color}`} size="xl">
              {className}
            </Heading>
            <Heading size="xl"> assignments</Heading>
          </HStack>

          <Spacer />
        </Flex>

        {/* <AssignmentCard assignmentTitle={assignment} color={color} /> */}

        <VStack spacing={20}>
          {assignmentsData.length > 0 &&
            assignmentsData.map((assignment, index) => (
              <AssignmentCard
                key={index}
                color={color}
                assignmentTitle={assignment.assignmentTitle}
                assignmentID={assignment.assignmentTeacherId}
              />
            ))}
        </VStack>
      </VStack>
    </Box>
  );
}
