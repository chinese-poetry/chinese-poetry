# chinese-poetry: 最全中文诗歌古典文集数据库.

[![Build Status](https://travis-ci.org/chinese-poetry/chinese-poetry.svg?branch=master)](https://travis-ci.org/chinese-poetry/chinese-poetry)
[![License](http://img.shields.io/badge/license-mit-blue.svg?style=flat-square)](https://github.com/jackeyGao/chinese-poetry/blob/master/LICENSE)
[![](https://img.shields.io/github/contributors/chinese-poetry/chinese-poetry.svg)](https://github.com/chinese-poetry/chinese-poetry/graphs/contributors)

[中文诗歌主页](https://shici.store)是一个基于浏览器的诗词网站， 包含唐诗三百首、宋词三百首等文集.

最全的中华古典文集数据库, 包含5.5万首唐诗、26万首宋诗和2.1万首宋词. 唐宋两朝近1.4万古诗人, 和两宋时期1.5K词人. 数据来源于互联网.

**为什么要做这个仓库?** 古诗是中华民族乃至全世界的瑰宝, 我们应该传承下去, 虽然有古典文集, 但大多数人并没有拥有这些书籍. 从某种意义上来说, 这些庞大的文集离我们是有一定距离的。而电子版方便拷贝, 所以此开源数据库诞生了. 你可以用此数据做任何有益的事情， 甚至我也可以帮助你.

古诗采集没有记录过程， 因为古诗数据庞大，目标网站有限制, 采集过程经常中断超过了一个星期.2017年新加入全宋词, [全宋词爬取过程及数据分析](http://jackeygao.io/words/crawl-ci.html).


## 数据分析

一些简单的高频分析

|唐诗高频词|唐诗作者作品榜|
| :---: | :---: |
| ![唐诗高频词](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/tang_text_topK.png "唐诗高频词")| ![唐诗作者作品榜](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/tang_author_topK.png "唐诗作者作品榜")|
|宋诗高频词|宋诗作者作品榜|
| ![宋诗高频词](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/song_text_topK.png "宋诗高频词" )| ![宋诗作者作品榜](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/song_author_topK.png "宋诗作者作品榜")|
|宋词高频词|宋词作者作品榜|
| ![宋词高频词](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/ci_words_topK.png "宋词高频词")  |![宋词作者作品榜](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/ci_author_topK.png "宋词作者作品榜") |

|两宋喜欢的词牌名|
| :---: |
|![两宋喜欢的词牌名](https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/ci_rhythmic_topK.png)|

## 数据集合

- 全唐诗 [json](https://github.com/chinese-poetry/chinese-poetry/tree/master/json)
- 全宋诗 [json](https://github.com/chinese-poetry/chinese-poetry/tree/master/json)
- 全宋词 [ci](https://github.com/chinese-poetry/chinese-poetry/tree/master/ci)
- 五代·花间集 [wudai](https://github.com/chinese-poetry/chinese-poetry/tree/master/wudai/%E8%8A%B1%E9%97%B4%E9%9B%86)
- 五代·南唐二主词 [wudai](https://github.com/chinese-poetry/chinese-poetry/tree/master/wudai/%E5%8D%97%E5%94%90%E4%BA%8C%E4%B8%BB%E8%AF%8D)
- 论语 [lunyu](https://github.com/chinese-poetry/chinese-poetry/tree/master/lunyu)
- 诗经 [shijing](https://github.com/chinese-poetry/chinese-poetry/tree/master/shijing)
- 幽梦影 [youmengying](https://github.com/chinese-poetry/chinese-poetry/tree/master/youmengying)
- 四书五经 [sishuwujing](https://github.com/chinese-poetry/chinese-poetry/tree/master/sishuwujing)
- 蒙學 [mengxue](./mengxue)

**待补充**

- 清代诗词
- 元曲

## 案例展示

- [animalize](https://github.com/animalize) **/** [QuanTangshi](https://github.com/animalize/QuanTangshi)  *离线全唐诗 Android*
- [justdark](https://github.com/justdark) **/** [pytorch-poetry-gen](https://github.com/justdark/pytorch-poetry-gen)  *a char-RNN based on pytorch*
- [Clover27](https://github.com/Clover27) **/** [ancient-Chinese-poem-generator](https://github.com/Clover27/ancient-Chinese-poem-generator)  *Ancient-Chinese-Poem-Generator*
- [chinese-poetry](https://github.com/chinese-poetry) **/** [poetry-calendar](http://shici.store/poetry-calendar/)  *诗词周历*
- [chenyuntc](https://github.com/chenyuntc) **/** [pytorch-book](https://github.com/chenyuntc/pytorch-book/blob/master/chapter9-神经网络写诗(CharRNN)/) *简体唐诗生成(char-RNN), 可生成藏头诗,自定义诗歌意境,前缀等*
- [okcy1016](https://github.com/okcy1016) **/** [poetry-desktop](https://github.com/okcy1016/poetry-desktop/) *诗词桌面*
- [huangjianke](https://github.com/huangjianke) **/** [weapp-poem](https://github.com/huangjianke/weapp-poem/) *诗词墨客 小程序版*


## 贡献&讨论

<p align="center">
<img src="https://opencollective.com/chinese-poetry/contributors.svg?width=890&button=false" alt="Contributors">
</p>


提交PR或者通过issue讨论来优化完善此数据库, 你也可以联系我的邮箱 gaojunqi@outlook.com

创建和维护`chinese-poetry`需要花费很多的时间和资源. 如果此数据库对您有很大的帮助, 请酌情考虑[打赏作者](https://jackeygao.io/donation.html).

<img src="https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/images/WechatIMG1.jpeg" width="150" height="200" />


## License

[MIT](https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE) 许可证.
