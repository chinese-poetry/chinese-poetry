<p align="center">
  <a href="https://github.com/chinese-poetry/chinese-poetry">
      <img src="https://avatars3.githubusercontent.com/u/30764933?s=200&v=4" alt="chinese-poetry">
  </a>
</p>

<h2 align="center">chinese-poetry: 最全中文诗歌古典文集数据库</h2>

<p align="center">
  <a href="https://travis-ci.com/chinese-poetry/chinese-poetry" rel="nofollow">
    <img height="28px" alt="Build Status" src="https://img.shields.io/travis/chinese-poetry/chinese-poetry?style=for-the-badge" style="max-width:100%;">
  </a>
  <a href="https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE">
    <img height="28px" alt="License" src="http://img.shields.io/badge/license-mit-blue.svg?style=for-the-badge" style="max-width:100%;">
  </a>
  <a href="https://github.com/chinese-poetry/chinese-poetry/graphs/contributors">
    <img height="28px" alt="Contributors" src="https://img.shields.io/github/contributors/chinese-poetry/chinese-poetry.svg?style=for-the-badge" style="max-width:100%;">
  </a>
  <a href="https://www.patreon.com/jackeygao" rel="nofollow">
    <img height="28px" alt="Patreon" src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fjackeygao%2Fpledges&amp;style=for-the-badge" style="max-width:100%;">
  </a>
  <a href="https://github.com/chinese-poetry/chinese-poetry/" rel="nofollow">
    <img alt="HitCount" height="28px" src="http://hits.dwyl.io/chinese-poetry/chinese-poetry.svg" style="max-width:100%;">
  </a>
</p>


最全的中华古典文集数据库，包含 5.5 万首唐诗、26 万首宋诗、2.1 万首宋词和其他古典文集。诗人包括唐宋两朝近 1.4 万古诗人，和两宋时期 1.5 千古词人。数据来源于互联网。

**为什么要做这个仓库?** 古诗是中华民族乃至全世界的瑰宝，我们应该传承下去，虽然有古典文集，但大多数人并没有拥有这些书籍。从某种意义上来说，这些庞大的文集离我们是有一定距离的。而电子版方便拷贝，所以此开源数据库诞生了。此数据库通过 JSON 格式分发，可以让你很方便的开始你的项目。

古诗采集没有记录过程，因为古诗数据庞大，目标网站有限制，采集过程经常中断超过了一个星期。2017 年新加入全宋词，[全宋词爬取过程及数据分析](https://jackeygao.github.io/r/words/crawl-ci.html)。

## 高频词分析图

<details open>
  <summary><b>宋词受欢迎的词牌名</b></summary>

<div align="center">
<img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/ci_rhythmic_topK.png" alt="两宋喜欢的词牌名">
</div>
</details>

<details>
  <summary><b>宋词高频词</b></summary>
  <img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/ci_words_topK.png" alt="宋词高频词" style="max-width:100%;">
</details>

<details>
  <summary><b>宋词作者作品榜</b></summary>
  <img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/ci_author_topK.png" alt="宋词作者作品榜" style="max-width:100%;">
</details>

<details>
  <summary><b>唐诗高频词</b></summary>
  <img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/tang_text_topK.png" alt="唐诗高频词" style="max-width:100%;">
</details>

<details>
  <summary><b>唐诗作者作品榜</b></summary>
  <img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/tang_author_topK.png" alt="唐诗作者作品榜" style="max-width:100%;">
</details>

<details>
  <summary><b>宋诗高频词</b></summary>
  <img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/song_text_topK.png" alt="宋诗高频词" style="max-width:100%;">
</details>

<details>
  <summary><b>宋诗作者作品榜</b></summary>
  <img src="https://raw.githubusercontent.com/jackeygao/chinese-poetry/master/images/song_author_topK.png" alt="宋诗作者作品榜" style="max-width:100%;">
</details>

## 数据集

- 全唐诗 [json](./json)
- 全宋诗 [json](./json)
- 全宋词 [ci](./ci)
- 五代·花间集 [wudai/huajianji](./wudai/huajianji)
- 五代·南唐二主词 [wudai/nantan](./wudai/nantang)
- 论语 [lunyu](./lunyu)
- 诗经 [shijing](./shijing)
- 幽梦影 [youmengying](./youmengying)
- 四书五经 [sishuwujing](./sishuwujing)
- 蒙學 [mengxue](./mengxue)


## 贡献

本项目目的是借助技术来生成格式化(JSON)数据，让开发者更方便快速的构建诗词类应用程序。身单力薄，欢迎更多人来维护，你可以通过以下方法来参与贡献：

- 直接提交 PR 或者通过 issue 讨论来优化完善此数据库，理论上古诗歌体非宗教类都欢迎加入，部分有争议性的数据需要社区投票讨论决定是否加入。关于诗句的纠错在创建 PR 时请标明出处。更多规范请[参考贡献规范文档](https://github.com/chinese-poetry/chinese-poetry/wiki/%E5%8F%82%E4%B8%8E%E8%B4%A1%E7%8C%AE%E8%A7%84%E8%8C%83)。

- 如果你没有办法直接参与完善的过程，你也可以通过 「[Patreon 周期性赞助](https://www.patreon.com/jackeygao)」的形式来持续帮助并激励我去优化完善此数据库。如果您不喜欢周期性赞助，你也可以通过「[支付宝](https://github.com/jackeyGao/JackeyGao.github.io/blob/master/static/images/alipay.png)」或者「[微信赞赏码](https://github.com/jackeyGao/JackeyGao.github.io/blob/master/static/images/wechat.jpg)」进行一次性赞助(备注留下邮箱)。

- 如有建议或吐槽，欢迎联系我的邮箱 gaojunqi@outlook.com。

无论通过哪种形式贡献最终都会使之变得更好！

### 赞助者

[上海逆行信息科技](http://www.desmix.com/)

### 贡献者

<p align="center">
<img src="https://opencollective.com/chinese-poetry/contributors.svg?width=890&button=false" alt="Contributors">
</p>

## 案例展示

<details>
  <summary>案例展示</summary>
  
- [中文诗歌主页](https://shici.store)是一个基于浏览器的诗词网站，包含唐诗三百首、宋词三百首等文集。
- [animalize](https://github.com/animalize) **/** [QuanTangshi](https://github.com/animalize/QuanTangshi)  *离线全唐诗 Android*
- [justdark](https://github.com/justdark) **/** [pytorch-poetry-gen](https://github.com/justdark/pytorch-poetry-gen)  *a char-RNN based on pytorch*
- [Clover27](https://github.com/Clover27) **/** [ancient-Chinese-poem-generator](https://github.com/Clover27/ancient-Chinese-poem-generator)  *Ancient-Chinese-Poem-Generator*
- [chinese-poetry](https://github.com/chinese-poetry) **/** [poetry-calendar](http://shici.store/poetry-calendar/)  *诗词周历*
- [chenyuntc](https://github.com/chenyuntc) **/** [pytorch-book](https://github.com/chenyuntc/pytorch-book/blob/master/chapter9-神经网络写诗(CharRNN)/) *简体唐诗生成(char-RNN)，可生成藏头诗，自定义诗歌意境，前缀等*
- [okcy1016](https://github.com/okcy1016) **/** [poetry-desktop](https://github.com/okcy1016/poetry-desktop/) *诗词桌面*
- [huangjianke](https://github.com/huangjianke) **/** [weapp-poem](https://github.com/huangjianke/weapp-poem/) *诗词墨客 小程序版*

</details>

## License

[MIT](https://github.com/chinese-poetry/chinese-poetry/blob/master/LICENSE) 许可证。
