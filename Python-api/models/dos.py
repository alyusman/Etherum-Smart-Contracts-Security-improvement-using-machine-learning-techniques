import numpy as np
import pandas as pd

import sklearn.linear_model
from sklearn.model_selection import train_test_split

data = pd.read_csv('./models/csv/denial_of_service.csv')

target = data['TARGET']
features = data.drop('TARGET', axis=1)

X_train, X_test, y_train, y_test = train_test_split(features, target, 
                                                    test_size=0.2)

regr = sklearn.linear_model.LogisticRegression(C=1.0, penalty='l2', tol=0.0001, solver="lbfgs")
regr.fit(X_train, y_train)
regr.predict(X_test)

def preditDos(arr):
    npArr = np.array(arr)
    result =regr.predict(npArr.reshape(1,-1))[0]
    percentage = regr.predict_proba(npArr.reshape(1,-1))[0][0] * 100
    return result, percentage