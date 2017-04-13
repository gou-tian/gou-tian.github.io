# - * - coding: utf-8 - * -
import pymysql
import json
import sys
from urllib import request, parse
from http import cookiejar
from bs4 import BeautifulSoup
import base64


# 定义参数
loginUrl = 'http://zs.xiguaji.com/Login/Login'
requestUrl = 'http://zs.xiguaji.com/Member#/MArticle/Explore'
bodyList = 'http://zs.xiguaji.com/IllegalArticle/List?partial=1&type=0&page='
cookie = {'Cookie': "ASP.NET_SessionId=fwp0msf4laa5krwii5s31tss; _XIGUASTATE=XIGUASTATEID=9bf33037fde14a26b2d5f247dcdf3cf8; SaveUserName=18234180241; LV=1; _XIGUA=UserId=103dad732c906557; SERVERID=0a1db1b547a47b70726acefc0225fff8|1491890065|1491890008"}
loginData = parse.urlencode([("email", "18234180241"),("password","199312"),("chk","3037fd")])
headers = {'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1"}
# Cookie设置
cookieFileNnme = 'cookie.txt'
setCookie = cookiejar.MozillaCookieJar(cookieFileNnme)
cookieHeader = request.HTTPCookieProcessor(setCookie)
opener = request.build_opener(cookieHeader)
res = opener.open(requestUrl)
# 保存cookie到cookie.txt中
setCookie.save(ignore_discard=True, ignore_expires=True)

# 设置请求header
def setHeader(url,heads = cookie):
    req = request.Request(url)
    for val in heads:
        req.add_header(val,heads[val])
    return req

# SQL
def postSql(data):
    # 连接
    db = pymysql.connect("120.27.26.5","phpwind","phpwind888","phpwind")
    # 游标
    cursor = db.cursor()
    effect_row = cursor.execute("select * from py")
    # SQL 插入语句
    sql = 'INSERT INTO py(spiderBody) VALUES ("%s")' % (base64.b64encode(data))
    try:
        # 执行sql语句
        cursor.execute(sql)
        # 执行sql语句
        db.commit()
        print('保存数据成功！')
    except :
        # 发生错误时回滚
        print('\n发生错误,以下是错误内容：')
        info=sys.exc_info()  
        print (info[0],":",info[1])
        db.rollback()

    # 关闭数据库连接
    db.close()

        
# with 避免忘记关闭
with request.urlopen(setHeader(loginUrl),loginData.encode('utf-8')) as f:
    print(f.status,f.reason,'开始')
    cookie['Cookie'] = "_XIGUASTATE=XIGUASTATEID=9bf33037fde14a26b2d5f247dcdf3cf8; BigBiz442895=False; ExploreTags442895=; ASP.NET_SessionId=vzuwqpxtold030whfbujaj2r; _XIGUA=UserId=0f6ec8acd79ab4b4&Account=5886f7cba3f82f2843d1321ed1dcf0e2&checksum=4b82fb1ad8e9; SaveUserName=18234180241; LV=1; SERVERID=2e7fd5d7f4caba1a3ae6a9918d4cc9a6|1491983930|1491983895"
    setCookie.save(cookieFileNnme,ignore_discard=True, ignore_expires=True)
    for count in range(401,801):
        print('第 ',count,' 条')
        with opener.open(setHeader(bodyList + str(count),cookie)) as a:
            postSql(a.read())
    print('抓取完成！')
       
        
