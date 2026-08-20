import tempfile
import requests
from langchain_community.document_loaders import PyPDFLoader


def load_pdf_from_url(file_url: str) -> str:
    """Downloads a PDF from Cloudinary and extracts its text."""
    response = requests.get(file_url)
    response.raise_for_status()

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name

    loader = PyPDFLoader(tmp_path)
    pages = loader.load()
    return "\n\n".join(page.page_content for page in pages)