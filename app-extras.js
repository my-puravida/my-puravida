/* ===== Marees 2027 (estimation), Bitcoin en direct, rappel de sauvegarde, humeurs, bilan ===== */
(function(){
  /* ---------- 1. Marees 2027 : estimation par analyse harmonique ---------- */
  var TD27=["l0305/1.3 h0911/7.4 l1516/1.5 h2141/8.3", "l0409/1.5 h1015/7.1 l1617/1.9 h2240/8.1", "l0511/1.6 h1117/7 l1716/2.1 h2334/8", "l0606/1.5 h1213/7 l1811/2.1", "h0024/8 l0655/1.4 h1302/7.2 l1859/2.1", "h0108/8.1 l0736/1.2 h1345/7.4 l1942/2", "h0148/8.2 l0814/1 h1424/7.7 l2021/1.8", "h0227/8.3 l0849/0.8 h1501/7.9 l2059/1.6", "h0305/8.5 l0924/0.6 h1537/8.2 l2137/1.3", "h0343/8.5 l0959/0.5 h1614/8.4 l2216/1.2", "h0422/8.5 l1036/0.4 h1652/8.6 l2257/1.1", "h0503/8.4 l1113/0.5 h1732/8.7 l2339/1.1", "h0545/8.2 l1153/0.7 h1814/8.6", "l0024/1.1 h0630/7.9 l1236/0.9 h1859/8.6", "l0113/1.2 h0720/7.6 l1322/1.2 h1948/8.5", "l0206/1.4 h0814/7.3 l1413/1.4 h2042/8.4", "l0304/1.4 h0915/7.2 l1511/1.6 h2142/8.4", "l0407/1.3 h1019/7.2 l1615/1.6 h2244/8.5", "l0510/1.1 h1124/7.4 l1720/1.5 h2345/8.7", "l0611/0.7 h1225/7.9 l1824/1.1", "h0044/9.1 l0707/0.3 h1321/8.4 l1923/0.7", "h0139/9.4 l0800/-0.2 h1414/9 l2019/0.3", "h0231/9.7 l0850/-0.5 h1504/9.5 l2112/-0.1", "h0322/9.8 l0938/-0.7 h1553/9.8 l2203/-0.2", "h0411/9.7 l1026/-0.7 h1642/9.9 l2254/-0.2", "h0501/9.5 l1113/-0.5 h1731/9.8 l2345/0", "h0551/9.1 l1202/-0.1 h1821/9.5", "l0037/0.4 h0643/8.5 l1251/0.4 h1912/9", "l0131/0.9 h0737/7.9 l1343/1.1 h2006/8.5", "l0229/1.4 h0836/7.3 l1439/1.7 h2103/8", "l0331/1.8 h0940/6.8 l1540/2.3 h2203/7.6", "l0436/2 h1045/6.6 l1643/2.6 h2302/7.4", "l0537/2 h1146/6.6 l1744/2.7 h2356/7.4", "l0628/1.9 h1237/6.8 l1835/2.5", "h0043/7.5 l0711/1.7 h1320/7.1 l1919/2.3", "h0124/7.7 l0747/1.4 h1357/7.5 l1957/1.9", "h0202/8 l0821/1 h1432/7.9 l2034/1.5", "h0239/8.4 l0854/0.7 h1507/8.4 l2111/1", "h0317/8.6 l0929/0.4 h1543/8.8 l2149/0.7", "h0356/8.8 l1005/0.2 h1620/9.1 l2229/0.4", "h0436/8.8 l1043/0.1 h1700/9.3 l2310/0.4", "h0518/8.7 l1123/0.2 h1742/9.3 l2355/0.4", "h0602/8.4 l1206/0.5 h1826/9.1", "l0042/0.7 h0650/8 l1252/0.8 h1916/8.8", "l0135/1 h0744/7.7 l1345/1.2 h2012/8.5", "l0234/1.2 h0846/7.3 l1446/1.5 h2115/8.3", "l0339/1.4 h0955/7.3 l1555/1.7 h2223/8.2", "l0449/1.3 h1105/7.5 l1707/1.6 h2330/8.4", "l0554/1 h1210/7.9 l1815/1.2", "h0032/8.7 l0653/0.5 h1307/8.5 l1916/0.7", "h0128/9.1 l0746/0 h1359/9.2 l2010/0.2", "h0219/9.4 l0834/-0.4 h1448/9.7 l2100/-0.2", "h0307/9.6 l0920/-0.6 h1534/10 l2147/-0.4", "h0354/9.7 l1005/-0.6 h1620/10.1 l2234/-0.4", "h0441/9.5 l1050/-0.4 h1705/9.9 l2321/-0.2", "h0527/9.1 l1135/0 h1751/9.5", "l0008/0.3 h0615/8.5 l1221/0.6 h1839/8.9", "l0058/0.9 h0706/7.8 l1310/1.3 h1929/8.3", "l0151/1.5 h0801/7.2 l1403/2 h2024/7.6", "l0250/2 h0903/6.7 l1503/2.6 h2124/7.1", "l0355/2.3 h1010/6.4 l1610/2.9 h2227/6.9", "l0459/2.4 h1114/6.4 l1715/3 h2326/6.9", "l0554/2.3 h1206/6.6 l1809/2.7", "h0015/7.1 l0637/2.1 h1248/7 l1852/2.3", "h0057/7.4 l0713/1.7 h1324/7.5 l1929/1.8", "h0135/7.9 l0747/1.2 h1358/8.1 l2005/1.2", "h0212/8.3 l0821/0.7 h1433/8.7 l2042/0.6", "h0250/8.7 l0857/0.3 h1510/9.2 l2121/0.2", "h0329/9 l0934/0 h1549/9.6 l2201/-0.1", "h0410/9.1 l1014/-0.1 h1629/9.8 l2243/-0.2", "h0452/9 l1055/0 h1712/9.7 l2328/-0.1", "h0537/8.8 l1140/0.3 h1759/9.4", "l0016/0.2 h0627/8.4 l1229/0.7 h1850/9", "l0109/0.7 h0722/7.9 l1324/1.1 h1948/8.5", "l0209/1.1 h0826/7.6 l1430/1.5 h2055/8.1", "l0317/1.4 h0937/7.5 l1544/1.7 h2207/8", "l0429/1.4 h1049/7.7 l1700/1.5 h2318/8.1", "l0537/1.1 h1154/8.2 l1807/1.1", "h0020/8.4 l0636/0.7 h1251/8.7 l1905/0.6", "h0115/8.8 l0728/0.3 h1341/9.3 l1956/0.1", "h0204/9.2 l0814/-0.1 h1427/9.8 l2043/-0.3", "h0250/9.4 l0859/-0.3 h1511/10 l2128/-0.5", "h0334/9.4 l0942/-0.3 h1554/10 l2211/-0.4", "h0418/9.3 l1025/-0.1 h1637/9.8 l2255/-0.2", "h0503/8.9 l1108/0.3 h1721/9.3 l2339/0.3", "h0548/8.4 l1152/0.9 h1806/8.7", "l0025/0.9 h0636/7.8 l1239/1.6 h1853/8", "l0114/1.5 h0728/7.2 l1329/2.3 h1944/7.3", "l0208/2 h0826/6.7 l1427/2.8 h2043/6.8", "l0308/2.4 h0930/6.4 l1533/3.1 h2147/6.5", "l0411/2.6 h1032/6.4 l1639/3 h2248/6.5", "l0507/2.5 h1124/6.7 l1734/2.7 h2340/6.8", "l0552/2.3 h1207/7.1 l1817/2.2", "h0024/7.2 l0631/1.9 h1245/7.7 l1856/1.6", "h0104/7.7 l0708/1.4 h1321/8.4 l1934/0.9", "h0143/8.2 l0745/0.8 h1359/9 l2013/0.3", "h0222/8.7 l0824/0.4 h1438/9.6 l2053/-0.2", "h0303/9.1 l0904/0 h1519/9.9 l2135/-0.5", "h0345/9.3 l0947/-0.1 h1602/10.1 l2218/-0.6", "h0430/9.2 l1031/-0.1 h1647/9.9 l2305/-0.4", "h0517/9 l1119/0.2 h1736/9.5 l2354/0", "h0608/8.7 l1212/0.6 h1829/9", "l0048/0.4 h0706/8.3 l1311/1.1 h1930/8.4", "l0149/0.9 h0810/8 l1420/1.5 h2039/8", "l0258/1.2 h0921/7.9 l1535/1.6 h2152/7.8", "l0409/1.3 h1031/8 l1649/1.4 h2302/7.9", "l0515/1.2 h1134/8.4 l1754/1", "h0004/8.2 l0614/0.9 h1229/8.9 l1850/0.5", "h0057/8.5 l0705/0.5 h1318/9.3 l1938/0.1", "h0145/8.8 l0751/0.3 h1403/9.6 l2023/-0.2", "h0230/9 l0835/0.2 h1446/9.8 l2106/-0.3", "h0313/9.1 l0918/0.2 h1528/9.7 l2147/-0.3", "h0356/9 l0959/0.4 h1610/9.5 l2229/-0.1", "h0439/8.7 l1042/0.8 h1651/9 l2311/0.3", "h0523/8.3 l1125/1.2 h1734/8.5 l2354/0.8", "h0608/7.8 l1210/1.8 h1819/7.8", "l0039/1.4 h0657/7.3 l1258/2.3 h1907/7.3", "l0127/1.9 h0749/6.9 l1352/2.7 h2001/6.8", "l0219/2.3 h0845/6.7 l1452/2.9 h2101/6.5", "l0314/2.5 h0942/6.7 l1553/2.9 h2201/6.4", "l0408/2.5 h1033/7 l1648/2.5 h2256/6.6", "l0458/2.3 h1119/7.4 l1736/2 h2344/7", "l0543/2 h1202/7.9 l1820/1.4", "h0029/7.5 l0626/1.5 h1244/8.6 l1902/0.8", "h0112/8.1 l0709/1 h1326/9.2 l1944/0.1", "h0155/8.6 l0753/0.5 h1409/9.7 l2027/-0.4", "h0239/9 l0838/0.1 h1453/10 l2112/-0.7", "h0324/9.2 l0924/0 h1539/10.1 l2158/-0.7", "h0411/9.3 l1013/0 h1627/9.9 l2246/-0.6", "h0501/9.2 l1105/0.2 h1719/9.6 l2337/-0.3", "h0554/9 l1200/0.6 h1814/9", "l0032/0.2 h0652/8.7 l1302/0.9 h1915/8.5", "l0132/0.7 h0755/8.4 l1409/1.2 h2022/8", "l0236/1 h0902/8.3 l1521/1.4 h2132/7.7", "l0344/1.2 h1008/8.4 l1631/1.2 h2240/7.7", "l0448/1.2 h1109/8.6 l1734/1 h2342/7.8", "l0547/1.1 h1204/8.9 l1829/0.6", "h0036/8.1 l0639/1 h1254/9.1 l1918/0.3", "h0125/8.3 l0727/0.8 h1339/9.3 l2002/0.1", "h0210/8.5 l0811/0.8 h1421/9.3 l2044/0", "h0253/8.6 l0854/0.8 h1503/9.3 l2125/0", "h0335/8.5 l0936/0.9 h1543/9.1 l2204/0.2", "h0416/8.4 l1017/1.2 h1624/8.7 l2244/0.4", "h0458/8.2 l1059/1.5 h1705/8.3 l2325/0.8", "h0541/7.9 l1143/1.8 h1748/7.9", "l0006/1.2 h0626/7.6 l1228/2.1 h1833/7.4", "l0048/1.6 h0712/7.4 l1317/2.4 h1921/7", "l0133/1.9 h0800/7.2 l1409/2.5 h2014/6.7", "l0221/2.2 h0850/7.2 l1504/2.5 h2111/6.6", "l0311/2.3 h0941/7.4 l1559/2.2 h2207/6.7", "l0403/2.2 h1031/7.7 l1652/1.8 h2302/6.9", "l0455/1.9 h1120/8.2 l1743/1.3 h2353/7.3", "l0546/1.6 h1208/8.7 l1831/0.7", "h0042/7.8 l0636/1.1 h1256/9.2 l1918/0.2", "h0130/8.4 l0726/0.7 h1344/9.6 l2005/-0.3", "h0218/8.8 l0817/0.3 h1432/9.9 l2053/-0.6", "h0307/9.2 l0907/0.1 h1522/10 l2141/-0.8", "h0356/9.4 l1000/0 h1612/9.9 l2231/-0.7", "h0447/9.4 l1053/0.1 h1705/9.6 l2322/-0.5", "h0541/9.3 l1150/0.3 h1800/9.1", "l0016/-0.1 h0637/9.2 l1249/0.6 h1858/8.6", "l0112/0.4 h0736/8.9 l1353/0.9 h2001/8.1", "l0212/0.8 h0837/8.7 l1459/1.1 h2107/7.7", "l0314/1.2 h0940/8.6 l1605/1.2 h2213/7.5", "l0417/1.4 h1041/8.5 l1709/1.1 h2316/7.5", "l0517/1.5 h1137/8.6 l1806/1", "h0013/7.6 l0613/1.5 h1228/8.6 l1857/0.8", "h0104/7.7 l0704/1.5 h1315/8.7 l1942/0.6", "h0150/7.9 l0750/1.4 h1358/8.8 l2024/0.5", "h0233/8.1 l0833/1.4 h1439/8.8 l2103/0.4", "h0314/8.2 l0914/1.3 h1519/8.7 l2141/0.4", "h0354/8.3 l0954/1.4 h1559/8.6 l2218/0.5", "h0433/8.3 l1034/1.4 h1638/8.4 l2256/0.6", "h0512/8.2 l1115/1.5 h1719/8.1 l2333/0.9", "h0552/8.1 l1157/1.7 h1801/7.8", "l0012/1.1 h0633/8 l1241/1.8 h1845/7.4", "l0052/1.4 h0717/7.9 l1328/1.9 h1933/7.1", "l0136/1.7 h0803/7.8 l1419/2 h2025/6.9", "l0223/1.9 h0853/7.9 l1513/1.9 h2122/6.8", "l0316/1.9 h0947/8 l1610/1.7 h2221/6.9", "l0413/1.9 h1042/8.3 l1708/1.3 h2320/7.2", "l0512/1.6 h1138/8.6 l1803/0.9", "h0016/7.6 l0610/1.3 h1232/9 l1856/0.4", "h0110/8.2 l0707/0.9 h1325/9.4 l1948/-0.1", "h0201/8.7 l0802/0.4 h1417/9.7 l2038/-0.5", "h0252/9.2 l0856/0.1 h1508/9.9 l2127/-0.7", "h0342/9.6 l0949/-0.1 h1559/9.9 l2216/-0.8", "h0433/9.8 l1042/-0.1 h1651/9.6 l2306/-0.7", "h0524/9.8 l1136/0 h1744/9.3 l2357/-0.3", "h0617/9.6 l1231/0.3 h1838/8.7", "l0049/0.1 h0711/9.3 l1329/0.7 h1936/8.2", "l0144/0.7 h0808/8.9 l1430/1 h2037/7.7", "l0242/1.2 h0908/8.5 l1534/1.3 h2142/7.3", "l0344/1.6 h1009/8.2 l1639/1.5 h2247/7.1", "l0448/1.9 h1108/8.1 l1741/1.5 h2349/7.1", "l0548/2.1 h1204/8 l1835/1.3", "h0043/7.2 l0643/2 h1253/8.1 l1922/1.2", "h0131/7.4 l0731/1.9 h1337/8.2 l2003/1", "h0213/7.7 l0813/1.7 h1418/8.3 l2040/0.8", "h0251/8 l0852/1.5 h1456/8.4 l2115/0.6", "h0328/8.2 l0930/1.3 h1534/8.5 l2150/0.5", "h0404/8.4 l1007/1.2 h1611/8.5 l2225/0.5", "h0440/8.6 l1045/1.1 h1650/8.4 l2300/0.5", "h0517/8.6 l1125/1.1 h1730/8.2 l2337/0.7", "h0556/8.6 l1206/1.1 h1811/7.9", "l0016/0.9 h0637/8.5 l1250/1.3 h1856/7.6", "l0058/1.2 h0723/8.4 l1339/1.4 h1946/7.3", "l0145/1.5 h0813/8.2 l1433/1.5 h2043/7.1", "l0239/1.7 h0910/8.2 l1534/1.6 h2146/7", "l0341/1.8 h1011/8.2 l1637/1.4 h2252/7.2", "l0447/1.7 h1115/8.4 l1740/1.1 h2355/7.6", "l0553/1.4 h1215/8.7 l1839/0.6", "h0053/8.1 l0655/1 h1312/9.1 l1933/0.1", "h0147/8.8 l0752/0.4 h1405/9.5 l2023/-0.3", "h0238/9.4 l0846/0 h1456/9.8 l2112/-0.7", "h0327/9.8 l0937/-0.3 h1546/9.8 l2200/-0.8", "h0415/10.1 l1027/-0.4 h1635/9.7 l2247/-0.7", "h0504/10.1 l1117/-0.3 h1724/9.4 l2335/-0.4", "h0553/9.8 l1209/0 h1815/8.9", "l0024/0.1 h0643/9.4 l1302/0.5 h1908/8.2", "l0115/0.7 h0737/8.8 l1358/1 h2006/7.6", "l0211/1.4 h0834/8.3 l1500/1.5 h2110/7.1", "l0312/2 h0936/7.8 l1607/1.8 h2218/6.8", "l0419/2.4 h1040/7.5 l1713/1.9 h2324/6.7", "l0526/2.5 h1139/7.4 l1812/1.9", "h0022/6.9 l0624/2.5 h1231/7.5 l1859/1.7", "h0109/7.2 l0712/2.2 h1316/7.7 l1939/1.4", "h0148/7.5 l0751/1.9 h1354/7.9 l2013/1.1", "h0223/7.9 l0827/1.5 h1431/8.2 l2045/0.8", "h0257/8.3 l0902/1.1 h1507/8.5 l2118/0.5", "h0330/8.7 l0937/0.8 h1543/8.7 l2151/0.4", "h0406/9 l1014/0.5 h1621/8.7 l2227/0.3", "h0442/9.2 l1053/0.4 h1700/8.6 l2304/0.4", "h0521/9.2 l1134/0.5 h1741/8.4 l2344/0.6", "h0603/9 l1218/0.7 h1826/8.1", "l0027/0.9 h0649/8.8 l1306/1 h1916/7.7", "l0116/1.2 h0740/8.5 l1401/1.3 h2013/7.3", "l0213/1.6 h0840/8.2 l1504/1.5 h2120/7.2", "l0319/1.8 h0948/8 l1612/1.5 h2230/7.3", "l0432/1.8 h1057/8.1 l1721/1.2 h2338/7.7", "l0543/1.4 h1202/8.4 l1822/0.8", "h0038/8.3 l0646/0.9 h1300/8.9 l1917/0.3", "h0131/9 l0742/0.3 h1353/9.3 l2007/-0.2", "h0221/9.6 l0833/-0.2 h1442/9.6 l2054/-0.5", "h0308/10 l0921/-0.5 h1529/9.7 l2140/-0.7", "h0354/10.2 l1009/-0.6 h1616/9.7 l2225/-0.6", "h0440/10.2 l1055/-0.5 h1703/9.4 l2310/-0.3", "h0526/9.8 l1143/-0.1 h1751/8.9 l2357/0.3", "h0614/9.3 l1233/0.4 h1842/8.2", "l0047/1 h0705/8.6 l1326/1.1 h1937/7.6", "l0141/1.7 h0800/7.9 l1425/1.7 h2039/7", "l0242/2.3 h0902/7.3 l1531/2.1 h2148/6.7", "l0352/2.7 h1009/7 l1639/2.3 h2256/6.6", "l0503/2.8 h1112/6.9 l1740/2.3 h2353/6.7", "l0601/2.7 h1206/7 l1828/2.1", "h0038/7.1 l0647/2.3 h1249/7.3 l1905/1.8", "h0115/7.5 l0723/1.9 h1327/7.6 l1938/1.4", "h0148/8 l0757/1.4 h1402/8.1 l2009/1", "h0221/8.5 l0831/0.8 h1437/8.5 l2042/0.6", "h0255/9 l0906/0.4 h1514/8.8 l2117/0.3", "h0331/9.4 l0943/0 h1552/8.9 l2154/0.2", "h0409/9.6 l1023/-0.1 h1632/8.9 l2234/0.2", "h0450/9.6 l1105/-0.1 h1715/8.7 l2316/0.4", "h0533/9.4 l1150/0.2 h1801/8.4", "l0002/0.7 h0621/9 l1240/0.6 h1853/8", "l0055/1.1 h0716/8.5 l1336/1 h1952/7.7", "l0156/1.5 h0819/8.1 l1440/1.4 h2101/7.5", "l0307/1.7 h0931/7.9 l1551/1.5 h2213/7.6", "l0423/1.7 h1043/7.9 l1701/1.3 h2321/8", "l0534/1.3 h1149/8.2 l1803/0.9", "h0020/8.6 l0635/0.7 h1246/8.6 l1858/0.5", "h0112/9.2 l0729/0.2 h1337/9 l1947/0", "h0200/9.7 l0817/-0.3 h1425/9.4 l2033/-0.3", "h0246/10.1 l0903/-0.6 h1511/9.5 l2117/-0.4", "h0330/10.2 l0948/-0.7 h1556/9.5 l2202/-0.3", "h0414/10 l1032/-0.5 h1641/9.2 l2246/0.1", "h0459/9.6 l1118/-0.1 h1727/8.8 l2332/0.6", "h0545/9 l1205/0.5 h1816/8.2", "l0021/1.3 h0634/8.3 l1254/1.1 h1909/7.6", "l0113/1.9 h0727/7.6 l1349/1.7 h2008/7.1", "l0213/2.5 h0826/7 l1450/2.2 h2113/6.7", "l0321/2.9 h0932/6.6 l1555/2.5 h2217/6.6", "l0430/2.9 h1036/6.5 l1654/2.5 h2312/6.8", "l0527/2.7 h1130/6.7 l1742/2.4 h2356/7.1", "l0611/2.3 h1214/7 l1820/2.1", "h0033/7.5 l0647/1.8 h1252/7.4 l1855/1.7", "h0108/8.1 l0722/1.2 h1329/7.9 l1930/1.2", "h0143/8.7 l0758/0.6 h1406/8.3 l2006/0.8", "h0220/9.2 l0835/0.1 h1445/8.7 l2044/0.4", "h0259/9.6 l0915/-0.3 h1525/9 l2125/0.2", "h0340/9.9 l0956/-0.5 h1608/9.1 l2208/0.1", "h0423/9.8 l1041/-0.4 h1653/9 l2254/0.3", "h0510/9.6 l1128/-0.1 h1742/8.7 l2345/0.6", "h0601/9.1 l1219/0.3 h1836/8.4", "l0041/1 h0658/8.6 l1317/0.7 h1937/8.1", "l0145/1.4 h0803/8.1 l1420/1.1 h2045/8", "l0257/1.5 h0914/7.8 l1529/1.3 h2154/8.1", "l0411/1.4 h1026/7.8 l1637/1.2 h2300/8.4", "l0520/1.1 h1131/8 l1739/1 h2358/8.8", "l0619/0.6 h1228/8.3 l1834/0.7", "h0050/9.3 l0711/0.2 h1319/8.7 l1924/0.4", "h0137/9.6 l0758/-0.2 h1406/8.9 l2010/0.2", "h0222/9.8 l0843/-0.4 h1451/9.1 l2055/0.1", "h0306/9.9 l0926/-0.5 h1536/9.1 l2139/0.2", "h0350/9.7 l1010/-0.3 h1620/8.9 l2224/0.5", "h0433/9.3 l1053/0 h1706/8.6 l2309/1", "h0518/8.8 l1138/0.5 h1753/8.2 l2357/1.5", "h0605/8.1 l1225/1 h1843/7.7", "l0047/2 h0654/7.5 l1314/1.6 h1936/7.3", "l0142/2.5 h0749/6.9 l1406/2.1 h2032/7", "l0242/2.8 h0847/6.6 l1501/2.4 h2128/6.9", "l0343/2.8 h0947/6.4 l1554/2.5 h2220/7", "l0438/2.6 h1042/6.5 l1643/2.5 h2305/7.2", "l0524/2.2 h1130/6.7 l1726/2.2 h2346/7.7", "l0606/1.7 h1213/7.1 l1808/1.8", "h0026/8.2 l0645/1.1 h1254/7.6 l1849/1.4", "h0106/8.8 l0725/0.5 h1336/8.1 l1931/0.9", "h0147/9.3 l0807/0 h1418/8.6 l2015/0.5", "h0231/9.7 l0850/-0.4 h1502/8.9 l2101/0.2", "h0316/9.9 l0935/-0.6 h1548/9.1 l2148/0.1", "h0403/9.9 l1021/-0.6 h1636/9.2 l2239/0.2", "h0452/9.6 l1111/-0.4 h1728/9.1 l2333/0.5", "h0546/9.2 l1203/0 h1823/8.9", "l0031/0.8 h0643/8.7 l1259/0.4 h1922/8.6", "l0135/1.1 h0746/8.2 l1400/0.8 h2026/8.5", "l0243/1.2 h0854/7.8 l1505/1.1 h2131/8.5", "l0353/1.2 h1003/7.7 l1610/1.2 h2234/8.6", "l0459/1 h1108/7.8 l1712/1.2 h2332/8.9", "l0558/0.7 h1206/8 l1808/1", "h0025/9.1 l0651/0.4 h1259/8.2 l1900/0.9", "h0114/9.3 l0739/0.1 h1347/8.4 l1948/0.8", "h0200/9.4 l0824/0 h1433/8.6 l2034/0.7", "h0244/9.4 l0907/-0.1 h1517/8.7 l2119/0.8", "h0327/9.2 l0949/0 h1601/8.6 l2203/1", "h0410/9 l1031/0.2 h1645/8.5 l2248/1.2", "h0453/8.6 l1113/0.5 h1729/8.2 l2333/1.6", "h0537/8.1 l1155/0.9 h1814/7.9", "l0019/1.9 h0622/7.6 l1238/1.4 h1900/7.6", "l0107/2.2 h0710/7.1 l1321/1.8 h1947/7.4", "l0157/2.4 h0800/6.8 l1406/2.1 h2035/7.3", "l0249/2.5 h0853/6.5 l1453/2.3 h2123/7.3", "l0342/2.4 h0948/6.5 l1542/2.4 h2211/7.5", "l0433/2.1 h1041/6.6 l1632/2.2 h2259/7.8", "l0522/1.7 h1131/7 l1722/1.9 h2346/8.3", "l0610/1.2 h1220/7.4 l1812/1.5", "h0033/8.8 l0656/0.6 h1308/7.9 l1902/1.1", "h0121/9.2 l0743/0.1 h1355/8.4 l1952/0.7", "h0209/9.6 l0830/-0.3 h1443/8.9 l2043/0.3", "h0257/9.8 l0917/-0.6 h1532/9.2 l2134/0.1", "h0347/9.9 l1006/-0.7 h1622/9.4 l2227/0.1", "h0438/9.7 l1055/-0.6 h1713/9.5 l2321/0.2", "h0532/9.3 l1147/-0.3 h1807/9.4", "l0018/0.4 h0627/8.9 l1241/0.1 h1903/9.2", "l0118/0.7 h0727/8.4 l1337/0.5 h2002/9", "l0222/0.9 h0830/7.9 l1437/0.9 h2104/8.8", "l0327/1.1 h0936/7.6 l1540/1.2 h2206/8.6", "l0433/1.1 h1041/7.5 l1643/1.4 h2305/8.6", "l0535/1 h1143/7.5 l1743/1.5", "h0001/8.7 l0631/0.8 h1239/7.7 l1839/1.4", "h0053/8.7 l0721/0.6 h1329/7.9 l1930/1.4", "h0140/8.8 l0806/0.4 h1416/8.1 l2017/1.3", "h0224/8.8 l0848/0.3 h1459/8.3 l2101/1.2", "h0307/8.8 l0928/0.3 h1541/8.4 l2143/1.2", "h0348/8.7 l1007/0.3 h1621/8.4 l2225/1.3", "h0428/8.5 l1045/0.5 h1701/8.4 l2306/1.4"];
  var _tdGet=tdGet;
  tdGet=function(k){
    var p=k.split('-');
    if(+p[0]===2027){
      var doy=Math.round((Date.UTC(2027,+p[1]-1,+p[2])-Date.UTC(2027,0,1))/864e5),a=TD27[doy];
      if(!a)return null;
      return a.split(' ').map(function(t){return {t:t.charAt(0),h:t.slice(1,3)+':'+t.slice(3,5),v:parseFloat(t.slice(6))}}).sort(function(x,y2){return x.h<y2.h?-1:1});
    }
    return _tdGet(k);
  };
  tdMove=function(n){var p=tdate.split('-'),d=new Date(+p[0],+p[1]-1,+p[2]+n),s=iso(d);if(s<'2026-11-01'||s>'2027-12-31')return;tdate=s;ovUI()};
  var _tdH=tideHTML;
  tideHTML=function(){
    var h=_tdH();
    h=h.replace('max="2026-12-31"','max="2027-12-31"');
    var est=tdate.slice(0,4)==='2027';
    var foot='<p class="sub">Heure locale du Costa Rica · hauteurs en m · station NOAA Bahía de Uvita · source : kalonsurf.com. Nov.–déc. 2026 : données du site. 2027 : estimation calculée.</p>';
    if(est)foot='<p class="sub tdest"><b>Estimation</b> calculée à partir des marées de novembre et décembre 2026 (analyse harmonique). Écart possible d’environ 30 minutes et 15 cm : vérifie sur le site officiel avant de planifier une sortie.</p>'+foot;
    return h.replace(/<p class="sub">Heure locale du Costa Rica[^<]*<\/p>/,foot);
  };

  /* ---------- 2. Bitcoin en direct ---------- */
  var BTCL=null,btcBusy=false,btcErr='',btcTry=0;
  try{BTCL=JSON.parse(localStorage.getItem('btc-last'))}catch(e){}
  function J(u){return fetch(u,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})}
  function sample(a,n){if(!a||a.length<=n)return a;var st=a.length/n,o=[];for(var i=0;i<n;i++)o.push(a[Math.floor(i*st)]);o.push(a[a.length-1]);return o}
  function btcFetch(){
    if(btcBusy)return;btcBusy=true;btcTry=Date.now();
    var main=J('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,crc,cad&include_24hr_change=true')
      .then(function(j){var b=j.bitcoin;return{p:b.usd,c:b.usd_24h_change,eur:b.eur,crc:b.crc,cad:b.cad}})
      .catch(function(){return J('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').then(function(b){return{p:+b.lastPrice,c:+b.priceChangePercent,hi:+b.highPrice,lo:+b.lowPrice}})});
    var spark=J('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1')
      .then(function(j){return j.prices.map(function(x){return x[1]})})
      .catch(function(){return J('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24').then(function(k){return k.map(function(x){return +x[4]})})})
      .catch(function(){return null});
    Promise.all([main,spark]).then(function(r){
      var m=r[0],s=r[1];
      if(!(m&&m.p>0))throw new Error('prix');
      var d={p:m.p,c:m.c,eur:m.eur,crc:m.crc,cad:m.cad,t:Date.now()};
      if(s&&s.length>1){d.s=sample(s,48);d.hi=Math.max.apply(null,s.concat([m.p]));d.lo=Math.min.apply(null,s.concat([m.p]))}
      else{d.hi=m.hi||(BTCL&&BTCL.hi)||m.p;d.lo=m.lo||(BTCL&&BTCL.lo)||m.p;d.s=(BTCL&&BTCL.s)||null}
      BTCL=d;btcErr='';
      try{localStorage.setItem('btc-last',JSON.stringify(d))}catch(e){}
      /* taux du convertisseur : en direct, sauf si tu les as reglés toi-même */
      try{
        var cu={};try{cu=JSON.parse(localStorage.getItem('ag-fx'))||{}}catch(e){}
        if(!(cu.btc>0))FXR.btc=d.p;
        if(d.crc&&!(cu.crc>0))FXR.crc=d.crc/d.p;
        if(d.cad&&!(cu.cad>0))FXR.cad=d.cad/d.p;
      }catch(e){}
    }).catch(function(){
      btcErr=(navigator.onLine===false)?'Hors ligne':'Prix en direct non accessible ici';
    }).then(function(){btcBusy=false;if(OV==='btc')ovUI()});
  }
  setInterval(function(){if(OV==='btc'&&!btcBusy&&Date.now()-btcTry>55000)btcFetch()},15000);
  function nf(n){return Math.round(n).toLocaleString('fr-CA')}
  function hm(t){return new Date(t).toLocaleTimeString('fr-CA',{hour:'2-digit',minute:'2-digit'})}
  function spark(s){
    if(!s||s.length<2)return '';
    var mn=Math.min.apply(null,s),mx=Math.max.apply(null,s),rg=(mx-mn)||1;
    var pts=s.map(function(v,i){return (i*300/(s.length-1)).toFixed(1)+','+(74-(v-mn)*68/rg).toFixed(1)}).join(' ');
    return '<svg viewBox="0 0 300 80" width="100%" height="80" preserveAspectRatio="none"><polygon points="0,80 '+pts+' 300,80" fill="var(--hl)" opacity=".7"/><polyline points="'+pts+'" fill="none" stroke="#707072" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
  }
  btcHTML=function(){
    if(!btcBusy&&Date.now()-btcTry>45000)btcFetch();
    var d=BTCL||{p:BTCD.p,c:BTCD.c,hi:BTCD.hi,lo:BTCD.lo,s:BTCD.s,snap:BTCD.t},up=d.c>=0;
    var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Bitcoin</span><button onclick="ovClose()">✕</button></div>';
    h+='<div class="btc"><div class="bp">'+fmtUSD(d.p)+'</div><div class="bc '+(up?'up':'dn')+'">'+(up?'▲ +':'▼ ')+String(Math.round(d.c*100)/100).replace('.',',')+' % · 24 h</div></div>';
    h+='<div class="bsp">'+spark(d.s||BTCD.s)+'</div>';
    h+='<div class="bhl"><span>Plus bas 24 h<b>'+fmtUSD(d.lo)+'</b></span><span>Plus haut 24 h<b>'+fmtUSD(d.hi)+'</b></span></div>';
    if(d.cad||d.crc||d.eur)h+='<div class="bcx">'+(d.cad?'<span>'+nf(d.cad)+' $ CA</span>':'')+(d.crc?'<span>'+nf(d.crc)+' ₡</span>':'')+(d.eur?'<span>'+nf(d.eur)+' €</span>':'')+'</div>';
    var st;
    if(btcBusy)st='Mise à jour…';
    else if(BTCL&&!btcErr)st='En direct · mis à jour à '+hm(BTCL.t);
    else if(BTCL)st=btcErr+' · dernier prix à '+hm(BTCL.t);
    else st=(btcErr||'Connexion…')+' · aperçu du '+d.snap;
    h+='<p class="bst">'+st+'</p>';
    h+='<button class="brf" onclick="btcManual()">↻ Actualiser</button>';
    if(!BTCL)h+='<p class="sub">Le prix en direct s’affiche dans l’application installée (PWA) ou dans ton navigateur. Dans la visionneuse de l’application Claude, la connexion à la source de prix est bloquée.</p>';
    return h+'</div></div>';
  };
  window.btcManual=function(){btcTry=0;btcFetch();ovUI()};

  /* ---------- 3. Rappel de sauvegarde sur l'accueil ---------- */
  function keyCount(){var n=0;try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/^(ag|agw|agd)-/.test(k))n++}}catch(e){}return n}
  window.bkLater=function(){try{localStorage.setItem('bkdis',String(Date.now()))}catch(e){}render()};
  var _hpb=homePage;
  homePage=function(){
    var h=_hpb();
    try{
      var now=Date.now(),lb=lastBk(),dis=parseInt(localStorage.getItem('bkdis'),10)||0;
      if(now-lb>7*864e5&&now-dis>864e5&&keyCount()>=3){
        var days=lb?Math.floor((now-lb)/864e5):0;
        var txt=lb?('Dernière sauvegarde : il y a '+days+' jour'+(days>1?'s':'')):'Aucune sauvegarde pour l’instant';
        var b='<div class="bkb"><div class="bkt"><b>Pense à sauvegarder</b><span>'+txt+'</span></div><button class="bkg" onclick="ovOpen(\'backup\')">Sauvegarder</button><button class="bkx" onclick="bkLater()" aria-label="Plus tard">✕</button></div>';
        return b+h;
      }
    }catch(e){}
    return h;
  };

  /* ---------- 4. Analyse annuelle : humeurs + bilan ---------- */
  var SC=null;
  function yearScan(y){
    if(SC&&SC.y===y&&Date.now()-SC.at<15000)return SC;
    var nm=MOOD5.length,R={y:y,at:Date.now(),mood:[],mm:[],days:0,photos:0,beach:0,mk:0,el:0,wa:0,acts:[],actTot:0},i,m;
    for(i=0;i<nm;i++)R.mood.push(0);
    for(m=0;m<12;m++){var r=[];for(i=0;i<nm;i++)r.push(0);R.mm.push(r)}
    try{
      var pre='agd-'+y+'-';
      for(i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);if(!k||k.indexOf(pre)!==0)continue;
        var v=localStorage.getItem(k);if(!v||v.length<3)continue;
        var o;try{o=JSON.parse(v)}catch(e){continue}
        var p=k.split('-'),mo=+p[2]-1,filled=false;
        if(typeof o.mo==='number'&&o.mo>=0&&o.mo<nm){R.mood[o.mo]++;R.mm[mo][o.mo]++;filled=true}
        if((o.t&&String(o.t).trim())||(o.ti&&String(o.ti).trim()))filled=true;
        if(o.p&&o.p.length){R.photos+=o.p.length;filled=true}
        if(o.el)R.el++;
        if(o.wa)R.wa++;
        if(filled)R.days++;
      }
    }catch(e){}
    Object.keys(BCH).forEach(function(k){if(+k.split('-')[0]===y)R.beach++});
    try{var mk=JSON.parse(localStorage.getItem('ag-mk'))||{};Object.keys(mk).forEach(function(k){if(+k.split('-')[0]===y)R.mk++})}catch(e){}
    var c={},d=new Date(y,0,1);
    ACTH.forEach(function(a){R.acts.push({id:a[0],name:a[2],n:0})});
    while(d.getFullYear()===y){
      ACTH.forEach(function(a,ix){try{if(isDone(a[0],d,c)){R.acts[ix].n++;R.actTot++}}catch(e){}});
      d.setDate(d.getDate()+1);
    }
    SC=R;return R;
  }
  function topMood(R){var b=-1,bn=0;R.mood.forEach(function(n,i){if(n>bn){bn=n;b=i}});return b>=0?{i:b,n:bn}:null}
  function topAct(R){var b=null;R.acts.forEach(function(a){if(a.n>0&&(!b||a.n>b.n))b=a});return b}
  function moodBlock(R){
    var tot=R.mood.reduce(function(a,b){return a+b},0),blk='<h4 class="mgl">Humeurs</h4>';
    if(!tot)return blk+'<p class="sub">Aucune humeur enregistrée cette année.</p>';
    var order=R.mood.map(function(n,i){return{n:n,i:i}}).filter(function(x){return x.n>0}).sort(function(a,b){return b.n-a.n}),mx=order[0].n;
    blk+='<div class="mhs">'+order.map(function(x){return '<div class="mhr"><span class="mhf">'+MOOD5[x.i].s+'</span><b>'+MOOD5[x.i].n+'</b><div class="mhb"><i style="width:'+Math.round(x.n*100/mx)+'%"></i></div><em>'+x.n+'</em></div>'}).join('')+'</div>';
    blk+='<div class="mhm">'+R.mm.map(function(r,m){var best=-1,bn=0;r.forEach(function(n,i){if(n>bn){bn=n;best=i}});return '<div class="mhc"><span class="mhf">'+(best>=0?MOOD5[best].s:'<i class="mhe"></i>')+'</span><small>'+MONTHS[m].slice(0,3)+'</small></div>'}).join('')+'</div>';
    return blk;
  }
  var _yr4=yrHTML;
  yrHTML=function(){
    var h=_yr4(),y=curYear();if(!(y>0))y=new Date().getFullYear();
    var R=yearScan(y);
    var blk='<button class="bilb" onclick="ovOpen(\'bilan\')">Voir le bilan '+y+'</button>'+moodBlock(R);
    var a='<h4 class="mgl">Activités</h4>',i=h.indexOf(a);
    return i<0?h:h.slice(0,i)+blk+h.slice(i);
  };
  function bilanHTML(){
    var y=curYear();if(!(y>0))y=new Date().getFullYear();
    var R=yearScan(y),tm=topMood(R),ta=topAct(R);
    function tile(n,l,sub){return '<div class="bit"><b>'+n+'</b><span>'+l+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>'}
    var h='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Bilan</span><button onclick="ovClose()">✕</button></div>';
    h+='<div class="bil"><small>Mon agenda</small><h2>'+y+'</h2>';
    h+='<div class="bg">'+tile(R.days,'Jours racontés')+tile(R.beach,'Jours de plage')+tile(R.mk,'Jours singes')+tile(R.photos,'Photos')+tile(R.actTot,'Exercices cochés')+tile(R.el+R.wa,'Coupures','élec. '+R.el+' · eau '+R.wa)+'</div>';
    h+='<div class="bmm">';
    h+='<div class="bhb">'+(tm?'<span class="mhf big">'+MOOD5[tm.i].s+'</span><b>'+MOOD5[tm.i].n+'</b><small>Humeur dominante · '+tm.n+' j</small>':'<small>Pas encore d’humeur</small>')+'</div>';
    h+='<div class="bhb">'+(ta?'<img src="'+(ACTIMG[ta.id]||'')+'" alt=""><b>'+ta.name+'</b><small>Exercice n° 1 · '+ta.n+' j</small>':'<small>Pas encore d’exercice</small>')+'</div>';
    h+='</div></div>';
    h+='<button class="bilsh" onclick="bilanShare()">Partager en image</button>';
    return h+'</div></div>';
  }
  var _ov5=ovUI;
  ovUI=function(){
    if(OV==='bilan'){var el=document.getElementById('ovl');if(el){el.innerHTML=bilanHTML();return}}
    return _ov5();
  };
  var BILB=null;
  function loadImg(src){return new Promise(function(res){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){res(null)};im.src=src})}
  window.bilanShare=function(){
    var y=curYear();if(!(y>0))y=new Date().getFullYear();
    var R=yearScan(y),tm=topMood(R),ta=topAct(R);
    var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var g=cv.getContext('2d');
    var fl=(document.fonts&&document.fonts.load)?Promise.all([document.fonts.load('italic 500 100px Lora'),document.fonts.load('700 40px Nunito'),document.fonts.load('600 30px Nunito')]).catch(function(){}):Promise.resolve();
    var faceP=tm?loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(MOOD5[tm.i].s.replace('<svg ','<svg width="240" height="240" '))):Promise.resolve(null);
    var actP=ta&&ACTIMG[ta.id]?loadImg(ACTIMG[ta.id]):Promise.resolve(null);
    Promise.all([fl,faceP,actP]).then(function(r){
      var face=r[1],act=r[2];
      var bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#f9f8f6');bg.addColorStop(1,'#e8ced1');g.fillStyle=bg;g.fillRect(0,0,W,H);
      g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(W*0.78,170,300,0,Math.PI*2);g.fill();
      function rr(x,yy,w,h,rad){g.beginPath();g.moveTo(x+rad,yy);g.arcTo(x+w,yy,x+w,yy+h,rad);g.arcTo(x+w,yy+h,x,yy+h,rad);g.arcTo(x,yy+h,x,yy,rad);g.arcTo(x,yy,x+w,yy,rad);g.closePath()}
      rr(60,60,W-120,H-120,52);g.fillStyle='rgba(255,255,255,.72)';g.fill();g.lineWidth=2;g.strokeStyle='#f3e7e7';g.stroke();
      g.textAlign='center';g.textBaseline='alphabetic';
      g.fillStyle='#c48f97';g.font='600 28px Nunito, sans-serif';if('letterSpacing' in g)g.letterSpacing='12px';g.fillText('BILAN',W/2+6,170);if('letterSpacing' in g)g.letterSpacing='0px';
      var gr=g.createLinearGradient(380,0,700,0);gr.addColorStop(0,'#ac727e');gr.addColorStop(1,'#895a64');
      g.fillStyle=gr;g.font='italic 500 230px Lora, Georgia, serif';g.fillText(String(y),W/2,390);
      g.strokeStyle='#d9b0b6';g.lineWidth=3;g.beginPath();g.moveTo(300,440);g.lineTo(500,440);g.moveTo(580,440);g.lineTo(780,440);g.stroke();
      g.fillStyle='#d9b0b6';g.beginPath();g.moveTo(540,425);g.lineTo(555,440);g.lineTo(540,455);g.lineTo(525,440);g.closePath();g.fill();
      var tiles=[[R.days,'JOURS RACONTÉS'],[R.beach,'JOURS DE PLAGE'],[R.mk,'JOURS SINGES'],[R.photos,'PHOTOS'],[R.actTot,'EXERCICES COCHÉS'],[R.el+R.wa,'COUPURES']];
      tiles.forEach(function(t,i){
        var col=i%2,row=Math.floor(i/2),x=110+col*450,yy=500+row*160,w=410,h=140;
        rr(x,yy,w,h,28);g.fillStyle='#fff';g.fill();g.lineWidth=2;g.strokeStyle='#f3e7e7';g.stroke();
        g.fillStyle='#895a64';g.font='700 68px Nunito, sans-serif';g.fillText(String(t[0]),x+w/2,yy+78);
        g.fillStyle='#ac727e';g.font='600 22px Nunito, sans-serif';if('letterSpacing' in g)g.letterSpacing='4px';g.fillText(t[1],x+w/2+2,yy+118);if('letterSpacing' in g)g.letterSpacing='0px';
      });
      var by=1000;
      function box(x,draw,l1,l2){
        rr(x,by,410,230,28);g.fillStyle='#fff';g.fill();g.lineWidth=2;g.strokeStyle='#f3e7e7';g.stroke();
        draw(x+205);
        g.fillStyle='#525156';g.font='700 30px Nunito, sans-serif';g.fillText(l1,x+205,by+176);
        g.fillStyle='#ac727e';g.font='600 22px Nunito, sans-serif';g.fillText(l2,x+205,by+210);
      }
      box(110,function(cx){if(face)g.drawImage(face,cx-55,by+18,110,110);else{g.fillStyle='#d9b0b6';g.font='700 60px Nunito';g.fillText('–',cx,by+90)}},tm?MOOD5[tm.i].n:'Humeur',tm?'HUMEUR DOMINANTE · '+tm.n+' J':'PAS ENCORE');
      box(560,function(cx){if(act)g.drawImage(act,cx-55,by+18,110,110);else{g.fillStyle='#d9b0b6';g.font='700 60px Nunito';g.fillText('–',cx,by+90)}},ta?ta.name:'Exercice',ta?'EXERCICE N° 1 · '+ta.n+' J':'PAS ENCORE');
      g.fillStyle='#c48f97';g.font='600 24px Nunito, sans-serif';if('letterSpacing' in g)g.letterSpacing='8px';g.fillText('MON AGENDA',W/2+4,1295);if('letterSpacing' in g)g.letterSpacing='0px';
      cv.toBlob(function(blob){
        if(!blob)return;
        BILB=blob;var url=URL.createObjectURL(blob),el=document.getElementById('ovl');
        var file=null;try{file=new File([blob],'bilan-'+y+'.png',{type:'image/png'})}catch(e){}
        var can=file&&navigator.canShare&&navigator.canShare({files:[file]});
        if(el)el.innerHTML='<div class="tmo" onclick="ovClose()"><div class="tmc nc" onclick="event.stopPropagation()"><div class="tmx"><span>Bilan '+y+'</span><button onclick="ovClose()">✕</button></div>'
          +'<img class="bimg" src="'+url+'" alt="Bilan '+y+'"><div class="bact"><a href="'+url+'" download="bilan-'+y+'.png">Télécharger</a>'+(can?'<button onclick="bilanSend()">Partager</button>':'')+'</div>'
          +'<p class="sub">Maintiens ton doigt sur l’image pour l’enregistrer si le téléchargement est bloqué.</p></div></div>';
      },'image/png');
    });
  };
  window.bilanSend=function(){
    if(!BILB)return;var y=curYear();
    var f=new File([BILB],'bilan-'+y+'.png',{type:'image/png'});
    navigator.share({files:[f],text:'Mon bilan '+y}).catch(function(){});
  };
  /* bouton Bilan dans Memories */
  var _pp11=pastPage;
  pastPage=function(){
    return _pp11().replace('ovOpen(\'ystat\')">Statistiques</button>','ovOpen(\'ystat\')">Statistiques</button><button onclick="ovOpen(\'bilan\')">Bilan</button>');
  };

  var st=document.createElement('style');
  st.textContent='.tdest{background:#f9f8f6;border:1px solid #f3e7e7;border-radius:14px;padding:9px 12px;color:#525156}'
   +'.bcx{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;font-size:12px;color:#895a64;margin:8px 0 2px}.bst{text-align:center;font-size:11px;letter-spacing:.05em;color:#ac727e;margin:6px 0 0}'
   +'.brf{display:block;margin:10px auto 0;border:1px solid #f3e7e7;background:#fff;border-radius:999px;padding:7px 18px;font:inherit;font-size:12px;color:#525156;cursor:pointer}'
   +'.bkb{display:flex;align-items:center;gap:10px;margin:8px 4px 12px;padding:10px 12px;border-radius:18px;background:linear-gradient(135deg,#ffffff,#f9f8f6);border:1px solid #f3e7e7;box-shadow:0 10px 18px -14px rgba(82,81,86,.5)}'
   +'.bkt{flex:1;min-width:0}.bkt b{display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#525156}.bkt span{display:block;font-size:11.5px;color:#ac727e;margin-top:1px}'
   +'.bkg{flex:0 0 auto;border:0;border-radius:999px;background:linear-gradient(135deg,#ac727e,#895a64);color:#fff;font:inherit;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:8px 14px;cursor:pointer}'
   +'.bkx{flex:0 0 auto;border:0;background:none;color:#c48f97;font-size:16px;cursor:pointer;padding:2px 4px}'
   +'.mhs{margin:6px 0 10px}.mhr{display:flex;align-items:center;gap:8px;margin:5px 0}.mhf{display:inline-flex;width:26px;height:26px;flex:0 0 26px}.mhf svg{width:100%;height:100%;display:block}'
   +'.mhr b{flex:0 0 96px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#525156;font-weight:600}.mhb{flex:1;height:8px;border-radius:6px;background:#f3e7e7;overflow:hidden}.mhb i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#d9b0b6,#ac727e)}.mhr em{flex:0 0 22px;text-align:right;font-style:normal;font-size:12px;color:#895a64}'
   +'.mhm{display:grid;grid-template-columns:repeat(6,1fr);gap:8px 4px;margin:8px 0 4px}.mhc{display:flex;flex-direction:column;align-items:center;gap:2px}.mhc small{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#ac727e}.mhe{display:block;width:16px;height:16px;border-radius:50%;border:1.5px dashed #e8ced1;margin:5px}'
   +'.bilb{display:block;width:100%;margin:4px 0 6px;border:0;border-radius:999px;background:linear-gradient(135deg,#ac727e,#895a64);color:#fff;font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:11px;cursor:pointer;box-shadow:0 10px 16px -10px rgba(137,90,100,.7)}'
   +'.bil{text-align:center;padding:6px 0 4px}.bil small{display:block;font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:#c48f97}.bil h2{margin:2px 0 10px;font-family:"Lora",Georgia,serif;font-style:italic;font-weight:500;font-size:64px;line-height:1;background:linear-gradient(135deg,#ac727e,#895a64);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}'
   +'.bg{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bit{background:#fff;border:1px solid #f3e7e7;border-radius:16px;padding:10px 6px}.bit b{display:block;font-size:26px;color:#895a64;font-weight:700;line-height:1.1}.bit span{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#ac727e;margin-top:3px}.bit small{display:block;font-size:10px;letter-spacing:.02em;text-transform:none;color:#c48f97;margin-top:1px}'
   +'.bmm{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.bhb{background:#fff;border:1px solid #f3e7e7;border-radius:16px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;gap:3px}.bhb .mhf.big{width:48px;height:48px;flex:0 0 48px}.bhb img{width:48px;height:48px;object-fit:contain}.bhb b{font-size:13px;color:#525156;letter-spacing:.04em}.bhb small{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#ac727e}'
   +'.bilsh{display:block;margin:14px auto 0;border:0;border-radius:999px;background:#39393b;color:#fff;font:inherit;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:11px 22px;cursor:pointer}'
   +'.bimg{display:block;width:100%;border-radius:18px;box-shadow:0 18px 30px -18px rgba(57,57,59,.6)}.bact{display:flex;justify-content:center;gap:10px;margin-top:12px}.bact a,.bact button{border:0;border-radius:999px;background:#39393b;color:#fff;font:inherit;font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:10px 18px;text-decoration:none;cursor:pointer}';
  document.head.appendChild(st);
})();
/* ajustements : alignement des barres d'humeur, bandeau de sauvegarde plus discret */
(function(){
  var st=document.createElement('style');
  st.textContent='.mhr b{flex:0 0 118px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:10.5px}.bkb{padding:8px 12px;gap:8px}.bkt b{font-size:10.5px;letter-spacing:.06em}.bkt span{font-size:11px}.bkg{font-size:10px;padding:7px 12px}.mhero.nop~.mcard{margin-top:10px}';
  document.head.appendChild(st);
})();
/* Accueil : bande de la semaine + acces direct a la semaine en cours */
(function(){
  function shown(){var t=new Date();t.setDate(t.getDate()+(window.hOff||0));return t}
  window.homeWeek=function(){
    var t=shown(),s=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay());
    srGoW(iso(s));
  };
  function strip(){
    var t=shown(),s=new Date(t.getFullYear(),t.getMonth(),t.getDate()-t.getDay()),e=new Date(s.getFullYear(),s.getMonth(),s.getDate()+6);
    var td=new Date(),tk=td.getFullYear()+'-'+td.getMonth()+'-'+td.getDate();
    var mn=function(d){return MONTHS[d.getMonth()].slice(0,3).toLowerCase()};
    var rng=(s.getMonth()===e.getMonth())?(s.getDate()+'\u2013'+e.getDate()+' '+mn(e)):(s.getDate()+' '+mn(s)+' \u2013 '+e.getDate()+' '+mn(e));
    var L=['D','L','M','M','J','V','S'],cache={},h='<div class="wks"><button class="wkh" onclick="homeWeek()">Cette semaine \u00b7 '+rng+' <span>\u203a</span></button><div class="wkd">';
    for(var i=0;i<7;i++){
      var d=new Date(s.getFullYear(),s.getMonth(),s.getDate()+i),ex=0,bc=false;
      try{ACTH.forEach(function(a){if(a[0]!=='mx'&&a[0]!=='sx'&&isDone(a[0],d,cache))ex++})}catch(x){}
      var isT=(d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate())===tk;
      h+='<button class="wkc'+(isT?' today':'')+'" onclick="homeDay('+d.getFullYear()+','+d.getMonth()+','+d.getDate()+')"><small>'+L[i]+'</small><b>'+d.getDate()+'</b><span class="wdt">'+(ex?'<i class="ex"></i>':'')+'</span></button>';
    }
    return h+'</div></div>';
  }
  var _hpw=homePage;
  homePage=function(){
    var h=_hpw();
    try{
      var tpl=document.createElement('template');tpl.innerHTML=h;
      var hero=tpl.content.querySelector('.hero');
      if(!hero)return h;
      var hm=hero.querySelector('.hm2');
      if(hm){hm.setAttribute('onclick','event.stopPropagation();homeWeek()');hm.insertAdjacentHTML('beforeend','<span class="hdc">\u203a</span>')}
      hero.insertAdjacentHTML('afterend',strip());
      return tpl.innerHTML;
    }catch(e){return h}
  };
  var st=document.createElement('style');
  st.textContent='.wks{margin:2px 4px 16px;padding:10px 10px 12px;border-radius:20px;background:linear-gradient(135deg,#ffffff,#f9f8f6);border:1px solid #f3e7e7;box-shadow:0 12px 20px -16px rgba(82,81,86,.45)}'
   +'.wkh{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;border:0;background:none;font:inherit;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#895a64;padding:2px 0 9px;cursor:pointer}.wkh span{font-size:16px;line-height:1;color:#ac727e}'
   +'.wkd{display:flex;justify-content:space-between}.wkc{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;border:0;background:none;padding:0;font:inherit;cursor:pointer}'
   +'.wkc small{font-size:9px;letter-spacing:.12em;color:#ac727e;text-transform:uppercase}'
   +'.wkc b{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:#39393b;background:#fff;border:1px solid #f3e7e7}'
   +'.wkc.today b{background:linear-gradient(135deg,#c48f97,#ac727e);color:#fff;border-color:transparent;box-shadow:0 8px 12px -8px rgba(137,90,100,.7)}.wkc.today small{color:#895a64;font-weight:700}'
   +'.wkc .wdt{display:flex;gap:3px;height:6px;align-items:center}.wkc .wdt i{width:5px;height:5px;border-radius:50%}.wkc .wdt .ex{background:#ac727e}.wkc .wdt .bc{background:#b5b3b4}'
   +'.hero .hm2{cursor:pointer}';
  document.head.appendChild(st);
})();
/* Feux d'artifice sur les icones d'exercices, micro + cadenas dans les notes, post-it vieux rose fonce */
(function(){
  /* ---------- 1. feux d'artifice ---------- */
  var FWP=[],FWQ=[],fwRun=false;
  var COL=['#ac727e','#d9b0b6','#d9b0b6','#d9b0b6','#b5b3b4','#ffffff','#c48f97','#ac727e'];
  function fwCanvas(){
    var cv=document.getElementById('fwx');
    if(!cv){cv=document.createElement('canvas');cv.id='fwx';cv.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10050';document.body.appendChild(cv)}
    var dpr=window.devicePixelRatio||1,W=window.innerWidth,H=window.innerHeight;
    if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
    return cv;
  }
  function burst(x,y,n,big){
    var base=COL[Math.floor(Math.random()*COL.length)];
    for(var i=0;i<n;i++){
      var a=Math.random()*Math.PI*2,sp=(big?2.2:1.6)+Math.random()*(big?4.6:3.2);
      FWP.push({x:x,y:y,px:x,py:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:0,max:46+Math.random()*34,r:1.4+Math.random()*2,c:Math.random()<.55?base:COL[Math.floor(Math.random()*COL.length)]});
    }
  }
  function fwLoop(){
    var cv=document.getElementById('fwx');if(!cv){fwRun=false;return}
    var g=cv.getContext('2d'),dpr=window.devicePixelRatio||1,now=performance.now();
    g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,cv.width,cv.height);
    for(var q=FWQ.length-1;q>=0;q--){if(now>=FWQ[q].t){burst(FWQ[q].x,FWQ[q].y,FWQ[q].n,FWQ[q].big);FWQ.splice(q,1)}}
    for(var i=FWP.length-1;i>=0;i--){
      var p=FWP[i];p.life++;p.px=p.x;p.py=p.y;p.vx*=.985;p.vy=p.vy*.985+.07;p.x+=p.vx;p.y+=p.vy;
      var k=1-p.life/p.max;if(k<=0){FWP.splice(i,1);continue}
      g.globalAlpha=Math.max(0,k)*(0.65+0.35*Math.random());
      g.strokeStyle=p.c;g.lineWidth=p.r;g.lineCap='round';g.beginPath();g.moveTo(p.px,p.py);g.lineTo(p.x,p.y);g.stroke();
      g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r*0.8*k+.3,0,Math.PI*2);g.fill();
    }
    g.globalAlpha=1;
    if(FWP.length||FWQ.length)requestAnimationFrame(fwLoop);
    else{fwRun=false;cv.remove()}
  }
  window.fireworks=function(x,y){
    try{if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return}catch(e){}
    fwCanvas();var t=performance.now();
    FWQ.push({t:t,x:x,y:y-26,n:40,big:true},{t:t+130,x:x-58,y:y-86,n:30,big:false},{t:t+260,x:x+62,y:y-120,n:30,big:false},{t:t+400,x:x+6,y:y-160,n:36,big:true});
    if(!fwRun){fwRun=true;requestAnimationFrame(fwLoop)}
  };
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.actb'):null;
    if(!b)return;
    if(window.__lpSup&&Date.now()<window.__lpSup)return;
    var r=b.getBoundingClientRect();window.fireworks(r.left+r.width/2,r.top+r.height/2);
  },true);

  /* ---------- 2. notes : micro + cadenas ---------- */
  function toast(msg){
    var t=document.createElement('div');t.className='toastx';t.textContent=msg;document.body.appendChild(t);
    setTimeout(function(){t.classList.add('out')},1800);setTimeout(function(){t.remove()},2300);
  }
  var NLK=[];try{NLK=JSON.parse(localStorage.getItem('ag-nlk'))||[]}catch(e){}
  function nlSave(){try{localStorage.setItem('ag-nlk',JSON.stringify(NLK))}catch(e){}}
  window.noteLock=function(i){
    while(NLK.length<=i)NLK.push(false);
    NLK[i]=!NLK[i];nlSave();ovUI();
    toast(NLK[i]?'Note verrouill\u00e9e \ud83d\udd12':'Note d\u00e9verrouill\u00e9e');
  };
  var _nd3=noteDel;
  noteDel=function(i){
    if(NLK[i]){toast('Note verrouill\u00e9e \ud83d\udd12 \u2014 d\u00e9verrouille-la pour la supprimer');return}
    NLK.splice(i,1);nlSave();
    return _nd3.apply(this,arguments);
  };
  var MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11a6.500 6.500 0 0 0 13 0M12 17.500V21"/></svg>';
  var LKO='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9.500" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.400-2.100"/></svg>';
  var LKC='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9.500" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  var nRec=null,nBtn=null;
  window.nDict=function(btn,id){
    var el=id?document.getElementById(id):(btn.closest('.nn')&&btn.closest('.nn').querySelector('textarea'));
    if(!el)return;
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(nRec){var same=(nBtn===btn);try{nRec.stop()}catch(e){}if(same)return}
    if(!SR){toast('La dict\u00e9e vocale n\u2019est pas disponible ici. Utilise le micro du clavier.');return}
    var base=el.value,fin='',r=new SR();
    r.lang='fr-FR';r.interimResults=true;r.continuous=true;
    r.onresult=function(e){
      if(!document.body.contains(el)){try{r.stop()}catch(x){}return}
      var interim='';
      for(var i=e.resultIndex;i<e.results.length;i++){var tr=e.results[i][0].transcript;if(e.results[i].isFinal)fin+=tr;else interim+=tr}
      var sep=(base&&!/\s$/.test(base))?' ':'';
      el.value=base+sep+fin+interim;
      el.dispatchEvent(new Event('input',{bubbles:true}));
    };
    r.onerror=function(e){
      btn.classList.remove('on');
      toast(e.error==='not-allowed'||e.error==='service-not-allowed'?'Le micro est bloqu\u00e9. Autorise-le dans les r\u00e9glages, ou utilise le micro du clavier.':(e.error==='no-speech'?'Je n\u2019ai rien entendu.':'Dict\u00e9e indisponible ici.'));
    };
    r.onend=function(){btn.classList.remove('on');if(nRec===r){nRec=null;nBtn=null}};
    nRec=r;nBtn=btn;
    try{r.start();btn.classList.add('on')}catch(e){nRec=null;nBtn=null;toast('Impossible de d\u00e9marrer le micro.')}
  };
  var _nh2=notesHTML;
  notesHTML=function(){
    var h=_nh2();
    try{
      var tpl=document.createElement('template');tpl.innerHTML=h;
      Array.prototype.forEach.call(tpl.content.querySelectorAll('.nn'),function(n,i){
        var lk=!!NLK[i];if(lk)n.classList.add('lk');
        var b=document.createElement('button');
        b.className='nz nzl'+(lk?' on':'');b.setAttribute('aria-label',lk?'D\u00e9verrouiller':'Verrouiller');b.setAttribute('onclick','noteLock('+i+')');b.innerHTML=lk?LKC:LKO;
        var zp=n.querySelector('.nzp');if(zp)zp.insertAdjacentElement('afterend',b);else n.appendChild(b);
        var m=document.createElement('button');m.className='nmic nmi';m.setAttribute('aria-label','Dicter');m.setAttribute('onclick','nDict(this)');m.innerHTML=MIC;n.appendChild(m);
      });
      var q=tpl.content.querySelector('#qnin');
      if(q){var qm=document.createElement('button');qm.className='nmic';qm.setAttribute('aria-label','Dicter');qm.setAttribute('onclick',"nDict(this,'qnin')");qm.innerHTML=MIC;q.insertAdjacentElement('afterend',qm)}
      return tpl.innerHTML;
    }catch(e){return h}
  };

  /* ---------- 3. post-it de l'accueil : vieux rose fonce, date en blanc ---------- */
  var H='.hero.hcal',W='#fff';
  var css=''
   +'.nn .nzl{left:68px}.nn .nzl.on{background:#895a64;color:#fff}.nn.lk .rm{opacity:.28}'
   +'.nmic{flex:0 0 auto;width:36px;height:36px;border-radius:50%;border:1.5px solid #d9b0b6;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e7e3e0);color:#ac727e;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;margin-left:6px}.nmic svg{width:18px;height:18px}'
   +'.nmic.on{background:#c48f97;border-color:#c48f97;color:#fff;animation:dmp 1.3s ease-in-out infinite}'
   +'.nn .nmi{position:absolute;right:8px;bottom:8px;z-index:3;width:32px;height:32px;margin:0}'
   +H+'{overflow:visible;color:'+W+';'
   +'background:radial-gradient(circle at 90% 8%,rgba(255,255,255,.2),rgba(255,255,255,0) 40%),linear-gradient(180deg,rgba(255,255,255,.22) 0,rgba(255,255,255,0) 46px),linear-gradient(0deg,rgba(57,57,59,.22) 0,rgba(57,57,59,0) 60px),repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px),linear-gradient(165deg,#c48f97 0%,#ac727e 52%,#895a64 100%)!important;'
   +'box-shadow:0 1px 1px rgba(57,57,59,.25),0 20px 26px -12px rgba(82,81,86,.65),10px 24px 22px -16px rgba(57,57,59,.5)}'
   +H+'::before{display:block!important;content:"";position:absolute;left:50%;top:-11px;width:92px;height:24px;margin-left:-46px;transform:rotate(-3deg);background:rgba(255,255,255,.38);border:1px solid rgba(255,255,255,.55);box-shadow:0 2px 5px rgba(57,57,59,.18);border-radius:2px}'
   +H+' .hg{color:rgba(255,255,255,.82)}'
   +H+' .hn{background:none;-webkit-text-fill-color:'+W+';color:'+W+';text-shadow:0 3px 0 rgba(82,81,86,.35),0 10px 18px rgba(57,57,59,.3)}'
   +H+' .hd2{color:'+W+';border-left:1px solid rgba(255,255,255,.6);text-shadow:0 1px 2px rgba(57,57,59,.25)}'
   +H+' .hdc{opacity:.85}'
   +H+' .hm2{color:rgba(255,255,255,.9);border-left:1px solid rgba(255,255,255,.6);text-shadow:0 1px 2px rgba(57,57,59,.25)}'
   +H+' .hxw{border-top:1px solid rgba(255,255,255,.45)}'
   +H+' .hxr .wxc small{color:rgba(255,255,255,.92);text-shadow:0 1px 2px rgba(57,57,59,.3)}'
   +H+' .wxs{border:2px solid rgba(255,255,255,.9);box-shadow:0 6px 10px -6px rgba(57,57,59,.55)}'
   +H+' .wxs.e{background:rgba(255,255,255,.14);border:1.5px dashed rgba(255,255,255,.65);box-shadow:none}'
   +H+' .bcw{border:2px solid rgba(255,255,255,.9);box-shadow:0 6px 10px -6px rgba(57,57,59,.55)}'
   +H+' .hbn{color:'+W+';text-shadow:0 1px 3px rgba(57,57,59,.35)}'+H+' .hbn small{color:rgba(255,255,255,.8)}'
   +H+' .hch span{color:'+W+';background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5)}'
   +H+' .pbtn{background:rgba(255,255,255,.92);color:#895a64;border:1px solid rgba(255,255,255,.7);box-shadow:0 8px 14px -8px rgba(57,57,59,.6)}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* ajustements : micro de la note rapide, un seul rappel de sauvegarde */
(function(){
  var st=document.createElement('style');
  st.textContent='#ovl #qnin+.nmic{flex:0 0 auto;width:42px;height:42px;min-width:0;padding:0;margin:0 6px;border-radius:50%;border:1.5px solid #d9b0b6;background:radial-gradient(circle at 32% 26%,#fff,#f3e7e7 60%,#e7e3e0);color:#ac727e;display:flex;align-items:center;justify-content:center;font-size:0}#ovl #qnin+.nmic svg{width:20px;height:20px}#ovl #qnin+.nmic.on{background:#c48f97;border-color:#c48f97;color:#fff}.hmb.bk{display:none}';
  document.head.appendChild(st);
})();
/* Semaine : post-it "Objectifs de la semaine" comme l'accueil + feux d'artifice quand on coche */
(function(){
  var _wp=weekPage;
  weekPage=function(){return _wp().replace('<div class="postit">','<div class="postit wkpi">')};
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.wkpi .wc'):null;
    if(!b||!b.classList.contains('on'))return;
    var r=b.getBoundingClientRect();
    if(window.fireworks)window.fireworks(r.left+r.width/2,r.top+r.height/2);
  });
  var P='.postit.wkpi',W='#fff';
  var css=P+'{background:radial-gradient(circle at 90% 8%,rgba(255,255,255,.2),rgba(255,255,255,0) 40%),linear-gradient(180deg,rgba(255,255,255,.22) 0,rgba(255,255,255,0) 46px),linear-gradient(0deg,rgba(57,57,59,.22) 0,rgba(57,57,59,0) 60px),repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px),linear-gradient(165deg,#c48f97 0%,#ac727e 52%,#895a64 100%)!important;'
   +'box-shadow:0 1px 1px rgba(57,57,59,.25),0 20px 26px -12px rgba(82,81,86,.65),10px 24px 22px -16px rgba(57,57,59,.5);border-radius:3px 3px 8px 8px}'
   +P+' .tape{background:rgba(255,255,255,.38);border:1px solid rgba(255,255,255,.55);box-shadow:0 2px 5px rgba(57,57,59,.18)}'
   +P+' h3{color:'+W+';text-shadow:0 2px 0 rgba(82,81,86,.3),0 6px 12px rgba(57,57,59,.25)}'
   +P+' .wc{position:relative;border-color:rgba(255,255,255,.95)!important;background:transparent!important}'
   +P+' .wc.on{background:'+W+'!important;box-shadow:0 0 0 3px rgba(255,255,255,.25)}'
   +P+' .wc.on::after{content:"";position:absolute;left:50%;top:46%;width:30%;height:55%;border:solid #895a64;border-width:0 2.5px 2.5px 0;transform:translate(-50%,-55%) rotate(45deg)}'
   +P+' .wi{color:'+W+'!important;-webkit-text-fill-color:'+W+'!important;caret-color:'+W+';border-bottom:1px solid rgba(255,255,255,.5)!important;text-shadow:0 1px 2px rgba(57,57,59,.25)}'
   +P+' .pico .gof{background:rgba(255,255,255,.92)!important;color:#895a64!important;border-color:rgba(255,255,255,.8)!important;box-shadow:0 8px 12px -8px rgba(57,57,59,.6)}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
})();
/* Semaine : bandeau des jours en charcoal pale */
(function(){
  var st=document.createElement('style');
  st.textContent='.dc[class*="dcv"] .dl{background:linear-gradient(90deg,#525156 0%,#707072 20%,#b5b3b4 50%,#707072 80%,#525156 100%)!important;color:#fff;text-shadow:0 1px 2px rgba(57,57,59,.45);box-shadow:inset 0 -10px 14px -12px rgba(57,57,59,.5),inset 0 10px 14px -12px rgba(255,255,255,.25)}.dc[class*="dcv"] .dl b{color:#39393b;text-shadow:none;box-shadow:0 4px 8px -5px rgba(57,57,59,.6)}.dc[class*="dcv"] .dlr i{color:#fff;text-shadow:0 1px 2px rgba(57,57,59,.45)}';
  document.head.appendChild(st);
})();
