import os
from dotenv import load_dotenv
import pinecone

if __name__ == "__main__":
    load_dotenv()
    pc = pinecone.Pinecone(os.getenv("PINECONE_API_KEY"))
    # Print stats about the index
    index = pc.Index("corpus")
    stats = index.describe_index_stats()

    print("\nIndex Statistics:")
    print(f"Total vectors in index: {stats['total_vector_count']}")
    print(f"Dimension of vectors: {stats['dimension']}")
    print(f"Namespaces: {stats.get('namespaces', 'none')}")
