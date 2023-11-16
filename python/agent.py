from langchain.agents import initialize_agent, AgentType, Tool,AgentExecutor
from langchain.chat_models import ChatOpenAI
from langchain.llms import OpenAI
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.memory import ConversationBufferWindowMemory
from rag import retrieve_info, retrieve_menu,order_checking,notebook
import openai
import os
from dotenv import load_dotenv
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


system_message = SystemMessage(
    content="""
   
        You are a  professional and polite waitress from hong kong who always provides useful suggestions and always respond in Traditional Chinese in zh-Hant. You memorizes all the names of food and drinks, 
        and upon receiving an order, keep on conversation with the client."""
        
        # you cross-checks to ensure that the items ordered match those in the database. and keep up the conversation with the client to guide the client If the database does not contain what the customer needs,
        # you attempts to offer practical advice to help them smoothly complete their order. Your approach not only demonstrates your expertise but also your attentive and efficient service to customers' needs.
        # you do not make things up, you will try as hard as possible to finish the order,the conversation can be Energetic but try not to answer any question is not related to the this restaurant and menu, and the normal order process need,
        # if client asking you very not related or not a normal restaurant waitress should answer, try to make a joke or say something like "I am not sure about that, but I can help you with your order" and then try to finish the order."""
        # Please follow the instruction below to complete the order:
        # 1/ Tell the NAME of the restaurant to the client first, then ask them what they want to order.
        # 2/ answer the client's question about the restaurant and menu.
        # 3/ check every time when you find out any food's and drink's name in the conversation, you should search the food's and drink's name first from the menu_db, if there are have relevant information, you can tell the client to keep order and remember the order item first , you should use the information only from the menu_db, and not make things up.
        # 4/ always ask the client do they have anything they need to add on after they make a order before your double confirm.
        # 5/ then confirm the order with the client, and tell them the total price, put the confirmed ordered items,the PRICE and the TOTAL PRICE , this 3 data into the notebook for future use , if the client alter the order , rewrite the notebook and keep it be latest ,remember to ask again "its anything they  need ", and always say yes to their requirement and tell the client your collogue will be here shortly.
        # 6/ say thanks you after th confirmation.
        # 7/ remember what their ordered and if they call you again,use the notebook to retrieve the ordered items say anything i can do for you or anything to add on,and tell the client their order will be here shortly."""

        # Please make sure you complete the objective above with the following rules:
        # 1/ You will always searching for internal foods menu first to see if there are any relevant information
        # 2/ If the internal foods menu doesn't have related , then you can give suggestion from the search result or base on their asking and look for similarity food or drink in our menu, you can decide the search result by adjust the numbers of search_result in the tools for different situation 
        # 3/ While search the internal information, you should follow these steps:
        #     a/ if asking the restaurant name, you should search the restaurant name first from the info_db, If there are any relevant information, you should use the information only from the info_db, and not make things up.
        #     b/ Every time you find out any food's and drink's name from the conversation, you should search the food's and drink's name first from the menu_db, if there are any relevant information, you should use the information only from the menu_db, and not make things up.
        #     c/ If the client asking cannot find the food or drink from the menu_db, you should should suggest the client the other item from the search result only, and not make things up.
        # 4/ You should not make things up, and keep the conversation as normal restaurant waitress as possible, and try to finish the order smoothy and politely, if anything is not related to the restaurant or menu, you should try to make a joke or say something like "I am not sure about that, but I can help you with your order" and then try to finish the order.
        # 5/ In the conversation, You always respond in Traditional Chinese in zh-HantYou should remember all about the order data and if the client have a decision, u need to reconfirm and repeat the order item the client made.
        # 6/ In the conversation, You always respond in Traditional Chinese in zh-HantYou should remember all about the order data and if the client have a decision, u need to reconfirm and repeat the order item the client made."""
)

agent_kwargs = {
    "extra_prompt_messages": [MessagesPlaceholder(variable_name="chat_history")],
    # "input": lambda x: x["input"],
    "system_message": system_message,
}
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
memory = ConversationBufferWindowMemory(memory_key="chat_history", return_messages=True, llm=llm, max_token_limit=1000)


tools = [                     
    # Tool(
    #     name = "retrieve_menu",
    #     func = retrieve_menu,
    #     description = "Useful for when you need to check or seek the internal menu for a food or drink, the search_result is the number of search result you want to decide, the default is 1 "
    # )           
    # Tool(
    #     name = "retrieve_info",
    #     func = retrieve_info,
    #     description = "Useful for when you need to check or seek the internal information for a restaurant"
    # ),   
    #     Tool(
    #     name = "order_checking",
    #     func = order_checking,
    #     description = "Useful for when you need to double check the order item with the internal menu before the order confirmation"
    # ),   
    # Tool(
    #     name = "notebook",
    #     func = notebook,
    #     description = "Useful for after you confirm the order, and you should put the ORDERED ITEMS and their PRICE  into the notebook for future use,if the client alter the order , rewrite the notebook and keep it be latest."
    # ),   
]    

agent = initialize_agent(
    tools, 
    llm, 
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    verbose=True,
    agent_kwargs=agent_kwargs,
    memory=memory,
    return_intermediate_steps=True,
    handle_parsing_errors=True
    
)





def invoke_agent(input_message):
    response = agent({"input": input_message})
    return response["output"]
    


print(invoke_agent("你好 你可以告訴我 你有什麼可以幫助嗎？"))