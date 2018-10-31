Chinese-poetry
==============

[![Build Status](https://travis-ci.org/chinese-poetry/chinese-poetry.svg?branch=master)](https://travis-ci.org/chinese-poetry/chinese-poetry )
[![License](http://img.shields.io/badge/license-mit-blue.svg?style=flat-square)](https://github.com/jackeyGao/chinese-poetry/blob/ Master/LICENSE)
[![tang poetry](https://img.shields.io/badge/tang%20poetry-5.5w-green.svg)]()
[![song poetry](https://img.shields.io/badge/song%20poetry-22w-green.svg)]()
[![song ci](https://img.shields.io/badge/song%20Ci-21k-green.svg)]()

The most complete Chinese classical anthology database contains 55,000 Tang poems, 260,000 Song poems and 21,000 Song poems. Nearly 14,000 ancient poets in the Tang and Song Dynasties, and 1.5K poets in the Song Dynasty. Data from the Internet.

**Why do you want to do this warehouse?** Ancient poetry is a treasure of the Chinese nation and the whole world. We should pass it on. Although there are classical anthologies, most people do not own these books. In a sense, these huge The collection is a certain distance from us. The electronic version is easy to copy, so this open source database was born. You can use this data to do any useful things, even I can help you.

There is no recording process in the collection of ancient poems, because the ancient poetry data is huge, the target website is limited, and the collection process is often interrupted for more than one week. In 2017, the new songs are added, [the whole song crawling process and data analysis] (http://jackeygao.io /words/crawl-ci.html).


## data analysis

Some simple high frequency analysis

|Tang Shi high frequency words|Tang poetry author list|
| :---: | :---: |
| [[Tang Shi high-frequency words] (https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/tang_text_topK.png "Tang Shi high-frequency words")| ![Tang poetry author list] ( https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/tang_author_topK.png "Tang poetry author list")|
|Song Shi high-frequency words|Song poetry author list|
| [[Song Shi high-frequency words] (https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/song_text_topK.png "Song Shi high-frequency words")| ![宋诗作者作品榜](https ://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/song_author_topK.png "Song Poetry Author List")|
|Song word high frequency words|宋词作者作品榜|
| ![宋词高频词](https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/ci_words_topK.png "Song Word High Frequency Words") |![宋词作者作品榜榜]( https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/ci_author_topK.png "Songwriter Author List") |

| Songs like the name of the word |
| :---: |
|![The name of the songs that the two Songs like] (https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/ci_rhythmic_topK.png)|

## Data distribution form

The ancient poetry data distribution uses traditional Chinese character group JSON files, retaining the traditional Chinese to save the original data to a greater extent. The Song word data distribution uses the sqlite database, using simplified characters (no reason, the collection source is simplified, if you need to convert in traditional Chinese).

### Other type structure data

- [chinese-poetry](https://github.com/chinese-poetry) **/** [chinese-poetry-zhCN](https://github.com/chinese-poetry/chinese-poetry-zhCN) Simplified Chinese version data
- [KomaBeyond](https://github.com/KomaBeyond) **/** [chinese-poetry-mysql](https://github.com/KomaBeyond/chinese-poetry-mysql) for mysql database format data

### Convert Database Format Tool

- [chinese-poetry-to-mysql-tool](https://github.com/woodylan/chinese-poetry-to-mysql-tool) script converted to sql file

### Ancient poetry JSON structure

```text
[
  {
    "strains": [
      "Ping Ping Ping, Ping Ping Ping Ping.",
      "仄仄平平仄, 平平平平.",
      "Ping Ping Ping, Ping Ping Ping Ping.",
      "Ping 仄仄 flat, flat and flat."
    ],
    "author": "The Emperor Taizong",
    "paragraphs": [
      "Qin Chuan Xiong's house, the letter to the valley of the emperor.",
      "The temple is looking for a thousand, and it’s a hundred miles away."
      "Let's get away with Han, fly to see Ling Ling.",
      "The cloud is hidden, and the wind is blowing out."
    ],
    "title": "The Ten Kings of the Imperial Palace"
  },
  ... 1000 Tang poem records per single JSON file.
]
```
### Author JSON Structure

```json
[
  {
    "name": "The Emperor Taizong",
    "desc": "The emperor surnamed Li, the ancestors of the world, the second son of the gods, the wise and the martial arts. The rule of the priests, the martial arts, the merits and the glory. Since the Han, there has been nothing. And the sharp love, the early Qin Hey, that is, open the Literary Museum, and call the Confucian scholars as a bachelor. As a pre-position, the temple will be placed in the Hongwen Museum on the left, and the bachelor will be introduced to the school. The audience will be closed to the audience. Or the day and night, Ai, not a small number. Poetry and grass, excellent ancient. As for the astronomical hair, Shen Ligao Lang, there are three hundred years of elegant elegance, the emperor has a revival. In the twenty-four years, Yan Wen. Set forty volumes. The library catalogue, a volume of poems, sixty-nine. This is a volume of poems."
  },
  ...
]
```

## Case show

- [animalize](https://github.com/animalize) **/** [QuanTangshi](https://github.com/animalize/QuanTangshi) *Offline Full Tang Poetry Android*
- [justdark](https://github.com/justdark) **/** [pytorch-poetry-gen](https://github.com/justdark/pytorch-poetry-gen) *a char-RNN based On pytorch*
- [Clover27](https://github.com/Clover27) **/** [ancient-Chinese-poem-generator](https://github.com/Clover27/ancient-Chinese-poem-generator) *Ancient -Chinese-Poem-Generator*
- [chinese-poetry](https://github.com/chinese-poetry) **/** [poetry-calendar](http://shici.store/poetry-calendar/) *Poetry Weekly*
- [chenyuntc](https://github.com/chenyuntc) **/** [pytorch-book](https://github.com/chenyuntc/pytorch-book/blob/master/chapter9-Neural Network Writing Poetry (CharRNN)/) *Simplified Tang poetry generation (char-RNN), can generate Tibetan poetry, custom poetry mood, prefix, etc.*
- [okcy1016](https://github.com/okcy1016) **/** [poetry-desktop](https://github.com/okcy1016/poetry-desktop/) *Poetry Desktop*

### No public

- **PoemSearcher**


## Contribution & Discussion

Submit an issue to optimize this database, you can also contact my email gaojunqi@outlook.com

Creating and maintaining `chinese-poetry` takes a lot of time and resources. If this database is very helpful, please consider [rewarding authors] (https://jackeygao.io/donation.html) as appropriate.

<img src="https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/WechatIMG1.jpeg" width="150" height="200" />


## License

[MIT](https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE) License.
