const { SessionsClient } = require('@google-cloud/dialogflow-cx');
const fs = require('fs');
const projectId = 'chatbot-app-433407';
const location = 'global';
const agentId = '916068a5-3bf0-4557-a258-22aad662c891';


const path = require('path');
const keyFilename = path.join(__dirname, 'credentials.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilename;

const client = new SessionsClient();


async function detectIntent(req, res) {
    const { query, sessionId, languageCode } = req.body;
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId || 'default-session-id'
    );

    const request = {
        session: sessionPath,
        queryParams: {
            analyzeQueryTextSentiment: true
        },
        queryInput: {
          text: {
            text: query,
          },
          languageCode: languageCode || 'es',
        },
    };

    try {
      const [response] = await client.detectIntent(request);

      const messages = response.queryResult.responseMessages
        ? response.queryResult.responseMessages.map(msg => msg.text ? msg.text.text.join(' ') : '').join('\n')
        : 'No response messages found';
      
      const matchedIntent = response.queryResult.intent
        ? response.queryResult.intent.displayName
        : 'No intent matched';

      const currentPage = response.queryResult.currentPage
        ? response.queryResult.currentPage.displayName
        : 'No page available';

      const sentiment = response.queryResult.sentimentAnalysisResult
        ? {
            score: response.queryResult.sentimentAnalysisResult.score || 0,
            magnitude: response.queryResult.sentimentAnalysisResult.magnitude || 0
          }
        : { score: 0, magnitude: 0 };

      console.log('Agent response:', messages);

      res.json({
        agentResponse: messages,
        matchedIntent: matchedIntent,
        currentPage: currentPage,
        sentiment: sentiment
      });
    } catch (error) {
      console.error('Error detecting intent:', error.message);
      console.error('Error details:', error);
      res.status(500).json({ error: error.message });
    }
}

module.exports = { detectIntent };