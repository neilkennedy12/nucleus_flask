import os
from dotenv import load_dotenv
import pinecone

if __name__ == "__main__":
    load_dotenv()
    pc = pinecone.Pinecone(os.getenv("PINECONE_API_KEY"))
    # Print stats about the index
    index = pc.Index("corpus")
    print(f"\nIndex Statistics:")
    print(
        f"Total vectors in index: {index.describe_index_stats()['total_vector_count']}"
    )
    print(f"Dimension of vectors: {index.describe_index_stats()['dimension']}")
