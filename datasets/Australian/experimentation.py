# -*- coding: utf-8 -*-
"""
Created on Sat May 16 22:54:27 2020

@author: Kunal
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("australian.csv")


def plot(field):
    arr1 = []
    arr2 = []
    for i in range(len(df)):
        if df['C'].iloc[i]==0:
            arr1.append(df[field].iloc[i])
        else:
            arr2.append(df[field].iloc[i])
            
    plt.hist([arr1, arr2],label=['not approved','approved'])
    plt.legend()
    plt.show()

plot('A13')

correlations = []
for i in range(14):
    correlations.append(np.corrcoef(df.iloc[:,i],df['C'])[0][1])
    
temp = list(correlations)
temp.sort()

for i in range(14):
    print(i+1,correlations[i],temp[i])
