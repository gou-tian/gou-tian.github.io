# - * - coding: utf-8 - * -
import re
import pymysql
import hashlib
import sys
import threading
from urllib import request,parse
from http import cookiejar
from bs4 import BeautifulSoup

# 定义全局变量

pageOpen= 'http://zs.xiguaji.com/'
pageLogin = 'http://zs.xiguaji.com/Login/Login'
pageSpider ='http://zs.xiguaji.com/IllegalArticle/List?partial=1&type=0&page='
loginData = parse.urlencode([("email", "13934629430"),("password","xuchenliang888"),("chk","")])

# 将cookie保存到文件
def saveCookie(url):
    # 设置保存cookie
    fileName = 'cook-cahe.txt'
    # 声明一个MozillaCookieJar对象来保存cookie，之后写入文件
    cookie = cookiejar.MozillaCookieJar(fileName)
    # 创建cookie处理器
    handler = request.HTTPCookieProcessor(cookie)
    # 构建opener
    opener = request.build_opener(handler)
    # 创建请求
    res = opener.open(url)
    # 保存cookie到文件
    # ignore_discard的意思是即使cookies将被丢弃也将它保存下来
    # ignore_expires的意思是如果在该文件中cookies已经存在，则覆盖原文件写入
    cookie.save(ignore_discard=True, ignore_expires=True)
    return opener

# 设置请求header
def setHeader(url,heads):
    req = request.Request(url)
    for val in heads:
        req.add_header(val,heads[val])
    return req

# 违规详情
def violationDetail(url):
    req = request.urlopen(url)
    htmlSoup = BeautifulSoup(req, 'html.parser')
    res = htmlSoup.find('p',class_='tips')
    return res

# 数据库操作---插入新数据
def addSpiderData(data):
    # 链接
    db = pymysql.connect("127.0.0.1","root","gtian0122","gt",use_unicode=True, charset="utf8")
    # 游标
    cursor = db.cursor()

    for da in data:
        # INSERT IGNORE INTO 自动判断unique唯一索引是否存在
        sql = "INSERT IGNORE INTO table1(title,postTime,violiaTime,details,_clas,md) VALUES ('{}','{}','{}','{}','{}','{}')".format(da['title'],da['postTime'],da['violiaTime'],da['details'],da['clas'],da['md'])
        try:
            # 执行sql语句
            cursor.execute(sql)
            # 执行sql语句
            db.commit()
        except:
            # 发生错误时回滚
            print('\n发生错误,以下是错误内容：')
            info = sys.exc_info()
            print(info[0], ":", info[1],'\n')
            db.rollback()
    # 关闭数据库连接
    db.close()
    print('保存数据成功！')

# 违规详情
def violationDetail(url):
    req = request.urlopen(url)
    htmlSoup = BeautifulSoup(req, 'html.parser')
    res = htmlSoup.find('p',class_='tips').get_text()
    return res

# 元素操作
def elemnt(html):
    # 标题
    title = ''
    # 发文时间
    postTime = ''
    # 违规时间
    violiaTime = ''
    # 违规详情
    details = ''
    # 所属类别
    clas = ''
    # 数据格式化
    htmlSoupRes = []
    html = BeautifulSoup(html, 'html.parser')
    tr = html.find_all('tr')
    print('正在保存数据，请稍等...')
    for el in tr:
        # 获取标题
        t = el.find_all('a')
        if t or len(t) > 0:
            for bd in t:
                title = bd.get_text()
                break
        # 获取时间
        time = el.find_all('td', class_='violation-time')
        for pt in time:
            postTime = re.sub('\s','',pt.get_text())[5:11]
            violiaTime = re.sub('\s','',pt.get_text())[16:]
        # 违规详情
        dts = el.find_all('span', class_='mp-violation-label')
        for ds in dts:
            details = ds.get_text()
        # 所属类别
        cla = el.find_all('a',class_='btn-violation-detail')
        for src in cla:
            clas = violationDetail(src['href'])
        if title != '':
            md = hashlib.md5()
            md.update(title.encode('utf-8'))
            htmlSoupRes.append({"title": parse.quote(title),
                                "postTime": postTime,
                                "violiaTime": violiaTime,
                                "details": clas,
                                "clas": details,
                                "md": md.hexdigest()
                                })
    addSpiderData(htmlSoupRes)

def spider(pageOpen,pageLogin,loginData,pageSpider,endPage,startPage=1):
    # 获取cookie
    opener = saveCookie(pageOpen)
    # 截取用户登陆名
    userName = re.compile(r'^[email=\d]*')
    userId = re.compile(r'_XIGUA=UserId+\D+\w*;')
    saveUserNames = re.match(userName, loginData).group()
    sUserName = saveUserNames.split('=')
    # 创建cookie
    ck = {'Cookie':''}
    ck301 = {'Cookie':''}
    # 创建一个MozillaCookieJar对象
    cookie = cookiejar.MozillaCookieJar()
    # 读取cookie
    cookie.load('cook-cahe.txt', ignore_discard=True, ignore_expires=True)
    req = request.Request(pageLogin)
    # 动态身份key标签
    identity = re.compile(r'XIGUASTATEID=')
    for item in cookie:
        ck['Cookie'] += item.name + '=' + item.value + ';'
        # 截取网站动态身份验证
        if identity.search(item.value):
            s = re.sub(identity,'',item.value)
            sRes = s[4:10]
    ck['Cookie'] += 'saveUserName=' + str(sUserName[1]) + ';'
    ck['Cookie'] += ' LV1=' + str(1) + ';'
    for v in ck:
        req.add_header(v, ck[v])
    loginData = loginData + sRes
    with request.urlopen(setHeader(pageLogin,heads=ck),loginData.encode('utf-8'), timeout=10) as f:
        print(f.status, f.reason, '开始')
        info = f.info()
        ck301['Cookie'] = re.sub(userId,"",ck['Cookie'])
        for c301 in info:
            if c301 == 'Set-Cookie':
                pos = re.search(';', info[c301]).span()[0]
                resCc301 = info[c301][:pos]
        ck301['Cookie'] += resCc301
        for count in range(startPage, endPage):
            print('第 ', count, '页')
            with opener.open(setHeader(pageSpider + str(count), heads=ck301)) as a:
                elemnt(a.read().decode('utf-8'))

# 创建多线程任务
class MultiThreadedCrawler(threading.Thread):
    def __init__(self,ThreadedID,name,counter,func):
        threading.Thread.__init__(self)
        self.ThreadedID = ThreadedID
        self.name = name
        self.counter = counter
        self.func = func

    def run(self,pageOpen, pageLogin, loginData, pageSpider, page):
        # print(pageOpen, pageLogin, loginData, pageSpider, page)
        self.func(pageOpen, pageLogin, loginData, pageSpider,page)



if __name__ == '__main__':

    # 抓取页数
    endPage = 11
    spider(pageOpen, pageLogin, loginData, pageSpider, endPage)
    print('关闭进程！')



