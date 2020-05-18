# -*- coding: utf-8 -*-
"""
Created on Wed Apr  1 15:12:52 2020

@author: Kunal
"""

from sklearn.cluster import KMeans
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

with open('data/australian.dat','r') as input_file:
   lines = input_file.readlines()
   newLines = []
   for line in lines:
      newLine = line.strip().split()
      newLines.append( newLine )

data=np.array(newLines,dtype=np.float32)

sampledData=[]
for j in range(len(data)):
    random_var=np.random.uniform()
    if random_var>0.75:
        sampledData.append(data[j])
    
sampledData=np.array(sampledData)
yVal=sampledData[:,-1]
sampledData=np.delete(sampledData,14,axis=1)

#np.savetxt("data/sampledData.csv",sampledData,delimiter=",",header="A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14",comments="")

#sampledDataFrame=pd.DataFrame({"values":sampledData})
#sampledDataFrame.to_csv("data/sampledData.csv")

clusters=[]
avgDistance=[]
for i in range(1,10):    
    km = KMeans(n_clusters=i)
    alldistances = km.fit_transform(sampledData)
    totalDistance = np.min(alldistances, axis=1).sum()
    clusters.append(i)
    avgDistance.append(totalDistance/i)
    
#kmeansData=pd.DataFrame({"clusters":[clusters],"avgDistance":[avgDistance]})
#kmeansData.to_csv("data/kmeansData.csv")

plt.plot(clusters,avgDistance)

from sklearn.preprocessing import StandardScaler
x = StandardScaler().fit_transform(sampledData)

A = np.asmatrix(x.T) * np.asmatrix(x)
U, S, V = np.linalg.svd(A) 
eigVals = S**2 / np.sum(S**2)

cumulative=[sum(eigVals[:i]) for i in range(1,15)]
#for x in range(len(cumulative)):
#    if cumulative[x]>0.75:
#        print(x)
#        break;

intrinsicDim=pd.DataFrame({"dimension":[np.arange(1,15)],"eigenValues":[eigVals],"cumulativeEigVals":[cumulative]})
intrinsicDim.to_csv("data/intrinsicDim.csv")

plt.plot(np.arange(1,15),cumulative)
plt.bar(np.arange(1,15),eigVals)
plt.show()




from sklearn.decomposition import PCA
pca = PCA(.75)
principalComponents = pca.fit_transform(x)
print(f"75% of the variance is captures by {pca.n_components_} components")
#pca.explained_variance_ratio_

pca = PCA(n_components=2)
principalComponents = pca.fit_transform(x)

red=[]
blue=[]
for i in range(len(principalComponents)):
    if yVal[i]==0:
        red.append(principalComponents[i,:])
    else:
        blue.append(principalComponents[i,:])
red=np.array(red)
blue=np.array(blue)
plt.scatter(red[:,0],red[:,1],c='r')
plt.scatter(blue[:,0],blue[:,1],c='b')
plt.show()

    
        