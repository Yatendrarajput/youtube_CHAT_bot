from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

class RAGService:
    def __init__(self):
        # Store vector stores for each video (in-memory)
        self.vector_stores = {}
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
        
        # Prompt template
        self.prompt = PromptTemplate(
            template="""
            You are a helpful assistant that answers questions about YouTube videos.
            If there is text explain then summarize the video.
            Answer ONLY from the provided transcript context.
            If the context is insufficient, just say you don't know.
            Be concise and clear in your responses. Remember the name of the people involved in the video if there are present.

            Context:
            {context}
            
            Question: {question}
            
            Answer:
            """,
            input_variables=['context', 'question']
        )
    
    def process_transcript(self, video_id: str, transcript: str) -> int:
        """
        Process transcript: split, embed, store in vector DB
        Returns number of chunks created
        """
        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, 
            chunk_overlap=200
        )
        chunks = splitter.create_documents([transcript])
        
        # Create FAISS vector store
        vector_store = FAISS.from_documents(chunks, self.embeddings)
        
        # Store in memory
        self.vector_stores[video_id] = vector_store
        
        return len(chunks)
    
    def answer_question(self, video_id: str, question: str) -> str:
        """
        Answer question using RAG pipeline
        """
        # Check if video is processed
        if video_id not in self.vector_stores:
            raise Exception("Video not processed. Please process the video first.")
        
        vector_store = self.vector_stores[video_id]
        retriever = vector_store.as_retriever(
            search_type="similarity", 
            search_kwargs={"k": 4}
        )
        
        # Format docs helper
        def format_docs(retrieved_docs):
            return "\n\n".join(doc.page_content for doc in retrieved_docs)
        
        # Build RAG chain
        chain = (
            RunnableParallel({
                'context': retriever | RunnableLambda(format_docs),
                'question': RunnablePassthrough()
            })
            | self.prompt
            | self.llm
            | StrOutputParser()
        )
        
        # Get answer
        answer = chain.invoke(question)
        return answer