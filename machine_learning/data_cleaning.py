from flair.data import Sentence
from flair.models import TextClassifier

import pandas as pd

# Read raw csv data
df1 = pd.read_csv('./text.csv')

# Remove timestamp column
df1.drop('Timestamp', axis=1, inplace=True)
df1.head()

col_names = df1.columns.to_list()
df1.head()

# Create a dictionary. Dictionary will be used to re-do the dataframe. 
d = {"text": [], "label": []}

# Insert the corresponding text-label pair into dictionary. 
for emotion, series in df1.iteritems():
  for t in series[series.notnull()]:
    d["text"].append(t)
    d["label"].append(emotion)

# Create a pandas DataFrame from dictionary
df2 = pd.DataFrame(data=d)

# Check each text and remove the ones that may degrade model performance.
# index to be removed: 3, 89, 104, 69, 49, 41
# df2.drop(index=[3,89,104,49], inplace=True)
# df2.reset_index(drop=True, inplace=True)
df2.drop(index=41, inplace=True)
df2.reset_index(drop=True, inplace=True)
df2

df2.loc[df2["label"] == "Tired"]

# Check if we have an imbalanced dataset
df2['label'].value_counts()

# Need more example data for Optimism, Offensive, Stressed, Joy, Sadness, Bored, Accomplied.
# 3 more: Optimism, Offensive, Bored
# 2 more: Stressed, Joy, Sadness, Accomplished

# New text data to rebalance the dataset.
optimism_offensive = [pd.Series(["After the intensive training, I'm confident that I'll be more productive in my work!", "Optimism"], index=df2.columns),
                      pd.Series(["I'm positive that the team will improve drastically after this workshop.", "Optimism"], index=df2.columns),
                      pd.Series(["The project will surely be delivered on time, with the highest quality", "Optimism"], index=df2.columns),
                      pd.Series(["The host's a bitch! I'm not sure if she knows much about tech!", "Offensive"], index=df2.columns),
                      pd.Series(["This motherfucker can't stop talking for hours", "Offensive"], index=df2.columns),
                      pd.Series(["He is such an asshole. I don't know how he ended up being the host", "Offensive"], index=df2.columns)]

stressed_joy = [pd.Series(["My teammates are not working well together, I'm ripping my hair out trying to figure out ways to fix this.", "Stressed"], index=df2.columns),
                pd.Series(["Nothing is going as planned, I'm scared to death", "Stressed"], index=df2.columns),
                pd.Series(["My presentation went better than expected! I hope the project gets accepted.", "Joy"], index=df2.columns),
                pd.Series(["I GOT A BONUS FOR ALL MY HARDWORK", "Joy"], index=df2.columns)]

sadness_bored = [pd.Series(["My family member passed away recently, so I can't focus during work.", "Sadness"], index=df2.columns),
                  pd.Series(["My depression and anxiety keeps getting worse day by day.", "Sadness"], index=df2.columns),
                  pd.Series(["when will this workshop end, i'm not learning anything new", "Bored"], index=df2.columns),
                  pd.Series(["half of the audience were trying their best to keep their eyes open", "Bored"], index=df2.columns),
                  pd.Series(["Why are we using old technologies for this project? It's so dull, boring and not fresh", "Bored"], index=df2.columns)]

accomplished = [pd.Series(["I've been working hard the past few months and it all came to fruition! I'm glad its a success!", "Accomplished"], index=df2.columns),
                pd.Series(["I've finished every exercise in the workshop!", "Accomplished"], index=df2.columns),]

# Add all of the new data into a single list
new_data = []
new_data.extend(accomplished)
new_data.extend(optimism_offensive)
new_data.extend(stressed_joy)
new_data.extend(sadness_bored)

# Add the new data to the dataframe
df3 = df2.append(new_data, ignore_index=True)
df3

# Shuffle training data
df4 = df3.sample(frac=1).reset_index(drop=True)
df4

# Export to csv
df4.to_csv('emotions.csv',index=False)