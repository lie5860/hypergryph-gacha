# hypergryph-gacha
一个明日方舟的寻访记录查看工具，可以方便的统计出货概率，缓存历史寻访记录。

数据使用阿里云FC node写入，私有mongo存储。

该站点当前所有部分使用React开发，使用magic转Web Component使用。

线上访问地址：[ak.saki.cc](http://ak.saki.cc)

概览图

![概览图](https://github.com/lie5860/hypergryph-gacha/blob/main/image/overview.png?raw=true)

Lighthouse结果

![Lighthouse结果](https://github.com/lie5860/hypergryph-gacha/blob/main/image/lighthouse.png?raw=true)

本地调试方式 npm i => npm run build => 打开test目录下的index.html访问

欢迎小伙伴提Issue给这个小工具提一些建议和想法。

## 版本履历

#### v0.8
通过Lighthouse报告进行部分优化

#### v0.7
域名支持HTTPS 增加Service Worker缓存 支持无网络访问

#### v0.6
增加暗黑模式

mongo增加索引、支持追加数据，优化非首次爬取时长

#### v0.5
引入shoelace webcomponent组件库优化页面

#### v0.4
使用magic将项目使用react打包成webcomponent使用

优化分析，合并所有非限定池，并根据最终结果按照时间倒序展示各池子情况

#### v0.3
支持数据远端存储，爬取的数据将存入mongo进行分析
