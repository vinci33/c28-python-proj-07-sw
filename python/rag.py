from langchain.document_loaders.csv_loader import CSVLoader
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.retrievers import BM25Retriever, EnsembleRetriever
import faiss
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()


loader_foods = CSVLoader(file_path="./csv/chinese_food_menu_withoutID.csv")
documents_foods = loader_foods.load()
loader_info = CSVLoader(file_path="./csv/restaurant_info.csv")
documents_info = loader_info.load()

print(f"chinese menu : {len(documents_foods), type(documents_foods)}")





embeddings = OpenAIEmbeddings()
menu_db = FAISS.from_documents(documents_foods, embeddings)
info_db = FAISS.from_documents(documents_info, embeddings)
# menu_db.save(faiss.menu_db)
# menu_db= FAISS.load(faiss.menu_db, embeddings)
# info_db.save(faiss.info_db)
# info_db= FAISS.load(faiss.info_db, embeddings)
# bm25_retriever = BM25Retriever.from_texts(menu_db,k=2)



def retrieve_info(query):
    # result = bm25_retriever.get_relevant_documents(query, k=2)
    # print(result)
    similar_response = info_db.similarity_search(query, k=2)
    print(similar_response)
    page_contents_array = [doc.page_content for doc in similar_response]

    return page_contents_array

def retrieve_menu(query, search_result=3):
    # result = bm25_retriever.get_relevant_documents(query, k=2)
    # print(result)
    
    similar_response = menu_db.similarity_search(query, k=search_result)
    print(similar_response)
    page_contents_array = [doc.page_content for doc in similar_response]

    return page_contents_array

def order_checking(order_items):
    staging_order = []
    staging_order.append(order_items)
    retrieve_items_array = retrieve_menu(order_items)
    food_name_array = []
    for item in retrieve_items_array:
        lines = item.split('\n')
        for line in lines:
            if line.startswith('chinese_food_name:'):
                food_name = line[len('chinese_food_name:'):].strip()
                if food_name == order_items:
                    return f"Order item {order_items} found in the menu.", order_items, staging_order
                else:
                    food_name_array.append(food_name)
                    return f"Order item {order_items} not found in the menu. Related suggestion {food_name_array}", food_name_array ,staging_order

    return f"Order item {order_items} not found in the menu.", None

def notebook(orders):
    confirmed_ordered_notebook = []
    for order in orders:
        ordered_item = order.get('ordered_item')
        price = order.get('price')
        total_price = order.get('total_price')
        if ordered_item is None:
            print("I am sorry, I cannot find the item in the menu, please try again")
        else:
            confirmed_order = {
                'ordered_item': ordered_item,
                'item_price': price,
                'order_total_price': total_price
            }
            confirmed_ordered_notebook.append(confirmed_order)
            print(f"Okay, I will help you to order {ordered_item}.")
    return confirmed_ordered_notebook

print(retrieve_info("乾炒牛河"))