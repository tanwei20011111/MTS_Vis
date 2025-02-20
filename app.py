from flask import Flask,request,jsonify 
from flask import render_template
from flask_cors import *

from sklearn.manifold import TSNE

import pandas as pd
import numpy as np
import math

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

import statsmodels.api as sm
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import grangercausalitytests


app = Flask(__name__)
CORS(app, supports_credentials=True)    #  resources=r'/*'


@app.route("/tsne", methods=["POST", "GET"])
def tsne():
    features_data = request.get_json()["features"]
    # CHANGE: 8/20
    pos_2d = TSNE(n_components=2, perplexity=8, metric="cosine", 
                      random_state=0).fit_transform(features_data)   
    pos_2d = pos_2d.tolist()
    print("======================")
    print("2D pos: \n")
    print(pos_2d)
    return jsonify(tsne_pnts=pos_2d)

    # ptn_points = []
    # for i, pattern in enumerate(data):
    #     pos_2d = TSNE(n_components=2, perplexity=2, metric="cosine", 
    #                   random_state=(i + 1)).fit_transform(data[i])
    #     ptn_points.append(pos_2d.tolist())
    # # print("PPPPPPPPPPPP: ", ptn_points)
    # return jsonify(tsne_pnts=ptn_points)


def check_stationarity(time_series):
    # Calculate rolling statistics
    rolling_mean = time_series.rolling(window=12).mean()
    rolling_std = time_series.rolling(window=12).std()
    
    # Plot rolling statistics:  cause version ERR!!
    # plt.plot(time_series, color='blue', label='Original')
    # plt.plot(rolling_mean, color='red', label='Rolling Mean')
    # plt.plot(rolling_std, color='black', label='Rolling Std')
    # plt.legend(loc='best')
    # plt.title('Rolling Mean & Standard Deviation')
    # plt.show()
    
    # Perform Augmented Dickey-Fuller test
    adf_result = adfuller(time_series)
    # print('ADF Statistic: %f' % adf_result[0])
    # print('p-value: %f' % adf_result[1])
    # print('Critical Values:')
    # for key, value in adf_result[4].items():
    #     print('\t%s: %.3f' % (key, value))
    return adf_result[1]



@app.route("/ptn_analysis", methods=["POST", "GET"])
def ptn_analysis():
    ptn_series = request.get_json()["patterns"]
    ptn_series = [p['data'] for p in ptn_series]
    ptn_results = []

    period = 10   # CHANGE, period
    lag = 10    # CHANGE, lag

    for p in ptn_series:
        df = pd.DataFrame(p)
        result = {}
        # -> stationarity
        p_value = check_stationarity(df)
        if ( p_value<0.05 ):
            result['stationary'] = True
        else:
            result['stationary'] = False

        # -> decompose
        # freq = pd.infer_freq(df.index)
        decomposition = seasonal_decompose(df, model='additive', period=period)
        # result['trend'] = [t for t in decomposition.trend.tolist() if not math.isnan(t)]
        result['trend'] = [x for x in decomposition.trend.tolist() if str(x) != 'nan']
        # result['seasonal'] = [s for s in decomposition.seasonal.tolist() if not math.isnan(s)]
        result['seasonal'] = [x for x in decomposition.seasonal.tolist() if str(x) != 'nan']
        # print("CCC: ", len(result['trend']))
        # print("DDD: ", decomposition.seasonal)
        # -> acf
        acorr = sm.tsa.acf(df, nlags=lag-1)
        result['acf'] = [a for a in acorr.tolist() if not math.isnan(a)]

        ptn_results.append(result)

    return jsonify(results=ptn_results)



@app.route("/granger_matrix", methods=["POST", "GET"])
def granger_matrix():
    series_data = request.get_json()["mem_series"]  # dict
    ptn =  request.get_json()["ptn"]
    print("XXXXX: ", ptn)
    variables = sorted(series_data.keys())    # 's10', 's2'

    series = []
    for v in variables:
        s = series_data[v]
        series.append(s)
    df_series = pd.DataFrame(series)

    maxlag = 2      # CHANGE
    test = 'ssr_chi2test'
    df_granger = np.zeros((len(variables), len(variables)))

    for i in range(len(variables)):   # CHANGE: df_series
        for j in range(len(variables)):
            row = df_series.iloc[i]
            col = df_series.iloc[j]
            g_data = pd.DataFrame(np.array([row, col]).T)
            test_result = grangercausalitytests(g_data, maxlag=maxlag, verbose=False)
            p_values = [round(test_result[i+1][0][test][1],4) for i in range(maxlag)]
            # if verbose: print(f'Y = {r}, X = {c}, P Values = {p_values}')
            min_p_value = np.min(p_values)
            df_granger[i, j] = min_p_value
    df_granger = np.around(df_granger, decimals=3)
    # print("RRRR: ", df_granger)
    # print("SSShape: ", df_granger.shape)

    # filter upper triangle
    # granger_cor = {}
    # for i in range(len(variables)):
    #     for j in range(i+1, len(variables)):
    #         granger_cor['s'+str(i)+'_'+'s'+str(j)] = df[i][j]

    return jsonify({'granger_matrix': df_granger.tolist()})



@app.route("/co_cluster", methods=["POST", "GET"])
def co_cluster():
    model = SpectralCoclustering(n_clusters=5, random_state=13)  # CHANGE
    model.fit(data)
    # fit_data = data[np.argsort(model.row_labels_)]
    # fit_data = fit_data[:, np.argsort(model.column_labels_)]





if __name__ == '__main__':
    app.run(debug=True)  