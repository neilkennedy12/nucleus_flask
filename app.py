from flask import Flask, jsonify, request, send_from_directory
from langchain.schema import Document
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json

import pinecone
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import Pinecone, PineconeVectorStore
from datetime import datetime
import re
import csv
import pytesseract
from pdf2image import convert_from_path
from PyPDF2 import PdfReader

app = Flask(__name__, static_folder="react/dist", static_url_path="")
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

# app.config["CORS_ORIGINS"] = ["https://nucleusresearchai.com"]


@app.after_request
def add_header(response):
    response.headers["X-Frame-Options"] = (
        "ALLOWALL"  # or use "ALLOW-FROM https://example.com"
    )
    # response.headers["Content-Security-Policy"] = (
    #     "frame-ancestors https://nucleusresearch.com;"
    # )
    return response


@app.route("/", defaults={"path": ""})
@app.route("/<string:path>")
@app.route("/<path:path>")
def serve_react_app(path):
    # Serve real static files (JS, CSS, images) normally
    if path and ("." in path or path.startswith("assets")):
        return send_from_directory(app.static_folder, path)

    # Otherwise, return index.html for React routes
    return send_from_directory(app.static_folder, "index.html")


load_dotenv()  # Load environment variables from .env file

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["PINECONE_API_KEY"] = os.getenv("PINECONE_API_KEY")

index_name = "corpus"
embeddings = OpenAIEmbeddings()

embeddings = OpenAIEmbeddings()

pc = pinecone.Pinecone(os.getenv("PINECONE_API_KEY"))

index_name = "corpus"
pc_index = pc.Index(index_name)

vector_store = PineconeVectorStore.from_existing_index(index_name, embeddings)

document_similarity_cutoff = 0.8


def get_similiar_docs(query, k=20):
    similar_docs_with_score = vector_store.similarity_search_with_score(query, k=k)

    # Switching keys and values
    docs_and_scores = {score: doc for doc, score in similar_docs_with_score}

    # Separate documents based on similarity score
    filtered_docs = {
        score: doc
        for score, doc in docs_and_scores.items()
        if score < document_similarity_cutoff
    }
    docs_and_scores = {
        score: doc
        for score, doc in docs_and_scores.items()
        if score >= document_similarity_cutoff
    }

    return docs_and_scores, filtered_docs


model_name = "gpt-4-1106-preview"
llm = ChatOpenAI(model=model_name, temperature=0)
chain = load_qa_chain(llm, chain_type="stuff")


def get_answer(query):
    docs_and_scores, filtered_docs = get_similiar_docs(query)
    similar_docs = list(docs_and_scores.values())

    if not similar_docs:  # Check if similar_docs is empty
        answer = "Sorry, we cannot find the information you are looking for right now. Please ask a different question or contact an analyst at hello@nucleusresearch.com."
    else:
        try:
            answer = chain.run(
                input_documents=similar_docs,
                question="You are a helpful assistant who answers queries. Do not mention that you were given context. Avoid flowery language and marketing jargon. Be unbiased. Avoid adjectives. Avoid adverbs. Be granular yet concise. Do not repeat yourself. Include all quantitative benefits. Here is a query for you to answer: "
                + query,
            )
        except (
            Exception
        ) as e:  # Replace Exception with the specific exception you're looking to catch if possible
            answer = (
                "Sorry we are currently experiencing technical difficulties. Please try again or contact an analyst at hello@nucleusresearch.com."
                + "\n"
                + str(e)
            )

    reference_research_set = set()
    benchmark_data_present = False
    # Updated regex pattern to include both directories
    pattern = re.compile(
        r"/content/drive/MyDrive/research_(?:corpus|to_add)/([a-z]\d{1,3})"
    )
    doc_num_pattern = re.compile(r"([a-z]\d+)(?:_|$)")

    for doc in similar_docs:
        metadata_str = str(doc.metadata)
        match = pattern.search(metadata_str)
        if match:
            # Add the found reference number to the set (this ensures no duplicates)
            reference_research_set.add(match.group(1))
        elif doc_num_pattern.search(metadata_str):
            reference_research_set.add(doc_num_pattern.search(metadata_str).group(1))
        else:
            benchmark_data_present = True

    reference_research = ", ".join(
        sorted(reference_research_set)
    )  # sorted for a consistent order
    if benchmark_data_present:
        reference_research += ", Benchmark Data"

    return answer, similar_docs, docs_and_scores, filtered_docs, reference_research


def log_question(
    query, answer, model_name, similar_docs, docs_and_scores, filtered_docs
):
    # Create a list of similar docs with their similarity scores
    similar_docs_list = [
        {
            "page_content": doc.page_content,
            "metadata": str(doc.metadata),
            "similarity_score": score,
        }
        for score, doc in docs_and_scores.items()
    ]

    # Create a list of filtered out docs with their similarity scores
    filtered_docs_list = [
        {
            "page_content": doc.page_content,
            "metadata": str(doc.metadata),
            "similarity_score": score,
        }
        for score, doc in filtered_docs.items()
    ]

    data = {
        "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "query": query,
        "answer": answer,
        "model_name": model_name,
        "similar_docs": json.dumps(similar_docs_list),
        "similar_docs_filtered_out": json.dumps(filtered_docs_list),
        "document_cutoff": document_similarity_cutoff,
    }

    # Writing to CSV
    csv_file_path = "questions_log.csv"
    fieldnames = [
        "datetime",
        "query",
        "answer",
        "model_name",
        "similar_docs",
        "similar_docs_filtered_out",
        "document_cutoff",
    ]

    # Check if the file exists. If not, write headers
    try:
        with open(csv_file_path, "r"):
            pass
    except FileNotFoundError:
        with open(csv_file_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

    # Write the data
    with open(csv_file_path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow(data)


@app.route("/api/answer/<question>", methods=["GET"])
# @cross_origin()
def answer(question=None):
    if question:
        answer = None
        similar_docs = None
        answer, similar_docs, docs_and_scores, filtered_docs, reference_research = (
            get_answer(question)
        )  # Fixed here
        log_question(
            question, answer, model_name, similar_docs, docs_and_scores, filtered_docs
        )
        return jsonify({"answer": answer, "research": reference_research})

    return "Network Error"


def getPreview(str):
    if len(str) < 75:
        return str[: int(len(str) * 0.75)] + "..."
    else:
        return (str[:75]) + "..."


@app.route("/api/preview/<question>", methods=["GET"])
# @cross_origin()
def preview(question=None):
    if question:
        answer = None
        similar_docs = None
        answer, similar_docs, docs_and_scores, filtered_docs, reference_research = (
            get_answer(question)
        )  # Fixed here
        log_question(
            question, answer, model_name, similar_docs, docs_and_scores, filtered_docs
        )
        return jsonify({"answer": getPreview(answer)})

    return "Network Error"


# Configure upload folder
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif", "docx", ".doc"}
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # Example: 16MB max-size

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_file_info_to_csv(file_info):
    csv_file_path = "uploaded_files_log.csv"
    fieldnames = ["filename", "date_added"]

    # Check if the file exists. If not, write headers
    try:
        with open(csv_file_path, "r"):
            pass
    except FileNotFoundError:
        with open(csv_file_path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

    # Write the data
    with open(csv_file_path, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow(file_info)


def process_pdf(file_path):
    # First try to extract text directly using PyPDF2
    pdf = PdfReader(file_path)
    text = ""
    for page in pdf.pages:
        extracted_text = page.extract_text()
        if extracted_text.strip():  # If we got meaningful text
            text += extracted_text + "\n"
        else:
            # If no text found, assume it's a scanned PDF
            # Convert PDF to images
            images = convert_from_path(file_path)
            # Extract text from images using OCR
            for image in images:
                text += pytesseract.image_to_string(image) + "\n"
    return text


# Update the Flask route to handle both GET and POST
@app.route("/api/upload", methods=["GET", "POST"])
# @cross_origin(
#     methods=["GET", "POST", "OPTIONS"],  # Add OPTIONS method
#     allow_headers=["Content-Type"],  # Allow necessary headers
#     max_age=3600,  # Cache preflight request results
# )
def upload_file():
    if request.method == "POST":
        responses = []
        errors = []
        embeddings = OpenAIEmbeddings()  # Move this outside the loop

        for file in request.files.getlist("file"):
            if file.filename == "":
                errors.append("No selected file")
                continue

            if not file or not allowed_file(file.filename):
                errors.append(f"File type not allowed: {file.filename}")
                continue

            try:
                filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                # Replace the DirectoryLoader section with:
                if filename.lower().endswith(".pdf"):
                    text = process_pdf(os.path.join(UPLOAD_FOLDER, filename))
                    documents = [
                        Document(page_content=text, metadata={"source": filename})
                    ]
                else:
                    loader = DirectoryLoader("./uploads", glob="**/*.*")
                    documents = loader.load()

                # Save file info to CSV
                file_info = {
                    "filename": filename,
                    "date_added": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
                save_file_info_to_csv(file_info)
                print(file_info)
            except Exception as e:
                errors.append(f"Failed to compile docs for {filename}: {str(e)}")
                continue

            try:
                # Delete the uploaded file
                os.remove(os.path.join(UPLOAD_FOLDER, filename))
            except Exception as e:
                errors.append(f"Failed to send response for {filename}: {str(e)}")
                continue

            try:
                # Split documents into chunks
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=4096, chunk_overlap=50
                )
                texts = text_splitter.split_documents(documents)
                responses.append(
                    {"name": filename, "texts": [str(text) for text in texts]}
                )

            except Exception as e:
                errors.append(f"Failed to split docs for {filename}: {str(e)}")
                continue

            try:
                # Upload to Pinecone
                # docsearch = Pinecone.from_documents(
                #     texts, embeddings, index_name=index_name
                # )
                vectorstore_from_docs = PineconeVectorStore.from_documents(
                    texts, index_name=index_name, embedding=embeddings
                )

                # After successful upload
                print(f"Successfully uploaded {len(texts)} chunks to Pinecone")
                vector_count = pc_index.describe_index_stats()["total_vector_count"]
                print(f"Total vectors in index: {vector_count}")
            except Exception as e:
                errors.append(f"Failed to upload vectors for {filename}: {str(e)}")
                continue

        # Return both responses and errors
        return jsonify(
            {
                "responses": responses if responses else None,
                "errors": errors if errors else None,
            }
        ), (200 if responses else 400)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
