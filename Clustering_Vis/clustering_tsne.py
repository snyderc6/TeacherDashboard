##################################################################
# ML processing
# Caitlin Snyder
# Feburary 2019
##################################################################

import csv 
import numpy
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

### read in the data #############################################
data = []
with open("chicago_features.csv", 'rt') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	for row in reader:
		data.append(row)
feature_names = data.pop(0)
student_ids = []
for inst in data:
	student_ids.append(inst.pop(0))
##################################################################


### cluster the data #############################################
n_samples = len(data)
n_features = len(data[1])

#get clustering labels
model = KMeans(n_clusters = 3)
model.fit(data)
predictions = numpy.asarray(model.predict(data))

newData = []
for i in range(0, len(predictions)):
	instance = numpy.asarray([student_ids[i],predictions[i]])
	newData.append(numpy.concatenate([instance, data[i]]))

with open('chicago_labels.csv', 'w', newline = '') as file:
	writer = csv.writer(file, delimiter = "," )
	writer.writerows(newData)
#################################################################


### tsne ########################################################
#embedded = TSNE(n_components = len(data[1])).fit_transform(data)
pca = PCA(2)
scaler = StandardScaler()
scaler.fit(data)
scaled_data = scaler.transform(data)
results = pca.fit_transform(scaled_data)
results_data = []
for i in range(0, len(student_ids)):
	results_data.append(numpy.append(student_ids[i], results[i]))
with open('chicago_pca_results.csv', 'w', newline = '') as file:
	writer = csv.writer(file, delimiter = "," )
	writer.writerows(results_data)

#################################################################


