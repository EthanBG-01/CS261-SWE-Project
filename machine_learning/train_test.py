import pandas as pd
from flair.data import Sentence
from flair.models.text_classification_model import TARSClassifier
from flair.data import Corpus
from flair.datasets import SentenceDataset
from flair.trainers import ModelTrainer

# Load cleaned emotions dataset
df = pd.read_csv('emotions.csv')

# Load all text-emotions pair for training
listofSentences = []
for row in df.iterrows():
  emotion = row[1][1]
  text = row[1][0]

  sentence = Sentence(text).add_label('emotion', emotion)
  listofSentences.append(sentence)

train = SentenceDataset(listofSentences)

# Each emotion will have one test data. 
test = SentenceDataset(
    [
     Sentence("I can't wait for the next session!").add_label('emotion', "Excited"),
     Sentence("My back aches because i've been sitting on this chair for such a long time").add_label('emotion', "Tired"),
     Sentence("I am utterly dissappointed with the management of this event. WHAT A WASTE OF MY TIME").add_label('emotion', "Angry"),
     Sentence("Will there be enough time for me to finish my work? ").add_label('emotion', "Worried"),
     Sentence("I'm really happy and content with the my team. They're really fun to be around with and gets the job done").add_label('emotion', "Joy"),
     Sentence("I'm so thankful the session covered a lot of essential information").add_label('emotion', "Grateful"),
     Sentence("I don't feel like i'm doing much since the talk is uninteractive").add_label('emotion', "Bored"),
     Sentence("FUCK THE SPEAKER").add_label('emotion', "Offensive"),
     Sentence("I think I prepared well for the pitch with our client tomorrow").add_label('emotion', "Optimism"),
     Sentence("One of my colleagues is leaving the company, I really hope I can see her again :(").add_label('emotion', "Sadness"),
     Sentence("The host was using jargons that I don't understand since i'm still new. I can't figure out what we was trying to convey.").add_label('emotion', "Confused"),
     Sentence("I just finished this report and i feel so good").add_label('emotion', "Accomplished"),
     Sentence("The project is off to a good start! I'll do my best get it done").add_label('emotion', "Motivated"),
     Sentence("My files are messed up and some are even corrupted and it wasn't even my fault! I have to finish this report by tomorrow AAAHH").add_label('emotion', "Stressed"),
    ])

corpus = Corpus(train=train, test=test)

# 1. load base TARS
tars = TARSClassifier.load('tars-base')

# 2. make the model aware of the desired set of labels from the new corpus
tars.add_and_switch_to_new_task("EMOTIONS_CS261", label_dictionary=corpus.make_label_dictionary())

# 3. initialize the text classifier trainer with the corpus
trainer = ModelTrainer(tars, corpus)

# 4. train model
trainer.train(base_path='resources/taggers/emotions_cs261', # path to store the model artifacts
              learning_rate=0.02, # use very small learning rate
              mini_batch_size=1, # small mini-batch size since corpus is tiny
              max_epochs=10, # terminate after 10 epochs
              train_with_dev=True,
              )
## Using the trained TARS classifier.
# 1. Load few-shot TARS model
tars = TARSClassifier.load('resources/taggers/emotions_cs261/final-model.pt')

# 2. Prepare a test sentence
sentence = Sentence("I really need a nap because I was working late last night.")

tars.predict(sentence)
print(sentence)