# AgenticAI-workflow-n8n-Hackathon

During the 12 hours Bosch Hackathon our team of three cam up with this first flow. We had two others which did not always work so I will not include them here. This one is enough to understand the basic concept.

## The Use case
We start with a basic chat box coded in plain javascript to save time. The user chooses from 5 scenarios and each of them is used to send a different prompt to the model. 
The use case is to train first responder in case of car accidents there is a automated call to the helpdesk. the llm Model will impersonate the victim. So we have 4 scenarios to choose from. when the conversation finishes we generate a transcript and a second model will evaluate the help desk human agent.

## The teck stack
We used n8n to be faster but langflow would also have been possible. For convenience we made a makefile to start and stop the containers. We have the n8n and the postgres database. We connect the caddy as reverse proxy to serve our app, and the front end will be exposed on http://localhost:8080.

