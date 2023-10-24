import api, { fetch, route, properties } from '@forge/api';

export const Modes = { view: "VIEW", edit: "EDIT" };
export const issuePropertyKey = "praecipio.jsmai";
export const ISSUE_PROPERTY_KEY = { 
  default: issuePropertyKey,
  prompt: `${issuePropertyKey}.prompt`,
  chatHistory: `${issuePropertyKey}.chatHistory`,
}

export async function getProjects({typeKey="service_desk", startAt=0, maxResults=50}={}) {
  const queryParams = new URLSearchParams({typeKey, startAt, maxResults});
  const response = await api
    .asApp()
    .requestJira(route`/rest/api/3/project/search?${queryParams}`, {
      headers: {
        Accept: "application/json",
      },
    });

  if (response.status < 200 || response.status > 299) {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return {};
  } else {
    const result = await response.json();
    const projects = result?.values?.map(project => ({ key: project.key, name: project.name }));

    return projects
  }
}

export async function getIssueDetails(key) {
  const response = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue/${key}`, {
      headers: {
        Accept: "application/json",
      },
    });

  if (response.status < 200 || response.status > 299) {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return {};
  } else {
    const result = await response.json();
    // console.log(result);
    return result;
  }
}

export async function getIssueTransitions(key) {
  const response = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue/${key}/transitions`, {
      headers: {
        Accept: "application/json",
      },
    });

  if (response.status < 200 || response.status > 299) {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return {};
  } else {
    const result = await response.json();
    return result;
  }
}

export async function setIssueTransition(key, id) {
  const body = { transition: { id } }
  const response = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue/${key}/transitions`, {
      method: "POST",
      headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
      },
      body: JSON.stringify(body)
    });

  if (response.status < 200 || response.status > 299) {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return {};
  } else {
    return response.status;
  }
}

export async function getIssueProperty(key, prop) {
  const requestUrl = route`/rest/api/3/issue/${key}/properties/${prop}`;

  const response = await api.asApp().requestJira(requestUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("GET ISSUE PROP STATUS", response.status);

  if (response.status < 199 || response.status >= 300) {
    console.log("ERROR STATUS");
    return null;
  } else {
    let data = await response.json();
    console.log("DATA", data);
    return data;
  }
}

export async function callChatGPT(prompt) {
  let url = "https://api.openai.com/v1/chat/completions?n=2";
  // let url = "https://mazin.ngrok.io/v1/chat/completions?n=2";

  let body = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  };

  // note - token will need to be added via secrets manager
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer XXXXXXXXXXXXXXXXXXXXXXX",
    },
    body: JSON.stringify(body),
  };

  let response = await fetch(url, options);

  if (response.status > 299) {
    console.log("OPEN API RESPONSE", response);
    //throw `Failed to execute API call to ChatGPT: Status ${response}`
    return { status: response.status, response: response };
  }

  let chat_response = await response.json();
  return chat_response;

  // let proposed_answer = chat_response.choices[0].message.content;
  // console.log("PROPOSED ANSWER", proposed_answer);

  // var prop_body = {
  //   pending_response: proposed_answer,
  // };

  // return await update(prop_body, issue_key, chat_response);
}

export async function callChatGPTWithContext(messages) {
  let url = "https://api.openai.com/v1/chat/completions?n=2";
  // let url = "https://mazin.ngrok.io/v1/chat/completions?n=2";

  let body = {
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
  };

  // note - token will need to be added via secrets manager
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    },
    body: JSON.stringify(body),
  };

  let response = await fetch(url, options);

  if (response.status > 299) {
    console.log("OPEN API RESPONSE", response);
    //throw `Failed to execute API call to ChatGPT: Status ${response}`
    return { status: response.status, response: response };
  }

  let chat_response = await response.json();
  return chat_response;
}

export async function getGptWithHistoryContext(issueKey, userPrompt) {
  let chatHistory = await properties.onJiraIssue(issueKey).get(ISSUE_PROPERTY_KEY.chatHistory) || [];
  // console.log({chatHistory})
  const messages = buildMessages(chatHistory, userPrompt);
  const response = await callChatGPTWithContext(messages);
  return { response, chatHistory };
}

function buildMessages(chatHistory, prompt) {
  const messages = chatHistory.map((chat) => {
    for (const key in chat) return { role: key, content: chat[key] }
  })
  const message = { role: 'user', content: prompt}
  messages.push(message)
  return messages
}

export async function setIssueProperty(issueKey, propertyKey, value) {
  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/issue/${issueKey}/properties/${propertyKey}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      }
    );

    if (response.status !== 201) {
      console.log("ERROR SETTING PROPERTY", response.status);
      //throw `Unable to add comment to issueId: ${issueIdOrKey} Status: ${response.status}`;
    }

  return response;
}

export async function deleteIssueProperty(issueKey, propertyKey) {
  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/issue/${issueKey}/properties/${propertyKey}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      }
    );
  
  return response;
}

export async function updateIssuePropertyWithAIResponse(issueKey, prompt) {
  const chat_response = await callChatGPT(prompt);
  let proposed_answer = chat_response.choices[0].message.content;
  console.log("PROPOSED ANSWER", proposed_answer);

  var body = {
    pending_response: proposed_answer,
  };
  let propertyKey = issuePropertyKey;

  console.log("BODY", body);
  console.log("STRINGIFIED", JSON.stringify(body));

  console.log("ISSUE KEY", issueKey);

  const set_prop_resp = await setIssueProperty(issueKey, propertyKey, body)
  console.log(
    "SET PROPERTY RESPONSE",
    `Response: ${set_prop_resp.status} ${set_prop_resp.statusText}`
  );
}

export async function addComment(issueIdOrKey, message) {
  const requestUrl = route`/rest/api/3/issue/${issueIdOrKey}/comment`;
  const body = {
      "body": {
          "type": "doc",
          "version": 1,
          "content": [
              {
                  "type": "paragraph",
                  "content": [
                      {
                          "text": message,
                          "type": "text"
                      }
                  ]
              }
          ]
      }
  };

  // Use the Forge Runtime API to fetch data from an HTTP server using your (the app developer) Authorization header
  let response = await api.asApp().requestJira(requestUrl, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
  });

  // Error checking: the Jira issue comment Rest API returns a 201 if the request is successful
  if (response.status !== 201) {
      console.log(response.status);
      throw `Unable to add comment to issueId ${issueIdOrKey} Status: ${response.status}.`;
  }

  return response;
}
