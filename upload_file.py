import os
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import CharacterTextSplitter


os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["PINECONE_API_KEY"] = os.getenv("PINECONE_API_KEY")

index_name = "corpus"
embeddings = OpenAIEmbeddings()

loader = DirectoryLoader("./uploads")
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
docs = text_splitter.split_documents(documents)

vectorstore_from_docs = PineconeVectorStore.from_documents(
    docs, index_name=index_name, embedding=embeddings
)
print(vectorstore_from_docs)
