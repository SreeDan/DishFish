from transformers import BertTokenizer, BertForSequenceClassification
import torch
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import argparse
import json
import sys

# print("python file accessed")
# sys.stdout.flush()
parser = argparse.ArgumentParser()

# Add arguments to the parser
parser.add_argument("query")
parser.add_argument("passiveQuery")
parser.add_argument("dishes")
parser.add_argument("maxPrice")

# Parse the command-line arguments
args = parser.parse_args()

query = args.query
passiveQuery = args.passiveQuery
dishes = json.loads(args.dishes)
max_price = json.loads(args.maxPrice)

# Load the trained model and tokenizer
model_path = "/home/sreekara/Projects/UpdatedDishFish/server/analysis/trained_modelSpecific"  # Replace this with the path to your saved model
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertForSequenceClassification.from_pretrained(model_path)

# Function to check the category of a word
def check_category(word):
    inputs = tokenizer(word, padding=True, truncation=True, return_tensors="pt")
    outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    class_labels = ["vegetarian", "vegan", "gluten free", "spice", "cuisine", "food items"]
    predicted_category = class_labels[predicted_class]
    return predicted_category


# Load the trained model and tokenizer
model_path_spice = "/home/sreekara/Projects/UpdatedDishFish/server/analysis/trained_modelSpice"  # Replace this with the path to your saved model
model_spice = BertForSequenceClassification.from_pretrained(model_path_spice)

# Function to check the category of a word
def check_category_spice(word):
    inputs = tokenizer(word, padding=True, truncation=True, return_tensors="pt")
    outputs = model_spice(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    class_labels = [0, 1, 2, 3]
    predicted_category = class_labels[predicted_class]
    return predicted_category



def getPreferences(words):
    preferences = {}
    if words == "":
        return preferences
    stop_words = set(stopwords.words('english'))

    word_tokens = word_tokenize(words)
    # converts the words in word_tokens to lower case and then checks whether
    #they are present in stop_words or not
    filtered_sentence = [w for w in word_tokens if not w.lower() in stop_words]
    #with no lower case conversion
    filtered_sentence = []

    for w in word_tokens:
        if w not in stop_words:
            filtered_sentence.append(w)

    #print(" ".join(filtered_sentence))
    words = " ".join(filtered_sentence)
    for word in words.split(','):
        word = word.strip()
        predicted_category = check_category(word)
        #print(f"The word '{word}' belongs to the category: {predicted_category}")

        if predicted_category == "vegetarian":
            preferences["vegetarian"] = True
        elif predicted_category == "vegan":
            preferences["vegan"] = True
        elif predicted_category == "gluten free":
            preferences["glutenFree"] = True
        elif predicted_category == "spice":
            pass #more processing
            predicted_category = check_category_spice(word)
            #print(f"The spice word '{word}' belongs to the spice level: {predicted_category}")
            if predicted_category <= 1:
                preferences["spicy"] = False
            else:
                preferences["spicy"] = True
        elif predicted_category == "cuisine":
            preferences["cuisine"] = word
        elif predicted_category == "food items":
            preferences["name"] = word
    return preferences



#####

def checkName(dish, name):
    return name.lower() in dish['name'].lower() or name.lower() in dish['description'].lower()

def recommend_complete_meal(dishes, max_price, active_preferences, passive_preferences):
    if 'name' in active_preferences:
        dishes = [dish for dish in dishes if checkName(dish, active_preferences['name'])]
        del active_preferences['name']

    dishes = [dish for dish in dishes if all(str(active_preferences[pref]).lower() in str(dish[pref]).lower() for pref in active_preferences)]

    restaurant_dishes = [
        dish for dish in dishes
        if dish['price'] <= max_price
    ]

    placeToDish = {}
    for dish in restaurant_dishes:
        if dish['mealCategory'] in ["A", "D", "M", "S"]:
            if dish['restaurant'] not in placeToDish:
                placeToDish[dish['restaurant']] = {"A":[None,], "D":[None,], "M":[], "S":[None,]}
            placeToDish[dish['restaurant']][dish['mealCategory']].append(dish)

    #print(restaurant_dishes)

    finalDishList = []

    min_price = 0
    if max_price >= 20:
        min_price = max_price / 4

    for dish in restaurant_dishes:
        if dish['mealCategory'] in ["C", "M", "A"] and dish['price'] >= min_price:
            finalDishList.append((dish['price'], [dish,]))



    for place in placeToDish:
        for app in placeToDish[place]["A"]:
            for main in placeToDish[place]["M"]:
                for drink in placeToDish[place]["D"]:
                    for desert in placeToDish[place]["S"]:
                        curDishes = [i for i in [app, main, drink, desert] if i is not None]
                        if len(curDishes) >= 2:
                            sum = 0
                            for dish in curDishes:
                                sum += dish['price']
                            if min_price <= sum <= max_price:
                                finalDishList.append((sum, curDishes))

    finalDishList.sort(key=lambda a: a[0], reverse=True)
    finalDishList = [dishList[1] for dishList in finalDishList]
    passiveDishList = []
    delList1 = []
    for pref in passive_preferences:
        if pref in active_preferences:
            delList1.append(pref)
    for i in delList1:
        del passive_preferences[i]

    for dishList in finalDishList:
        matches = 0
        for dish in dishList:
            if 'name' in passive_preferences:
                if checkName(dish, passive_preferences['name']):
                    matches += 1
            for pref in passive_preferences:
                if pref != 'name' and str(passive_preferences[pref]).lower() in str(dish[pref]).lower():
                    matches += 1
        matches = matches / len(dishList)
        passiveDishList.append((matches, dishList))


    passiveDishList.sort(key=lambda a:a[0], reverse=True)

    return [dishList[1] for dishList in passiveDishList]


# f = open('randomFood.json')
# dishes = json.load(f)

# Sample user preferences and parameters
# max_price is set at beginning of document
passive_preferences = getPreferences(passiveQuery)
active_preferences = getPreferences(query)
if "vegetarian" in passive_preferences:
    active_preferences["vegetarian"] = True
if "vegan" in passive_preferences:
    active_preferences["vegan"] = True
if "glutenFree" in passive_preferences:
    active_preferences["glutenFree"] = True


# Get recommended meal based on user preferences
recommended_meal = recommend_complete_meal(dishes, max_price, active_preferences, passive_preferences)
print(json.dumps(recommended_meal))

sys.stdout.flush()