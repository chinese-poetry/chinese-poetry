//let puppeteer = require('puppeteer');
let fs = require('fs');
let path = require('path');
let https = require('https');
let sep = path.sep;
let delays = {
    baidu: {
        base: 1 * 1000,
        delay: 1 * 1000
    },
    bing: {
        base: 1 * 1000,
        delay: 1 * 1000
    },
    so360: {
        base: 3 * 1000,
        delay: 1 * 1000
    },
    google: {
        base: 1.2 * 1000,
        delay: 0.8 * 1000
    }
};

let fixLessNums = {
    baidu: [0, 100],
    google: [0, 500],
    bing: [0, 200],//
    bing_en: [0, 200],
    so360: [0, 200]
};
let bingSpecialNumbers = {
    // 12300: 1,
    // 12400: 1,
    // 12500: 1,
    // 12600: 1,
    // 12700: 1,
    // 12800: 1,
    // 12900: 1
};
let Zeros = {};
let ZerosFile = {};
let format = (type, complete, total, zero, tail) => {
    let diff = 6 - type.length;
    let pad = '';
    while (diff--) {
        pad += ' ';
    }
    type = pad + type;
    diff = 4 - String(complete).length;
    pad = '';
    while (diff--) {
        pad += ' ';
    }
    complete = pad + complete;
    diff = 4 - String(total).length;
    pad = '';
    while (diff--) {
        pad += ' ';
    }
    total = pad + total;
    return `${type}:${complete}/${total} [${zero}]${tail ? ' ' + tail : ''}`;
};

let canVisitGoogle = false;
let checkGoogle = async () => {
    return new Promise(resolve => {
        setTimeout(resolve, 3000);
        https.get('https://www.google.com/search?q=xinglie', res => {
            if (res.statusCode == 200) {
                canVisitGoogle = true;
            }
            resolve();
        }).on('error', resolve);
    });
};
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
    async toUrl(url, pi, kd) {
        let text = '',
            retry = 3;
        let sleep = time => {
            return new Promise(resolve => {
                setTimeout(resolve, time);
            });
        }
        let request = async () => {
            let local = this.$local;
            let pages = await local.pages();
            let page = pages[pi];
            let d = await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 10000
            });
            //console.log(url)
            //let cookies = await page.cookies();
            //await page.deleteCookie(...cookies);
            if (url.includes('baidu.com')) {
                if (!headless.$btf) {
                    await page.bringToFront();
                    headless.$btf = true;
                }
                await page.waitFor('#kw');
                await page.type('#kw', decodeURIComponent(kd), { delay: 60 });
                await sleep(1000 + (canVisitGoogle ? 0 : 3000));

                text = await page.$eval('body', e => e.innerHTML);
                let nums = 0;
                text = String(text).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '');
                text.replace(/百度为您找到相关结果约([\d,]+)个/, (_, m) => {
                    nums = parseInt(m.replace(/,/g, ''), 10);
                });
                if (nums === 0) {
                    input = await page.$('#su');
                    input.click();
                    await sleep(1000 + (canVisitGoogle ? 0 : 4000));
                    text = await page.$eval('body', e => e.innerHTML);
                } else {
                    //console.log('baidu auto query');
                }
                //console.log(text);
            } else if (url.includes('bing.com')) {
                await sleep(canVisitGoogle ? 300 : 1000);
                text = await page.$eval('body', e => e.innerHTML);
            } else {
                text = await d.text();
            }
        };
        do {
            try {
                await request();
                break;
            } catch (ex) {
                await sleep(5000);
                console.log('retry', retry, ex);
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
                    url: `https://www.baidu.com/`,
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
                    reg: /(?:找到约|About)?\s*([\d,]+)\s*(?:条结果|results)/,
                    page: 2
                },
                bing: {
                    url: `https://cn.bing.com/search?q=${kd}&FORM=BESBTB&ensearch=0`,
                    reg: />([\d,]+)\s*(?:results|条结果)<\/span>/i,
                    page: 3
                },
                bing_en: {
                    url: `https://cn.bing.com/search?q=${kd}&FORM=BESBTB&ensearch=1`,
                    reg: />([\d,]+)\s*(?:results|条结果)<\/span>/i,
                    page: 4
                }
            };
            let i = maps[type];
            let ii = maps.bing_en;
            let [text, newText] = await Promise.all([headless.toUrl(i.url, i.page, kd), type == 'bing' ? headless.toUrl(ii.url, ii.page, kd) : Promise.resolve('')]);
            let nums = 0;
            text = String(text).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '');
            text.replace(i.reg, (_, m) => {
                nums = parseInt(m.replace(/,/g, ''), 10);
            });
            let enNum = 0;
            if (type == 'bing') {
                newText.replace(ii.reg, (_, m) => {
                    enNum = parseInt(m.replace(/,/g, ''), 10);
                });
            }
            let res = {
                [type]: nums
            };
            if (type == 'bing') {
                res.bing_en = enNum;
            }
            r(res);
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
                    //walk(p, callback);
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

let ciReg = /ci\.song\.\d+y?\.json$/;
let ciTask = async () => {
    return new Promise(resolve => {
        let readList = {};
        let caches = {};
        let cList = ['so360', 'baidu'];
        if (canVisitGoogle) {
            cList.push('google', 'bing');
        }
        for (let c of cList) {
            caches[c] = Object.create(null);
        }
        rank.list('../ci', f => {
            if (ciReg.test(f)) {
                readList[path.resolve(f)] = 1;
            }
        });
        for (let c of cList) {
            if (fs.existsSync('./s.' + c + '.cache')) {
                let d = rank.read('./s.' + c + '.cache');
                let j = JSON.parse(d);
                if (!caches[c]) caches[c] = {};
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
                        let kd = encodeURIComponent(`${r.author} ${r.rhythmic}`);
                        let data,
                            delay = 0;
                        if (caches[type][kd]) {
                            data = caches[type][kd];
                        } else {
                            data = await rank.remote(kd, type);
                            data.author = r.author;
                            data.rhythmic = r.rhythmic;
                            caches[type][kd] = data;
                            let dl = delays[type];
                            delay = dl.base + dl.delay * Math.random();
                            if (start && ((start % 2) === 0)) {
                                rank.write('./s.' + type + '.cache', JSON.stringify(caches[type]));
                            }
                        }
                        let less = fixLessNums[type],
                            bingEnLess = fixLessNums.bing_en;
                        if ((data[type] >= less[0] &&
                            data[type] <= less[1]) ||
                            (type == 'bing' &&
                                data.bing_en <= bingEnLess[1] &&
                                data.bing_en >= bingEnLess[0])) {
                            zeros.push(data);
                            Zeros[type]++;
                        }
                        ranks.push(data);
                        let tail = `(${data[type]}`;
                        if (type == 'bing') {
                            tail += `,${data.bing_en}`;
                        }
                        tail += ')';
                        console.log(format(type, start, list.length, Zeros[type], tail));
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
                let aim = f.replace('ci.song', 'ci.song.rank.' + type);
                if (!fs.existsSync('./ci_temp/' + aim)) {
                    //let zeroAim = f.replace(/poet\.(song|tang)/, 'poet.$1.zero.' + type);

                    Zeros[type] = 0;
                    let [ranks, zeros] = await singleWork(one, type);
                    rank.write('./ci_temp/' + aim, JSON.stringify(ranks, null, 4));
                    // if (zeros.length) {
                    //     rank.write('./poet/' + zeroAim, JSON.stringify(zeros, null, 4));
                    // }

                    if (Zeros[type] > 0) {
                        if (!ZerosFile[type]) {
                            ZerosFile[type] = {};
                        }
                        ZerosFile[type][aim] = Zeros[type];
                        rank.write('./s.zero.cache', JSON.stringify(ZerosFile, null, 4));
                    }
                    caches[type] = Object.create(null);//文件写入后，清理缓存
                    setTimeout(() => {
                        work(type, index + 1, list);
                    }, 2 * 1000);
                } else {
                    console.log('ignore ' + aim);
                    work(type, index + 1, list);
                }
            } else {
                finised[type] = true;
                check();
            }
        };
        for (let c of cList) {
            work(c, 0, loadList);
        }
        check();
    });
};
let poetReg = /poet\.(song|tang)\.(\d+)\.json$/;
let poetTask = async () => {
    return new Promise(resolve => {
        let readList = {};
        let caches = {};
        let cList = ['so360', 'baidu', 'bing'];
        if (canVisitGoogle) {
            cList.push('google');
            if (!cList.includes('baidu')) {
                cList.push('baidu');
            }
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
                            //console.log(`${type} from cache`);
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
                        let less = fixLessNums[type],
                            bingEnLess = fixLessNums.bing_en;
                        if ((data[type] >= less[0] &&
                            data[type] <= less[1]) ||
                            (type == 'bing' &&
                                data.bing_en <= bingEnLess[1] &&
                                data.bing_en >= bingEnLess[0])) {
                            zeros.push(data);
                            Zeros[type]++;
                        }
                        ranks.push(data);
                        let tail = `(${data[type]}`;
                        if (type == 'bing') {
                            tail += `,${data.bing_en}`;
                        }
                        tail += ')';
                        console.log(format(type, start, list.length, Zeros[type], tail));
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
                    console.log('dest', aim);
                    //let zeroAim = f.replace(/poet\.(song|tang)/, 'poet.$1.zero.' + type);
                    Zeros[type] = 0;
                    let [ranks, zeros] = await singleWork(one, type);
                    rank.write('./poet_temp/' + aim, JSON.stringify(ranks, null, 4));
                    if (Zeros[type] > 0) {
                        if (!ZerosFile[type]) {
                            ZerosFile[type] = {};
                        }
                        ZerosFile[type][aim] = Zeros[type];
                        rank.write('./s.zero.cache', JSON.stringify(ZerosFile, null, 4));
                    }
                    // if (zeros.length) {
                    //     rank.write('./poet/' + zeroAim, JSON.stringify(zeros, null, 4));
                    // }
                    caches[type] = Object.create(null);//文件写入后，清理缓存
                    setTimeout(() => {
                        work(type, index + 1, list);
                    }, 2 * 1000);
                } else {
                    console.log('ignore ' + aim);
                    work(type, index + 1, list);
                }
            } else {
                finised[type] = true;
                check();
            }
        };
        for (let c of cList) {
            work(c, 0, loadList);
        }
        check();
    });
};

let runLessNumberTask = async (cat = 'poet') => {
    let caches = Object.create(null);
    let writeCtrl = 0;
    return new Promise(resolve => {
        let cList = ['so360'];//'bing','baidu', 'so360',
        if (canVisitGoogle) {
            cList.push('google', 'baidu', 'bing');
        }
        for (let c of cList) {
            caches[c] = Object.create(null);
        }
        let taskList = {};
        let taskIndex = {};
        rank.list(`./${cat}_temp`, f => {
            for (let c of cList) {
                if (f.includes(`.${c}.`)) {
                    if (!taskList[c]) {
                        taskList[c] = [];
                    }
                    taskList[c].push(f);
                }
            }
        });
        for (let c of cList) {
            if (fs.existsSync('./s.' + c + '.index.cache')) {
                let d = rank.read('./s.' + c + '.index.cache');
                let i = d.split(',');
                taskIndex[c] = [parseInt(i[0], 10), parseInt(i[1], 10)];
            } else {
                taskIndex[c] = [0, 0];
            }
        }
        let singleWork = (file, type, start) => {
            let oldCount = 0;
            return new Promise(resolve => {
                let list = JSON.parse(rank.read(file));
                let task = async () => {
                    if (start < list.length) {
                        let r = list[start];
                        let less = fixLessNums[type],
                            bingEnLess = fixLessNums.bing_en;
                        if ((r[type] >= less[0] &&
                            r[type] <= less[1]) ||
                            (type == 'bing' &&
                                ((r.bing_en >= bingEnLess[0] &&
                                    r.bing_en <= bingEnLess[1]) ||
                                    bingSpecialNumbers[r[type]] === 1 ||
                                    bingSpecialNumbers[r.bing_en] === 1)
                            )
                        ) {
                            writeCtrl++;
                            oldCount++;
                            //console.log(type, 'checked zero at', start);
                            let title = cat == 'ci' ? r.rhythmic : r.title;
                            let kd = encodeURIComponent(`${r.author} ${title}`);
                            let data,
                                delay = 0,
                                old = r[type],
                                old_en = r.bing_en;
                            if (caches[type][kd]) {
                                data = caches[type][kd];
                            } else {
                                data = await rank.remote(kd, type);
                                data.author = r.author;
                                if (cat == 'poet') {
                                    data.title = r.title;
                                } else {
                                    data.rhythmic = r.rhythmic;
                                }
                                caches[type][kd] = data;
                            }
                            let dl = delays[type];
                            delay = dl.base + dl.delay * Math.random();
                            if (data[type] > old) {
                                r[type] = data[type];
                            } else if (type != 'bing' ||
                                data.bing_en <= r.bing_en) {
                                Zeros[type]++;
                            }
                            if (type == 'bing' &&
                                (data.bing_en > r.bing_en ||
                                    bingSpecialNumbers[r.bing_en] === 1)) {
                                r.bing_en = data.bing_en;
                            }
                            if (writeCtrl % 3 === 0) {
                                rank.write(file, JSON.stringify(list, null, 4));
                                rank.write('./s.' + type + '.index.cache', [taskIndex[type][0], start]);
                                writeCtrl = 0;
                            }
                            let tail = '(' + old + '->' + r[type] + '[' + data[type] + ']';
                            if (type == 'bing') {
                                tail += ',' + old_en + '->' + r.bing_en + '[' + data.bing_en + ']';
                            }
                            tail += ')';
                            console.log(format(type, start, list.length, oldCount + '=>' + Zeros[type], tail));
                            start++;
                            setTimeout(task, delay);
                        } else {
                            start++;
                            task();
                        }
                    } else {
                        resolve(list);
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
        let work = async type => {
            let list = taskList[type];
            let index = taskIndex[type];
            let one = list[index[0]];
            let start = index[1];
            if (one) {
                console.log(one);
                console.log(`${type} current ${index[0]} ,total:${list.length}`);
                Zeros[type] = 0;
                let ranks = await singleWork(one, type, start);
                rank.write(one, JSON.stringify(ranks, null, 4));
                //caches[type] = Object.create(null);//文件写入后，清理缓存
                taskIndex[type][0]++;
                taskIndex[type][1] = 0;
                rank.write('./s.' + type + '.index.cache', [taskIndex[type][0], 0]);
                caches[type] = Object.create(null);
                setTimeout(() => {
                    work(type);
                }, 1000);
            } else {
                finised[type] = true;
                rank.write('./s.' + type + '.index.cache', [taskIndex[type][0], 0]);
                console.log(`${type} finished`);
                check();
            }
        };
        for (let c of cList) {
            work(c);
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
let mergeCi = () => {
    let readList = {};
    let cList = ['baidu', 'so360', 'bing', 'google'];
    rank.list('../ci', f => {
        if (ciReg.test(f)) {
            readList[path.resolve(f)] = 1;
        }
    });
    let loadList = Object.keys(readList);
    for (let ll of loadList) {
        let f = path.basename(ll);
        let aim = f.replace('ci.song', 'ci.song.rank');
        let zero = f.replace('ci.song', 'ci.song.zero');
        let newList = [],
            zeros = [],
            canMerge = true;
        for (let c of cList) {
            let src = f.replace('ci.song', 'ci.song.rank.' + c);
            if (fs.existsSync('./ci_temp/' + src)) {
                let d = rank.read('./ci_temp/' + src);
                let j = JSON.parse(d);
                for (let i = j.length; i--;) {
                    newList[i] = Object.assign(newList[i] || {}, j[i]);
                }
            } else {
                canMerge = false;
            }
        }
        if (canMerge) {
            rank.write('./ci/' + aim, JSON.stringify(newList, null, 4));
            for (let e of newList) {
                let hasZero = false;
                for (let p in e) {
                    if (e[p] === 0) {
                        hasZero = true;
                    }
                }
                if (hasZero) {
                    zeros.push(e);
                }
            }
            if (zeros.length) {
                rank.write('./ci/' + zero, JSON.stringify(zeros, null, 4));
            }
        }
    }
};
let mergePoet = () => {
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
        let zero = f.replace(/poet\.(song|tang)/, 'poet.$1.zero');
        let newList = [],
            canMerge = true,
            zeros = [];
        for (let c of cList) {
            let src = f.replace(/poet\.(song|tang)/, 'poet.$1.rank.' + c);
            if (fs.existsSync('./poet_temp/' + src)) {
                let d = rank.read('./poet_temp/' + src);
                let j = JSON.parse(d);
                for (let i = j.length; i--;) {
                    if (newList[i]) {
                        if (newList[i].author != j[i].author ||
                            newList[i].title != j[i].title) {
                            throw new Error(`bad info ${src} at ${i}`);
                        }
                    }
                    newList[i] = Object.assign(newList[i] || {}, j[i]);
                }
            } else {
                canMerge = false;
            }
        }
        if (canMerge) {
            rank.write('./poet/' + aim, JSON.stringify(newList, null, 4));
            // for (let e of newList) {
            //     let hasZero = false;
            //     for (let p in e) {
            //         if (e[p] === 0) {
            //             hasZero = true;
            //         }
            //     }
            //     if (hasZero) {
            //         zeros.push(e);
            //     }
            // }
            // if (zeros.length) {
            //     rank.write('./poet/' + zero, JSON.stringify(zeros, null, 4));
            // }
        }
    }
};

let outputBingNumbers = () => {
    let numbers = {};
    let result = [];
    rank.list('./poet_temp', f => {
        if (f.includes('rank.bing')) {
            let list = JSON.parse(rank.read(f));
            for (let e of list) {
                if (!numbers[e.bing]) {
                    numbers[e.bing] = 0;
                }
                numbers[e.bing]++;
                if (!numbers[e.bing_en]) {
                    numbers[e.bing_en] = 0;
                }
                numbers[e.bing_en]++;
            }
        }
    });
    for (let num in numbers) {
        if (numbers[num] > 1 && num > 10000) {
            result.push({
                num,
                count: numbers[num]
            });
        }
    }
    result = result.sort((b, a) => a.count - b.count);
    console.log(result);
};

let splitStrains = () => {
    rank.list('../json', f => {
        if (poetReg.test(f)) {
            let file = path.basename(f);
            let list = JSON.parse(rank.read(f));
            let aims = JSON.parse(rank.read(`../strains/json/${file}`));
            let index = 0;
            for (let e of list) {
                let strain = aims[index];
                aims[index] = {
                    strains: strain,
                    id: e.id
                };
                index++;
                //delete e.strains;
            }
            //rank.write(`../json/${file}`, JSON.stringify(list, null, 4));
            rank.write(`../strains/json/${file}`, JSON.stringify(aims, null, 4));
        }
    });
};
(async () => {
    splitStrains();
    //mergeCi();
    //merge();
    //await ciTask();
    //mergeCi();
    //outputBingNumbers();
    //await headless.before();
    //console.log('check google.com');
    //await checkGoogle();
    //console.log('google.com', canVisitGoogle);
    //await ciTask();
    //await Promise.all([ciTask(), runLessNumberTask('ci')]);
    //await runLessNumberTask('ci');
    //await runLessNumberTask();
    //headless.after();
    //mergePoet();
    //mergePoet();
})();