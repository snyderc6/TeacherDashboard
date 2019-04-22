##################################################################
# Topic Modeling
# Caitlin Snyder
# March 2019
##################################################################

import csv 
import numpy
import gensim
from gensim.utils import simple_preprocess
#from gensim.parsing.preprocessing import STOPWORDS
from gensim import corpora, models
#from nltk.stem import WordNetLemmatizer, SnowballStemmer
#from nltk.stem.porter import *
import numpy as np
np.random.seed(2018)

### read in the data & prepocesss####################################
data = []
with open("data/ChicagoMB1Actions.csv", 'rt') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	for row in reader:
		data.append(row)
with open("data/ChicagoMB2Actions.csv", 'rt') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	for row in reader:
		data.append(row)
student_ids = []
actions = []
for inst in data:
	student_ids.append(inst.pop(0))
	actions.append(inst.pop(0))
splitActions = []
for actionSeq in actions:
	arrayActions = actionSeq.split(";")
	splitActions.append(arrayActions)
##################################################################
dictionaryData = []
dictionary = gensim.corpora.Dictionary(splitActions)

# count = 0
for k, v in dictionary.iteritems():
	instance = numpy.asarray([k,v])
	dictionaryData.append(instance)
    # print(k, v)
    # count += 1
    # if count > 10:
    #     break

with open('dictionary.csv', 'w', newline = '') as file:
	writer = csv.writer(file, delimiter = "," )
	writer.writerows(dictionaryData)

bow_corpus = [dictionary.doc2bow(doc) for doc in splitActions]
# bow_doc_4310 = bow_corpus[2]
# for i in range(len(bow_doc_4310)):
#     print("Word {} (\"{}\") appears {} time.".format(bow_doc_4310[i][0], 
#                                                dictionary[bow_doc_4310[i][0]], 
# bow_doc_4310[i][1]))

tfidf = models.TfidfModel(bow_corpus)
corpus_tfidf = tfidf[bow_corpus]
# from pprint import pprint
# for doc in corpus_tfidf:
#     pprint(doc)
#     break

#lda_model = gensim.models.LdaSinglecore(bow_corpus, num_topics=3, id2word=dictionary, passes=2, workers=2)
perplexity_logger = gensim.models.callbacks.PerplexityMetric(corpus=bow_corpus, logger='shell')
lda_model = gensim.models.ldamodel.LdaModel(bow_corpus, num_topics=4, id2word = dictionary, passes=20, callbacks=[perplexity_logger])
print(lda_model.print_topics(num_topics=3, num_words=2))
print(lda_model.log_perplexity(bow_corpus))

# for idx, topic in lda_model.print_topics(-1):
#     print('Topic: {} \nWords: {}'.format(idx, topic))