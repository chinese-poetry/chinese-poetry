# chinese-poetry

![中华古诗](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/full-tang-poetry.png "中华古诗")

## 唐诗高频词

![唐诗高频词](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/tang_text_topK.png "唐诗高频词")

## 唐诗作者作品榜

![唐诗作者作品榜](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/tang_author_topK.png "唐诗作者作品榜")

## 宋诗高频词

![宋诗高频词](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/song_text_topK.png "宋诗高频词")

## 宋诗作者作品榜

![宋诗作者作品榜](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/song_author_topK.png "宋诗作者作品榜")

## 宋词作者作品榜

![宋词作者作品榜](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/ci_author_topK.png "宋词作者作品榜")

## 宋词高频词

![宋词高频词](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/ci_words_topK.png)

## 两宋喜欢的词牌名

![两宋喜欢的词牌名](https://raw.githubusercontent.com/jackeyGao/chinese-poetry/master/images/ci_rhythmic_topK.png)


## 数据分发形式

### 唐诗JSON

```json
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
### 作者JSON

```json
[
  {
    "name": "太宗皇帝",
    "desc": "帝姓李氏，諱世民，神堯次子，聰明英武。貞觀之治，庶幾成康，功德兼隆。由漢以來，未之有也。而銳情經術， >初建秦邸，即開文學館，召名儒十八人爲學士。既即位，殿左置弘文館，悉引內學士，番宿更休。聽朝之間，則與討論典籍，雜以文詠。或日昃夜艾，未嘗少怠。詩筆草隸，卓越前古。至於天文秀發，沈麗高朗，有唐三百年風雅之盛，帝實有以啓之焉。在位二十四年，諡曰文。集四十卷。館閣書目，詩一卷，六十九首。今編詩一卷。"
  },
  ... 所有诗人信息在一个文件
]
```


## 贡献

目前仅有全唐诗记录, 唐后的一些古诗未收集，古诗乃中华文化瑰宝, 如果有靠谱的数据源也欢迎提交PR加入.  

