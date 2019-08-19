let puppeteer = require('puppeteer');
let fs = require('fs');
let path = require('path');
let https = require('https');
let sep = path.sep;
let delays = {
    baidu: {
        base: 2 * 1000,
        delay: 1 * 1000
    },
    bing: {
        base: 2 * 1000,
        delay: 1 * 1000
    },
    so360: {
        base: 1 * 1000,
        delay: 1 * 1000
    },
    google: {
        base: 1 * 1000,
        delay: 1 * 1000
    }
}
let wait = second => new Promise(r => { setTimeout(r, second * 1000); });
//使用chrome模拟访问
let headless = {
    before() {
        return new Promise(async resolve => {
            if (!this.$local) {
                let brower = await puppeteer.launch({
                    headless: false,
                    defaultViewport: {
                        width: 1440,
                        height: 900
                    }
                });
                this.$local = brower;
                let pages = await brower.pages();
                let ps = [],
                    diff = 5 - pages.length;
                while (diff--) {
                    ps.push(brower.newPage());
                }
                Promise.all(ps).then(resolve);
            } else {
                resolve();
            }
        });
    },
    async toUrl(url, pi) {
        let text = '',
            retry = 3;
        let request = async () => {
            let local = this.$local;
            let pages = await local.pages();
            let page = pages[pi];
            let d = await page.goto(url, {
                waitUntil: 'networkidle0'
            });
            text = await d.text();
        };
        do {
            try {
                await request();
                break;
            } catch{
                console.log('retry', retry);
                retry--;
            }
        } while (retry);
        return text;
    },
    after() {
        if (this.$local) {
            this.$local.close();
            delete this.$local;
            if (this.$browsers) {
                for (let b of this.$browsers) {
                    b.close();
                }
                delete this.$browsers;
            }
        }
    }
};
let rank = {
    remote(kd, type) {
        return new Promise(async r => {
            let maps = {
                baidu: {
                    url: `https://www.baidu.com/s?wd=${kd}&rsv_spt=1&ie=utf-8&f=8`,
                    reg: /百度为您找到相关结果约([\d,]+)个/,
                    page: 0,
                },
                so360: {
                    url: `https://www.so.com/s?q=${kd}`,
                    reg: /找到相关结果约([\d,]+)个/,
                    page: 1,
                },
                google: {
                    url: `https://www.google.com/search?q=${kd}`,
                    reg: /(?:找到约|About)\s*([\d,]+)\s*(?:条结果|results)/,
                    page: 2
                },
                bing: {
                    url: `https://cn.bing.com/search?q=${kd}&FORM=BESBTB`,
                    reg: /<span\s+class="sb_count">([\d,]+)\s+(?:results|条结果)<\/span>/,
                    page: 3
                }
            };
            let i = maps[type];
            let text = await headless.toUrl(i.url, i.page);
            let nums = 0;
            text = String(text).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '');
            text.replace(i.reg, (_, m) => {
                //console.log(m);
                nums = parseInt(m.replace(/,/g, ''), 10);
            });
            r({
                [type]: nums
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
                if (a.baidu === 0) {
                    delete j[p];
                }
                // for (let z in a) {
                //     if (a[z] === 0) {
                //         delete j[p];
                //         break;
                //     }
                // }
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
                            //let dl = delays[type];
                            //delay = dl.base + dl.delay * Math.random();
                        }
                        for (let p in data) {
                            if (data[p] === 0) {
                                zeros.push(data);
                                break;
                            }
                        }
                        if (start && ((start % 5) === 0)) {
                            rank.write('./s.cache', JSON.stringify(cache, null, 4));
                        }
                        ranks.push(data);
                        console.log(start + '/' + list.length);
                        start++;
                        setTimeout(task, delay);
                    } else {
                        rank.write('./s.cache', JSON.stringify(cache, null, 4));
                        resolve([ranks, zeros]);
                    }
                };
                task();
            });
        };
        let work = async list => {
            let one = list.pop();
            if (one) {
                console.log('ci remain ', list.length);
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
                console.log('ci complete');
                resolve();
            }
        };
        work(loadList);
    });
};
let canVisitGoogle = false;
let checkGoogle = async () => {
    return new Promise(resolve => {
        https.get('https://www.google.com/search?q=xinglie', res => {
            if (res.statusCode == 200) {
                canVisitGoogle = true;
            }
            resolve();
        }).on('error', e => {
            console.log(e);
            resolve();
        });
    });
};
let poetReg = /poet\.(song|tang)\.(\d+)\.json$/;
let poetTask = async () => {
    return new Promise(resolve => {
        let readList = {};
        let caches = {};
        let cList = ['baidu', 'so360', 'bing'];
        if (canVisitGoogle) {
            cList.push('google');
        }

        for (let c of cList) {
            caches[c] = Object.create(null);
        }
        rank.list('../json', f => {
            if (poetReg.test(f)) {
                readList[path.resolve(f)] = 1;
            }
        });
        for (let c of cList) {
            if (fs.existsSync('./s.' + c + '.cache')) {
                let d = rank.read('./s.' + c + '.cache');
                let j = JSON.parse(d);
                if (!caches[c]) caches[c] = {};
                for (let e in j) {
                    if (j[e][c] === 0) {
                        delete j[e];
                    }
                }
                Object.assign(caches[c], j);
            }
        }
        let loadList = Object.keys(readList);
        let singleWork = (file, type) => {
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
                            delay = 0
                        if (caches[type][kd]) {
                            data = caches[type][kd];
                        } else {
                            data = await rank.remote(kd, type);
                            data.author = r.author;
                            data.title = r.title;
                            caches[type][kd] = data;
                            let dl = delays[type];
                            delay = dl.base + dl.delay * Math.random();

                            if (start && ((start % 2) === 0)) {
                                rank.write('./s.' + type + '.cache', JSON.stringify(caches[type]));
                            }
                        }
                        for (let p in data) {
                            if (data[p] === 0) {
                                zeros.push(data);
                                break;
                            }
                        }
                        ranks.push(data);
                        console.log(type + ':' + start + '/' + list.length);
                        start++;
                        setTimeout(task, delay);
                    } else {
                        rank.write('./s.' + type + '.cache', JSON.stringify(caches[type]));
                        resolve([ranks, zeros]);
                    }
                };
                task();
            });
        };
        let finised = {};
        let check = () => {
            let all = true;
            for (let c of cList) {
                if (finised[c] !== true) {
                    all = false;
                }
            }
            if (all) {
                resolve();
            }
        };
        let work = async (type, index, list) => {
            let one = list[index];
            if (one) {
                console.log(`${type} current ${index} ,total:${list.length}`);
                let f = path.basename(one);
                let aim = f.replace(/poet\.(song|tang)/, 'poet.$1.rank.' + type);
                if (!fs.existsSync('./poet_temp/' + aim)) {
                    //let zeroAim = f.replace(/poet\.(song|tang)/, 'poet.$1.zero.' + type);
                    let [ranks, zeros] = await singleWork(one, type);
                    rank.write('./poet_temp/' + aim, JSON.stringify(ranks, null, 4));
                    // if (zeros.length) {
                    //     rank.write('./poet/' + zeroAim, JSON.stringify(zeros, null, 4));
                    // }
                    caches[type] = Object.create(null);//文件写入后，清理缓存
                    setTimeout(() => {
                        work(type, index + 1, list);
                    }, 10 * 1000);
                } else {
                    console.log('ignore ' + aim);
                    work(type, index + 1, list);
                }
            } else {
                finised[type] = true;
            }
        };
        for (let c of cList) {
            work(c, 0, loadList);
        }
        check();
    });
};
let split = () => {
    let keys = ['baidu', 'so360', 'bing', 'google'];
    rank.list('./poet', f => {
        let b = path.basename(f);
        let d = JSON.parse(rank.read(f));
        for (let key of keys) {
            let aim = b.replace(/poet\.(song|tang).rank/, 'poet.$1.rank.' + key);
            let newList = [];
            for (let e of d) {
                newList.push({
                    author: e.author,
                    title: e.title,
                    [key]: e[key]
                });
            }
            rank.write('./poet2/' + aim, JSON.stringify(newList, null, 4));
        }
    });
};
let merge = () => {
    let readList = {};
    let cList = ['baidu', 'so360', 'bing', 'google'];
    rank.list('../json', f => {
        if (poetReg.test(f)) {
            readList[path.resolve(f)] = 1;
        }
    });
    let loadList = Object.keys(readList);
    for (let ll of loadList) {
        let f = path.basename(ll);
        let aim = f.replace(/poet\.(song|tang)/, 'poet.$1.rank');
        let newList = [],
            canMerge = true;
        for (let c of cList) {
            let src = f.replace(/poet\.(song|tang)/, 'poet.$1.rank.' + c);
            if (fs.existsSync('./poet_temp/' + src)) {
                let d = rank.read('./poet_temp/' + src);
                let j = JSON.parse(d);
                for (let i = j.length; i--;) {
                    newList[i] = Object.assign(newList[i] || {}, j[i]);
                }
            } else {
                canMerge = false;
            }
        }
        if (canMerge) {
            rank.write('./poet/' + aim, JSON.stringify(newList, null, 4));
        }
    }
};
(async () => {
    //merge();
    //await ciTask();
    await headless.before();
    await checkGoogle();
    await poetTask();
    headless.after();
    merge();
})();