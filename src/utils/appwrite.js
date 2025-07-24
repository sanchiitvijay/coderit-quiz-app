import { Client, Databases, Storage, Account, ID } from 'appwrite'

const client = new Client()
const databases = new Databases(client)
const storage = new Storage(client)
const account = new Account(client)

// Configure your Appwrite endpoint and project ID from environment variables
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collections: {
    quizzes: import.meta.env.VITE_APPWRITE_COLLECTION_QUIZZES_ID,
    questions: import.meta.env.VITE_APPWRITE_COLLECTION_QUESTIONS_ID,
    results: import.meta.env.VITE_APPWRITE_COLLECTION_RESULTS_ID
  },
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID
}

export { client, databases, storage, account, ID }