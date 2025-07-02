import os
from notion_client import Client
from dotenv import load_dotenv

load_dotenv()

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

notion = Client(auth=NOTION_TOKEN)

def get_notion_documents():
    all_docs = []
    next_cursor = None

    while True:
        response = notion.databases.query(
            database_id=NOTION_DATABASE_ID,
            start_cursor=next_cursor
        ) if next_cursor else notion.databases.query(database_id=NOTION_DATABASE_ID)

        results = response.get("results", [])
        all_docs.extend(results)

        if not response.get("has_more"):
            break
        next_cursor = response.get("next_cursor")

    # 🧠 First pass: build a lookup table of page_id → document ID
    page_id_to_doc_id = {}
    for page in all_docs:
        props = page.get("properties", {})
        doc_id = "Missing ID"
        try:
            doc_id = props["ID"]["title"][0]["plain_text"]
        except (KeyError, IndexError, TypeError):
            pass
        page_id_to_doc_id[page["id"]] = doc_id

    # ✅ Second pass: build full document list with mapped references
    documents = []
    for page in all_docs:
        props = page.get("properties", {})

        def safe_get(path, default="Missing"):
            try:
                value = props
                for key in path:
                    value = value[key]
                return value
            except (KeyError, IndexError, TypeError):
                return default

        def resolve_relations(relation_list):
            return [
                page_id_to_doc_id.get(rel.get("id"), "Unknown ID")
                for rel in relation_list
            ]

        doc = {
            "id": safe_get(["ID", "title", 0, "plain_text"], "Missing ID"),
            "title": safe_get(["Title", "rich_text", 0, "plain_text"], "Missing Title"),
            "type": safe_get(["Type", "select", "name"], "Missing Type"),
            "status": safe_get(["Status", "select", "name"], "Missing Status"),
            "department": safe_get(["Department", "select", "name"], "Missing Dept"),
            "date": safe_get(["Date", "date", "start"], "Missing Date"),
            "references": resolve_relations(safe_get(["References", "relation"], [])),
            "referenced_by": resolve_relations(safe_get(["Referenced By", "relation"], [])),
        }

        documents.append(doc)

    return documents
