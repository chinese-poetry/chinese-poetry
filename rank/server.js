let puppeteer = require('puppeteer');
let fs = require('fs');
let path = require('path');
let sep = path.sep;
let delayBaseTime = 3 * 1000;//延迟基础时间
let delayMaxTime = 2 * 1000;
//查询缓存，防止过多的使用同样的关键字查询搜索引擎被block
let cache = Object.create(null);
// let todayProxies = [
//     '218.60.8.99:3129',
//     '212.64.51.13:8888',
//     '125.62.27.53:3128'
// ];
let wait = second => new Promise(r => { setTimeout(r, second * 1000); });
//使用chrome模拟访问
let headless = {
    async before() {
        if (!this.$local) {
            let brower = await puppeteer.launch({
                headless: true,
                defaultViewport: {
                    width: 1440,
                    height: 900
                }
            });
            this.$local = brower;
            // let browsers = [brower];
            // for (let p of todayProxies) {
            //     browsers.push(await puppeteer.launch({
            //         headless: true,
            //         defaultViewport: {
            //             width: 1440,
            //             height: 900
            //         },
            //         args: [
            //             '--proxy-server=' + p
            //         ]
            //     }));
            // }
            // this.$browsers = browsers;
            // this.$current = 0;
        }
    },
    async toUrl(...urls) {
        let ps,
            retry = 3,
            newPages,
            imgReg = /\.(?:png|jpg|gif)$/i;
        let closePages = () => {
            if (newPages) {
                for (let p of newPages) {
                    p.close();
                }
            }
        };
        let request = async () => {
            ps = [];
            let pages = [];
            let datas = [];
            let local = this.$local;
            // let proxy = this.$browsers[this.$current++];
            // if (this.$current >= this.$browsers.length) {
            //     this.$current = 0;
            // }
            for (let url of urls) {
                let b = local;//url.startsWith('https://www.google.com') ? local : proxy;
                pages.push(b.newPage());
            }
            newPages = await Promise.all(pages);
            let start = 0;
            for (let page of newPages) {
                datas.push(page.goto(urls[start++], {
                    waitUntil: 'networkidle0'
                }));
            }
            let newDatas = await Promise.all(datas);
            for (let d of newDatas) {
                ps.push(d.text());
            }
        };
        do {
            try {
                await request();
                break;
            } catch{
                console.log('retry', retry);
                retry--;
                closePages();
            }
        } while (retry);
        let returned = await Promise.all(ps);
        closePages();
        return returned;
    },
    after() {
        if (this.$local) {
            this.$local.close();
            delete this.$local;
            // for (let b of this.$browsers) {
            //     b.close();
            // }
            // delete this.$browsers;
        }
    }
};
let rank = {
    remote(kd) {
        return new Promise(async r => {
            await headless.before();
            let bd = `https://www.baidu.com/s?wd=${kd}&rsv_spt=1`;
            let so = `https://www.so.com/s?q=${kd}`;
            let google = `https://www.google.com/search?q=${kd}`;
            //let google = `https://www.googlebridge.com/search?q=${kd}`;
            let bing = `https://cn.bing.com/search?q=${kd}&FORM=BESBTB`;
            let texts = await headless.toUrl(bd, so, google, bing);
            let regs = [
                /百度为您找到相关结果约([\d,]+)个/,
                /找到相关结果约([\d,]+)个/,
                /(?:找到约|About)\s*([\d,]+)\s*(?:条结果|results)/,
                /<span\s+class="sb_count">([\d,]+)\s+(?:results|条结果)<\/span>/
            ];
            let nums = [0, 0, 0, 0];
            for (let i = texts.length; i--;) {
                let text = texts[i];
                text = text.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '');
                text.replace(regs[i], (_, m) => {
                    nums[i] = parseInt(m.replace(/,/g, ''), 10);
                });
                // if (nums[i] === 0) {
                //     console.log(text);
                // }
            }
            let [bdNum, soNum, googleNum, bingNum] = nums;
            r({
                baidu: bdNum,
                so360: soNum,
                google: googleNum,
                bing: bingNum
            });
        });
    },
    read(file) {
        let c = fs.readFileSync(file);
        return c.toString();
    },
    list(folder, callback) {
        if (fs.existsSync(folder)) {
            let files = fs.readdirSync(folder);
            files.forEach(file => {
                let p = folder + sep + file;
                let stat = fs.lstatSync(p);
                if (stat.isDirectory()) {
                    walk(p, callback);
                } else {
                    callback(p);
                }
            });
        }
    },
    write(to, content) {
        let folders = path.dirname(to).split(sep);
        let p = '';
        while (folders.length) {
            p += folders.shift() + sep;
            if (!fs.existsSync(p)) {
                fs.mkdirSync(p);
            }
        }
        fs.writeFileSync(to, content);
    }
};
let ciTask = async () => {
    return new Promise(resolve => {
        let ciReg = /ci\.song\.\d+\.json$/;
        let ciRankReg = /ci\.song\.rank\.\d+\.json$/;
        let readList = {};
        let exist = {};
        rank.list('./ci', f => {
            if (ciRankReg.test(f)) {
                exist[path.basename(f).replace('ci.song.rank', 'ci.song')] = 1;
            }
        });
        rank.list('../ci', f => {
            if (ciReg.test(f)) {
                let base = path.basename(f);
                if (!exist[base]) {
                    readList[path.resolve(f)] = 1;
                }
            }
        });
        if (fs.existsSync('./s.cache')) {
            let c = rank.read('./s.cache');
            let j = JSON.parse(c);
            for (let p in j) {
                let a = j[p];
                for (let z in a) {
                    if (a[z] === 0) {
                        delete j[p];
                        break;
                    }
                }
            }
            Object.assign(cache, j);
        }
        let loadList = Object.keys(readList);

        let singleWork = file => {
            let ranks = [];
            let zeros = [];
            return new Promise(resolve => {
                let list = JSON.parse(rank.read(file));
                let start = 0;
                let task = async () => {
                    if (start < list.length) {
                        let r = list[start];
                        let kd = encodeURIComponent(`${r.author} ${r.rhythmic}`);
                        let data,
                            delay = 0,
                            zeroRetry = 3;
                        if (cache[kd]) {
                            data = cache[kd];
                        } else {
                            do {
                                data = await rank.remote(kd);
                                let hasZero = false;
                                for (let p in data) {
                                    if (data[p] === 0) {
                                        hasZero = true;
                                        break;
                                    }
                                }
                                if (!hasZero) {
                                    zeroRetry = 0;
                                } else {
                                    console.log('has zero retry', zeroRetry);
                                    await wait(3);
                                    zeroRetry--;
                                }
                            } while (zeroRetry);
                            data.author = r.author;
                            data.rhythmic = r.rhythmic;
                            cache[kd] = data;
                            delay = delayBaseTime + delayMaxTime * Math.random();
                        }
                        for (let p in data) {
                            if (data[p] === 0) {
                                zeros.push(data);
                                break;
                            }
                        }
                        if (start && ((start % 5) === 0)) {
                            rank.write('./s.cache', JSON.stringify(cache));
                        }
                        ranks.push(data);
                        console.log(start + '/' + list.length);
                        start++;
                        setTimeout(task, delay);
                    } else {
                        rank.write('./s.cache', JSON.stringify(cache));
                        resolve([ranks, zeros]);
                    }
                };
                task();
            });
        };
        let work = async list => {
            let one = list.pop();
            console.log('remain ', list.length);
            if (one) {
                let f = path.basename(one);
                let aim = f.replace('ci.song', 'ci.song.rank');
                let zeroAim = f.replace('ci.song', 'ci.song.zero');
                let [ranks, zeros] = await singleWork(one);
                rank.write('./ci/' + aim, JSON.stringify(ranks, null, 4));
                if (zeros.length) {
                    rank.write('./ci/' + zeroAim, JSON.stringify(zeros, null, 4));
                }
                cache = Object.create(null);//文件写入后，清理缓存
                work(list);
            } else {
                resolve();
            }
        };
        work(loadList);
    });
};
let poetTask = async () => {
    return new Promise(resolve => {
        let poetReg = /poet\.(?:song|tang)\.\d+\.json$/;
        let poetRankReg = /poet\.(?:song|tang)\.rank\.\d+\.json$/;
        let readList = {};
        let exist = {};
        rank.list('./poet', f => {
            if (poetRankReg.test(f)) {
                exist[path.basename(f).replace(/poet\.(song|tang)\.rank/, 'poet.$1')] = 1;
            }
        });
        rank.list('../json', f => {
            if (poetReg.test(f)) {
                let base = path.basename(f);
                if (!exist[base]) {
                    readList[path.resolve(f)] = 1;
                }
            }
        });
        if (fs.existsSync('./s.cache')) {
            let c = rank.read('./s.cache');
            let j = JSON.parse(c);
            for (let p in j) {
                let a = j[p];
                for (let z in a) {
                    if (a[z] === 0) {
                        delete j[p];
                        break;
                    }
                }
            }
            Object.assign(cache, j);
        }
        let loadList = Object.keys(readList);

        let singleWork = file => {
            let ranks = [];
            let zeros = [];
            return new Promise(resolve => {
                let list = JSON.parse(rank.read(file));
                let start = 0;
                let task = async () => {
                    if (start < list.length) {
                        let r = list[start];
                        let kd = encodeURIComponent(`${r.author} ${r.title}`);
                        let data,
                            delay = 0,
                            zeroRetry = 3;
                        if (cache[kd]) {
                            data = cache[kd];
                        } else {
                            do {
                                data = await rank.remote(kd);
                                let hasZero = false;
                                // for (let p in data) {
                                //     if (data[p] === 0) {
                                //         hasZero = true;
                                //         break;
                                //     }
                                // }
                                //baidu有时候查询不到，需要再次查询
                                hasZero = data.baidu === 0;
                                if (!hasZero) {
                                    zeroRetry = 0;
                                } else {
                                    console.log('baidu zero result, retry', zeroRetry);
                                    await wait(5 + Math.random() * 10);
                                    zeroRetry--;
                                }
                            } while (zeroRetry);
                            data.author = r.author;
                            data.title = r.title;
                            cache[kd] = data;
                            delay = delayBaseTime + delayMaxTime * Math.random();
                        }
                        for (let p in data) {
                            if (data[p] === 0) {
                                zeros.push(data);
                                break;
                            }
                        }
                        if (start && ((start % 5) === 0)) {
                            rank.write('./s.cache', JSON.stringify(cache));
                        }
                        ranks.push(data);
                        console.log(start + '/' + list.length);
                        start++;
                        setTimeout(task, delay);
                    } else {
                        rank.write('./s.cache', JSON.stringify(cache));
                        resolve([ranks, zeros]);
                    }
                };
                task();
            });
        };
        let work = async list => {
            let one = list.pop();
            console.log('remain ', list.length);
            if (one) {
                let f = path.basename(one);
                let aim = f.replace(/poet\.(song|tang)/, 'poet.$1.rank');
                let zeroAim = f.replace(/poet\.(song|tang)/, 'poet.$1.zero');
                let [ranks, zeros] = await singleWork(one);
                rank.write('./poet/' + aim, JSON.stringify(ranks, null, 4));
                if (zeros.length) {
                    rank.write('./poet/' + zeroAim, JSON.stringify(zeros, null, 4));
                }
                cache = Object.create(null);//文件写入后，清理缓存
                work(list);
            } else {
                resolve();
            }
        };
        work(loadList);
    });
};
(async () => {
    await ciTask();
    //await poetTask();
    headless.after();
    fs.unlink('./s.cache');
    console.log('complete');
})();