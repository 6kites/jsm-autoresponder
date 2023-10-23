export { handler, adminHandler, projectSettingsHandler } from './resolvers';
export { issueCommentEventHandler, issueCreateEventHandler } from './events'

// Phil's old code

// import api, { fetch, route } from "@forge/api";

// export { handler } from "./resolvers";

// async function callChatGPT(issue_key, prompt) {
//   let url = "https://api.openai.com/v1/chat/completions?n=2";

//   // prompt = "What is the olympic record for highest attempted vault in mens pole vault?"
//   let body = {
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "user",
//         content: prompt,
//       },
//     ],
//     temperature: 0.7,
//   };

//   let options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "Bearer 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",
//     },
//     body: JSON.stringify(body),
//   };

//   let response = await fetch(url, options);

//   if (response.status > 299) {
//     console.log("OPEN API RESPONSE", response);
//     //throw `Failed to execute API call to ChatGPT: Status ${response}`
//     return { status: response.status, response: response };
//   }

//   let chat_response = await response.json();

//   let proposed_answer = chat_response.choices[0].message.content;
//   console.log("PROPOSED ANSWER", proposed_answer);

//   var prop_body = {
//     pending_response: proposed_answer,
//   };

//   let prop_name = "praecipio.jsmai";

//   console.log("BODY", prop_body);
//   console.log("STRINGIFIED", JSON.stringify(prop_body));

//   console.log("ISSUE KEY", issue_key);

//   const set_prop_resp = await api
//     .asApp()
//     .requestJira(
//       route`/rest/api/3/issue/${issue_key}/properties/${prop_name}`,
//       {
//         method: "PUT",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(prop_body),
//       },
//     );

//   //console.log("RESPONSE", set_prop_resp);
//   //console.log(await set_prop_resp.text());

//   console.log(
//     "SET PROPERTY RESPONSE",
//     `Response: ${set_prop_resp.status} ${set_prop_resp.statusText}`,
//   );
//   //console.log(await set_prop_resp.json());

//   return chat_response;
// }

// async function getIssueDetails(issueIdOrKey) {
//   const response = await api
//     .asApp()
//     .requestJira(route`/rest/api/3/issue/${issueIdOrKey}`, {
//       headers: {
//         Accept: "application/json",
//       },
//     });

//   if (response.status < 200 || response.status > 299) {
//     console.log(`Response: ${response.status} ${response.statusText}`);
//     return {};
//   } else {
//     let result = await response.json();
//     console.log(result);
//     return result;
//   }
// }

// async function addComment(issueIdOrKey, message) {
//   const requestUrl = route`/rest/api/3/issue/${issueIdOrKey}/comment`;
//   const body = {
//     body: {
//       type: "doc",
//       version: 1,
//       content: [
//         {
//           type: "paragraph",
//           content: [
//             {
//               text: message,
//               type: "text",
//             },
//           ],
//         },
//       ],
//     },
//   };

//   let response = await api.asApp().requestJira(requestUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   if (response.status !== 201) {
//     console.log(response.status);
//     throw `Unable to add comment to issueId: ${issueIdOrKey} Status: ${response.status}`;
//   }

//   return response.json();
// }

// async function setIssueProperty(issueIdOrKey, property, value) {
//   const requestUrl = route`/rest/api/3/issue/${issueIdOrKey}/properties/${property}`;
//   const body = value;

//   let response = await api.asApp().requestJira(requestUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(body),
//   });

//   if (response.status !== 201) {
//     console.log("ERROR SETTING PROPERTY", response.status);
//     //throw `Unable to add comment to issueId: ${issueIdOrKey} Status: ${response.status}`;
//   }

//   return response.json();
// }

// export async function run(event, context) {
//   console.log("Event Received!");
//   console.log(event);

//   let message = `${event.eventType} was detected`;

//   if (event.eventType === "avi:jira:commented:issue") {
//     if ("comment" in event && "jsdPublic" in event.comment) {
//       let publicComment = event.comment.jsdPublic ? "CUSTOMER" : "INTERNAL";
//       message = publicComment + " " + message;
//     }
//   }

//   console.log("------");
//   //console.log(event.changelog.items);
//   if ("associatedStatuses" in event) {
//     let fromStatus = event.associatedStatuses[0].name.toUpperCase();
//     let toStatus = event.associatedStatuses[1].name.toUpperCase();

//     console.log(`Issue Transitioned from ${fromStatus} to ${toStatus}`);
//     message += `\nIssue Transitioned from ${fromStatus} to ${toStatus}`;
//   }
//   console.log("------");

//   const response = await addComment(event.issue.id, message);

//   console.log(`Response: ${JSON.stringify(response)}`);
// }

// export async function another(event, context) {
//   console.log("Event Received - Another!");
//   console.log(event);

//   console.log("calling chat-gpt");

//   //console.log("ISSUE", event.issue);
//   //console.log("FIELDS", event.issue.fields);
//   //console.log("UPDATED ISSUE DESCRIPTION", event.issue.fields.description);

//   const details = await getIssueDetails(event.issue.key);

//   //console.log("ISSUE DETAILS", details);
//   //console.log("DESCRIPTION", details.fields.description);
//   let description = details.fields.description;
//   let content = description.content;

//   console.log("CONTENT", content);
//   console.log("FIRST", content[0]);
//   console.log("FIRST CONTENT", content[0].content);
//   console.log("TEXT", content[0].content[0].text);

//   let prompt = details.fields.description.content[0].content[0].text;

//   let chat_response = await callChatGPT(event.issue.key, prompt);

//   //console.log("CHATGPT RESPONSE", chat_response);
//   console.log("ANSWER", chat_response.choices[0].message.content);

//   let message = `${event.eventType} was detected`;

//   if (event.eventType === "avi:jira:commented:issue") {
//     if ("comment" in event && "jsdPublic" in event.comment) {
//       let publicComment = event.comment.jsdPublic ? "CUSTOMER" : "INTERNAL";
//       message = publicComment + " " + message;
//     }
//   }

//   console.log("------");
//   //console.log(event.changelog.items);
//   if ("associatedStatuses" in event) {
//     let fromStatus = event.associatedStatuses[0].name.toUpperCase();
//     let toStatus = event.associatedStatuses[1].name.toUpperCase();

//     console.log(`Issue Transitioned from ${fromStatus} to ${toStatus}`);
//     message += `\nIssue Transitioned from ${fromStatus} to ${toStatus}`;
//   }
//   console.log("------");

//   const response = await addComment(event.issue.id, message);

//   console.log(`Response: ${JSON.stringify(response)}`);
// }
