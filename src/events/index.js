import api, { route, properties } from '@forge/api';
import { ISSUE_PROPERTY_KEY, addComment, callChatGPT, getGptWithHistoryContext, getIssueDetails, getIssueTransitions, setIssueTransition } from '../utils'

export async function issueCommentEventHandler(event, context) {
  console.log("Event Received!");
  // console.log(JSON.stringify(event));
  const { project } = event.issue.fields
  const projectSettings = await properties.onJiraProject(project.key).get(ISSUE_PROPERTY_KEY.default)
  console.log({projectSettings})

  let message = `${event.eventType} was detected`;

  if (event.eventType === "avi:jira:commented:issue") {
    if ("comment" in event && "jsdPublic" in event.comment) {
      // let publicComment = event.comment.jsdPublic ? "CUSTOMER" : "INTERNAL";
      let publicComment = !event.selfGenerated ? "CUSTOMER" : "INTERNAL";
      message = publicComment + " " + message;
    }
    console.log("message: ", message)

    if (!event.selfGenerated) {
      const userPrompt = event.comment.body.content[0].content[0].text

      if(projectSettings?.autoresponseEnabled) {
        await autoReply(event.issue.key, userPrompt)
      } else {
        await properties.onJiraIssue(event.issue.key).set(ISSUE_PROPERTY_KEY.prompt, userPrompt)
        const answer = await getGptResponseWithHistoricalContext(event.issue.key, userPrompt); 
        await properties.onJiraIssue(event.issue.key).set(ISSUE_PROPERTY_KEY.default, {ai_response: answer})
      }
    }
  }
}

export async function issueCreateEventHandler(event, context) {
  console.log("issue created")
  const { issue } = event
  const { project } = event.issue.fields
  const projectSettings = await properties.onJiraProject(project.key).get(ISSUE_PROPERTY_KEY.default)
  const issueDetails = await getIssueDetails(issue.key);
  console.log({projectSettings})
  const description = issueDetails.fields.description.content[0].content[0].text;
  if(projectSettings?.autoresponseEnabled) {
    await autoReply(event.issue.key, description)
    // const { status } = issueDetails.fields
    // console.log({status})
    const transitionName = "Respond to customer"
    // if (status.name !== transitionName) {
    // }
    await transitionIssue(event.issue.key, transitionName);
  } else {
    const aiResponse = await callChatGPT(description)
    const aiAnswer = aiResponse.choices[0].message.content
    await properties.onJiraIssue(issue.key).set(ISSUE_PROPERTY_KEY.default, {ai_response: aiAnswer})
  }

  async function transitionIssue(key, name) {
    const transitions = await getIssueTransitions(key);
    const transition = transitions.transitions.find((t) => t.name === name);
    await setIssueTransition(issue.key, transition.id);
  }
}

async function autoReply(issueKey, userPrompt) {
  console.log("auto replying")
  const answer = await getGptResponseWithHistoricalContext(issueKey, userPrompt)
  await addComment(issueKey, answer)
}

async function getGptResponseWithHistoricalContext(issueKey, userPrompt) {
  var { response, chatHistory } = await getGptWithHistoryContext(issueKey, userPrompt);
  const answer = response.choices[0].message.content;
  // const answer = await callGPTService(userPrompt)
  console.log({ userPrompt, answer });
  chatHistory.push({ user: userPrompt });
  chatHistory.push({ assistant: answer });
  await properties.onJiraIssue(issueKey).set(ISSUE_PROPERTY_KEY.chatHistory, chatHistory);
  return answer;
}
