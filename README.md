chinese-poetry
==============

[![Build Status](https://travis-ci.org/chinese-poetry/chinese-poetry.svg?branch=master)](https://travis-ci.org/chinese-poetry/chinese-poetry)
[![License](http://img.shields.io/badge/license-mit-blue.svg?style=flat-square)](https://github.com/jackeyGao/chinese-poetry/blob/master/LICENSE)
[![tang poetry](https://img.shields.io/badge/tang%20poetry-5.5w-green.svg)]()
[![song poetry](https://img.shields.io/badge/song%20poetry-22w-green.svg)]()
[![song ci](https://img.shields.io/badge/song%20Ci-21k-green.svg)]()

最全的中华古典文集数据库, 包含5.5万首唐诗、26万首宋诗和2.1万首宋词. 唐宋两朝近1.4万古诗人, 和两宋时期1.5K词人. 数据来源于互联网. 

**为什么要做这个仓库?** 古诗是中华民族乃至全世界的瑰宝, 我们应该传承下去, 虽然有古典文集, 但大多数人并没有拥有这些书籍. 从某种意义上来说, 这些庞大的文集离我们是有一定距离的。而电子版方便拷贝, 所以此开源数据库诞生了. 你可以用此数据做任何有益的事情， 甚至我也可以帮助你.

古诗采集没有记录过程， 因为古诗数据庞大，目标网站有限制, 采集过程经常中断超过了一个星期.2017年新加入全宋词, [全宋词爬取过程及数据分析](http://jackeygao.io/words/crawl-ci.html).


## 数据分析

一些简单的高频分析

|唐诗高频词|唐诗作者作品榜|
| :---: | :---: |
| ![唐诗高频词](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/tang_text_topK.png "唐诗高频词")| ![唐诗作者作品榜](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/tang_author_topK.png "唐诗作者作品榜")|
|宋诗高频词|宋诗作者作品榜|
| ![宋诗高频词](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/song_text_topK.png "宋诗高频词" )| ![宋诗作者作品榜](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/song_author_topK.png "宋诗作者作品榜")|
|宋词高频词|宋词作者作品榜|
| ![宋词高频词](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/ci_words_topK.png "宋词高频词")  |![宋词作者作品榜](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/ci_author_topK.png "宋词作者作品榜") |

|两宋喜欢的词牌名|
| :---: |
|![两宋喜欢的词牌名](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/ci_rhythmic_topK.png)|

## 数据分发形式

古诗数据分发采用繁体字的分组JSON文件, 保留繁体能更大程度地保存原数据. 宋词数据分发采用sqlite数据库, 使用简体字(无原因, 采集源就是简体, 如需繁体请自行转换).

### 其他类型结构数据

- [chinese-poetry](https://github.com/chinese-poetry) **/** [chinese-poetry-zhCN](https://github.com/chinese-poetry/chinese-poetry-zhCN) 简体中文版本数据
- [KomaBeyond](https://github.com/KomaBeyond) **/** [chinese-poetry-mysql](https://github.com/KomaBeyond/chinese-poetry-mysql) 适用于mysql数据库的格式数据

### 转换数据库格式工具

- [chinese-poetry-to-mysql-tool](https://github.com/woodylan/chinese-poetry-to-mysql-tool) 转换成sql文件的脚本

### 古诗JSON结构

```text
[
  {
    "strains": [
      "平平平仄仄，平仄仄平平。",
      "仄仄平平仄，平平仄仄平。",
      "平平平仄仄，平仄仄平平。",
      "平仄仄平仄，平平仄仄平。"
    ],
    "author": "太宗皇帝",
    "paragraphs": [
      "秦川雄帝宅，函谷壯皇居。",
      "綺殿千尋起，離宮百雉餘。",
      "連甍遙接漢，飛觀迥凌虛。",
      "雲日隱層闕，風煙出綺疎。"
    ],
    "title": "帝京篇十首 一"
  },
  ... 每单个JSON文件1000条唐诗记录.
]
```
### 作者JSON结构

```json
[
  {
    "name": "太宗皇帝",
    "desc": "帝姓李氏，諱世民，神堯次子，聰明英武。貞觀之治，庶幾成康，功德兼隆。由漢以來，未之有也。而銳情經術，初建秦邸，即開文學館，召名儒十八人爲學士。既即位，殿左置弘文館，悉引內學士，番宿更休。聽朝之間，則與討論典籍，雜以文詠。或日昃夜艾，未嘗少怠。詩筆草隸，卓越前古。至於天文秀發，沈麗高朗，有唐三百年風雅之盛，帝實有以啓之焉。在位二十四年，諡曰文。集四十卷。館閣書目，詩一卷，六十九首。今編詩一卷。"
  },
  ...
]
```

## 案例展示

- [animalize](https://github.com/animalize) **/** [QuanTangshi](https://github.com/animalize/QuanTangshi)  *离线全唐诗 Android*
- [justdark](https://github.com/justdark) **/** [pytorch-poetry-gen](https://github.com/justdark/pytorch-poetry-gen)  *a char-RNN based on pytorch*
- [Clover27](https://github.com/Clover27) **/** [ancient-Chinese-poem-generator](https://github.com/Clover27/ancient-Chinese-poem-generator)  *Ancient-Chinese-Poem-Generator*
- [chinese-poetry](https://github.com/chinese-poetry) **/** [poetry-calendar](http://shici.store/poetry-calendar/)  *诗词周历*
- [chenyuntc](https://github.com/chenyuntc) **/** [pytorch-book](https://github.com/chenyuntc/pytorch-book/blob/master/chapter9-神经网络写诗(CharRNN)/) *简体唐诗生成(char-RNN), 可生成藏头诗,自定义诗歌意境,前缀等*
- [okcy1016](https://github.com/okcy1016) **/** [poetry-desktop](https://github.com/okcy1016/poetry-desktop/) *诗词桌面*

### 公众号

- **PoemSearcher**


## 贡献&讨论

提交issue来优化完善此数据库, 你也可以联系我的邮箱 gaojunqi@outlook.com

创建和维护`chinese-poetry`需要花费很多的时间和资源. 如果此数据库对您有很大的帮助, 请酌情考虑[打赏作者](https://jackeygao.io/donation.html).

<img src="https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/WechatIMG1.jpeg" width="150" height="200" />


## License

[MIT](https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE) 许可证.
