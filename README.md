# AgenticAI-workflow-n8n-Hackathon

During the 12 hours Bosch Hackathon our team of three cam up with this first flow. We had two others which did not always work so I will not include them here. This one is enough to understand the basic concept. It is amazing how much we can learn under pressure. I just had one week exposure to n8n before coming to the hackathon and what you see here has been made in the first 6 hours. The second part has been spent experimenting with different voice models but in the end we had some bugs. The next step is definitely to replace the chat with a voice powered conversation.

## The Use case
We start with a basic chat box coded in plain javascript to save time. The user chooses from 5 scenarios and each of them is used to send a different prompt to the model. 
The use case is to train first responder in case of car accidents there is a automated call to the helpdesk. the llm Model will impersonate the victim. So we have 4 scenarios to choose from. when the conversation finishes we generate a transcript and a second model will evaluate the help desk human agent.

## The tech stack
We used n8n to be faster but langflow would also have been possible. For convenience we made a makefile to start and stop the containers. We have the n8n and the postgres database. We connect the caddy as reverse proxy to serve our app, and the front end will be exposed on http://localhost:8080.

From here the message entered will be sent to a webhook and the workflow will start in call mode, selecting the correct scenario and passing this information as prompt to the first agent which will use the chat model to create responses and save the history of the chat in the database. When the button to end the call is pressed then the workflow is routed to the second agent who will collect the chat and follow its promt to evaluate the conversation and give a rating.

## run the workflow

To run it simply clone the repo and add your open router apikey in the credentials. go to localhost:8080 and type a message. The microphone button is not enabled yet. Then press stop and wait for the results.



## n8n
n8n is a no code platform written in node.js with a front end in next.js. it enables to "easily" create agentic flows that can then be depoyed in applications.
