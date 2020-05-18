from flask import Flask, render_template,request, redirect
import sampling
from sklearn.cluster import KMeans
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import json
from sklearn.metrics import pairwise_distances
from sklearn import manifold


app = Flask(__name__)



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('aboutData.html')


@app.route('/task1a',methods=['GET'])
def task1A():
    dataStrat=sampling.stratifiedSampling().to_json()
    dataRandom=sampling.randomSampling().to_json()
    data={"stratifiedSampling":dataStrat,"randomSampling":dataRandom}
    return render_template('task.html',taskJS="task1a",data=data)

@app.route('/task1b',methods=['GET','POST'])
def task1B():
    dataOriginal=sampling.originalData()
    #dataOriginal.drop(['A15'], axis=1)
    del dataOriginal['A15']

    dataRandom=sampling.randomSampling()
    del dataRandom['A15']

    dataStrat=sampling.stratifiedSampling()
    del dataStrat['A15']

    def kmeansElbow(data):
        dictionary={}
        for i in range(1,10):
            km = KMeans(n_clusters=i)
            #kmeans for stratified sampled data
            alldistances = km.fit(data)
            #totalDistance = np.min(alldistances, axis=1).sum()
            dictionary[i]=alldistances.inertia_#totalDistance/i;

        return dictionary

    dictOriginal=kmeansElbow(dataOriginal)
    dictRandom=kmeansElbow(dataRandom)
    dictStrat=kmeansElbow(dataStrat)



    dict=[dictOriginal,dictRandom,dictStrat]
    # kmeansData=pd.DataFrame({"clusters":[clusters],"avgDistance":[avgDistance]})
    kmeansData=pd.DataFrame(dict)
    data=kmeansData.to_json()
    return render_template('task.html',taskJS="task1b",data=data)

@app.route('/task2a',methods=['GET'])
def task2A():
    dataOriginal=sampling.originalData()
    #dataOriginal.drop(['A15'], axis=1)
    del dataOriginal['A15']

    dataRandom=sampling.randomSampling()
    del dataRandom['A15']

    dataStrat=sampling.stratifiedSampling()
    del dataStrat['A15']


    def intrinsicDim(data):
        x = StandardScaler().fit_transform(data)
        A = np.asmatrix(x.T) * np.asmatrix(x)
        U, S, V = np.linalg.svd(A)
        eigVals = S**2 / np.sum(S**2)

        cumulative=[sum(eigVals[:i]) for i in range(1,15)]

        intrinsicDim=pd.DataFrame({"dimension":[np.arange(1,15)],"eigenValues":[eigVals],"cumulativeEigVals":[cumulative]})
        return intrinsicDim.to_json()

    #Original Data
    intrinsicDimOrg=intrinsicDim(dataOriginal)
    intrinsicDimRand=intrinsicDim(dataRandom)
    intrinsicDimStrat=intrinsicDim(dataStrat)


    data=[intrinsicDimOrg,intrinsicDimRand,intrinsicDimStrat]
    data=pd.DataFrame(data)
    data=data.to_json()
    return render_template('task.html',taskJS="task2a",data=data)

@app.route('/task3a',methods=['GET'])
def task3A():

    dataOriginal=sampling.originalData()
    dataOriginalY=dataOriginal['A15']
    del dataOriginal['A15']
    dataOriginal = StandardScaler().fit_transform(dataOriginal)

    dataRandom=sampling.randomSampling()
    dataRandomY=dataRandom['A15']
    del dataRandom['A15']
    dataRandom = StandardScaler().fit_transform(dataRandom)

    dataStrat=sampling.stratifiedSampling()
    dataStratY=dataStrat['A15']
    del dataStrat['A15']
    dataStrat = StandardScaler().fit_transform(dataStrat)

    pca = PCA(n_components = 2)

    originalPCA = pca.fit_transform(dataOriginal)

    randomPCA = pca.fit_transform(dataRandom)

    stratPCA = pca.fit_transform(dataStrat)

    print(originalPCA[:,:2])

    data=[originalPCA,dataOriginalY,randomPCA,dataRandomY,stratPCA,dataStratY]
    data=pd.DataFrame(data)
    data=data.to_json()
    return render_template('task.html',taskJS="task3a",data=data)

@app.route('/task3b',methods=['GET'])
def task3B():

    dataOriginal=sampling.originalData()
    dataOriginalY=dataOriginal['A15']
    del dataOriginal['A15']
    dataOriginal = StandardScaler().fit_transform(dataOriginal)

    dataRandom=sampling.randomSampling()
    dataRandomY=dataRandom['A15']
    del dataRandom['A15']
    dataRandom = StandardScaler().fit_transform(dataRandom)

    dataStrat=sampling.stratifiedSampling()
    dataStratY=dataStrat['A15']
    del dataStrat['A15']
    dataStrat = StandardScaler().fit_transform(dataStrat)

    mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')

    similarity = pairwise_distances(dataOriginal, metric='euclidean')
    originalMDSEu = mds_data.fit_transform(similarity)

    similarity = pairwise_distances(dataRandom, metric='euclidean')
    randomMDSEu = mds_data.fit_transform(similarity)

    similarity = pairwise_distances(dataStrat, metric='euclidean')
    stratMDSEu = mds_data.fit_transform(similarity)

    similarity = pairwise_distances(dataOriginal, metric='correlation')
    originalMDSCo = mds_data.fit_transform(similarity)

    similarity = pairwise_distances(dataRandom, metric='correlation')
    randomMDSCo = mds_data.fit_transform(similarity)

    similarity = pairwise_distances(dataStrat, metric='correlation')
    stratMDSCo = mds_data.fit_transform(similarity)

    data=[originalMDSEu,dataOriginalY,randomMDSEu,dataRandomY,stratMDSEu,dataStratY,\
            originalMDSCo,dataOriginalY,randomMDSCo,dataRandomY,stratMDSCo,dataStratY]

    data=pd.DataFrame(data)
    data=data.to_json()
    return render_template('task.html',taskJS="task3b",data=data)

@app.route('/task3c',methods=['GET'])
def task3c():

    dataOriginal=sampling.originalData()
    dataOriginalY=dataOriginal['A15']
    del dataOriginal['A15']
    dataOriginal = StandardScaler().fit_transform(dataOriginal)

    dataRandom=sampling.randomSampling()
    dataRandomY=dataRandom['A15']
    del dataRandom['A15']
    dataRandom = StandardScaler().fit_transform(dataRandom)

    dataStrat=sampling.stratifiedSampling()
    dataStratY=dataStrat['A15']
    del dataStrat['A15']
    dataStrat = StandardScaler().fit_transform(dataStrat)

    pca = PCA(n_components = 3)
    def return_dict_arr(data,yVal):
        array=[]
        yVal=np.array(yVal)
        for i in range(len(data)):
            array.append({"target":yVal[i],"PCA1":data[i,0],"PCA2":data[i,1],"PCA3":data[i,2]})

        return array

    originalPCA = pca.fit_transform(dataOriginal)
    originalPCA = {"values":return_dict_arr(originalPCA,dataOriginalY)}

    randomPCA = pca.fit_transform(dataRandom)
    randomPCA = {"values":return_dict_arr(randomPCA,dataRandomY)}

    stratPCA = pca.fit_transform(dataStrat)
    stratPCA={"values":return_dict_arr(stratPCA,dataStratY)}

    # print(originalPCA[:,:2])

    data=[json.dumps(originalPCA), json.dumps(randomPCA), json.dumps(stratPCA)]#,"randomPCA":dataOriginalY,dataRandomY,stratPCA,dataStratY}
    data=pd.DataFrame(data)
    data=data.to_json()
    #data=json.dumps(data)
    return render_template('task3c.html',taskJS="task3c",data=data)

@app.route('/extra',methods=['GET'])
def extra():

    dataOriginal=sampling.originalData()
    dataOriginalY=dataOriginal['A15']
    del dataOriginal['A15']
    dataOriginal = StandardScaler().fit_transform(dataOriginal)

    dataRandom=sampling.randomSampling()
    dataRandomY=dataRandom['A15']
    del dataRandom['A15']
    dataRandom = StandardScaler().fit_transform(dataRandom)

    dataStrat=sampling.stratifiedSampling()
    dataStratY=dataStrat['A15']
    del dataStrat['A15']
    dataStrat = StandardScaler().fit_transform(dataStrat)

    pca = PCA(n_components = 3)
    def return_dict_arr(data,yVal):
        array=[]
        yVal=np.array(yVal)
        for i in range(len(data)):
            array.append({"key":"P"+str(i),"value":yVal[i],"x":data[i,0],"y":data[i,1],"z":data[i,2]})

        return array

    originalPCA = pca.fit_transform(dataOriginal)
    originalPCA = {"key":"Bubbles","values":return_dict_arr(originalPCA,dataOriginalY)}

    randomPCA = pca.fit_transform(dataRandom)
    randomPCA = {"key":"Bubbles", "values":return_dict_arr(randomPCA,dataRandomY)}

    stratPCA = pca.fit_transform(dataStrat)
    stratPCA={"key":"Bubbles","values":return_dict_arr(stratPCA,dataStratY)}

    # print(originalPCA[:,:2])

    data=[json.dumps(originalPCA), json.dumps(randomPCA), json.dumps(stratPCA)]#,"randomPCA":dataOriginalY,dataRandomY,stratPCA,dataStratY}
    data=pd.DataFrame(data)
    data=data.to_json()
    #data=json.dumps(data)
    return render_template('extra.html',taskJS="extra",data=data)

@app.route('/dashboard',methods=['GET'])
def dashboard():
    dataOriginal=sampling.originalData()
    dataMDS = dataOriginal
    dataMDS = StandardScaler().fit_transform(dataMDS)
    mds_data = manifold.MDS(n_components=2, dissimilarity='precomputed')
    similarity = pairwise_distances(dataMDS, metric='euclidean')
    originalMDSEu = mds_data.fit_transform(similarity)
    print(originalMDSEu.shape)
    dataOriginal['MDS_x']=originalMDSEu[:,0]
    dataOriginal['MDS_y']=originalMDSEu[:,1]
    return render_template("dashboard.html", taskJS="dashboard", data=dataOriginal.to_json(orient='records'))

if __name__== "__main__":
    app.run(debug=True)
