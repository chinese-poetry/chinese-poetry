 /**
     * 异步请求
     */
    const get = function (url, data) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            if (data) {
                url = url + '?' + Object.keys(data).map(key => `${key}=${data[key]}`).join('&')
            }
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        let result = JSON.parse(xhr.responseText)
                        resolve(result);
                    } else {
                        reject ? reject() : errorMsg(result.msg || '失败')
                    }
                }
            }
            xhr.send(null);
        })
    }
    const post = function (url, data) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        let result = JSON.parse(xhr.responseText)
                        resolve(result);
                        successMsg(result.msg || '成功')
                    } else {
                        reject ? reject() : errorMsg(result.msg || '失败')
                    }
                }
            }
            xhr.send(json2FormData(data));
        })
    }

    const json2FormData = function (data) {
        let formData = new FormData()
        for (let key in data) {
            formData.set(key, data[key])
        }
        return formData
    }


Array.prototype.getMost = function(){
    var obj = this.reduce((p,n) =>(p[n]++ ||(p[n] = 1),(p.max=p.max>=p[n]?p.max:p[n]), (p.key=p.max>p[n]?p.key:n), p), {});
    return obj.key;
}
let result = {}
get('http://127.0.0.1:8880/%E8%AF%8D%E7%89%8C%E5%90%8D%E5%BD%92%E7%B1%BB%E9%95%BF%E5%BA%A6%E5%AF%B9%E6%AF%94.json').then(r => {
    let keys = Object.keys(r);
    keys.forEach(k => {
        let v = r[k]
        let dataList = []
        let _keys = Object.keys(v);
        _keys.forEach(_k => {
            let _o = v[_k]
            dataList = dataList.concat(Object.keys(_o).map(__k => _o[__k]))
        });

        result[k] = dataList.getMost()      
    })
})


get('http://127.0.0.1:8880/%E8%AF%8D%E7%89%8C%E5%90%8D%E5%BD%92%E7%B1%BB%E9%95%BF%E5%BA%A6%E5%AF%B9%E6%AF%94.json').then(r => {
    let keys = Object.keys(r);
    keys.forEach(k => {
        let standard = result[k]
        let v = r[k]
        let _keys = Object.keys(v);
        _keys.forEach(_k => {
            let _o = v[_k]
            Object.keys(_o).map(__k => {
                let __v = _o[__k]
                if  (__v === standard) {
                    delete _o[__k]
                }
            })
            if (Object.keys(_o).length === 0) {
                delete v[_k]
            }
        });

        if (Object.keys(v).length === 0) {
            delete r[k]
        }
        if (r[k]) {
            r[k][-1] = standard
        }

    })

    console.log(JSON.stringify(r))
})

function diff(standard, source) {
    let result = source
    let len_1 = standard.length
    let len_2 = source.length
    if (len_1 !== len_2 || standard.indexOf('-') !== source.indexOf('-')) {
        return `[?]${source}`
    }
    
    let offset = 1;
    for (let i = 0; i < len_1; i++) {
        let v = standard[i]
        let _v = source[i]
        if (v !== _v) {
            let _array = result.split('')
            _array.splice(i+offset, 0, `[${v}]`)
            result = _array.join('')
            offset = offset + 3
        }
    }
    return result;
}


get('http://127.0.0.1:8880/有问题的对象.json').then(r => {
    let keys = Object.keys(r);
    keys.forEach(k => {
        let v = r[k]
        let standard = v[-1]
        let _keys = Object.keys(v);
        _keys.forEach(_k => {
            let _o = v[_k]
            Object.keys(_o).map(__k => {
                let __v = _o[__k]
                if  (__v !== standard) {
                    // 对比差异
                    _o[__k] = diff(standard, __v)
                }
            })
        });
    })

    console.log(JSON.stringify(r))
})


/**
 * sql 生成
 */
let result = ''
 for(let i = 0; i < 22; i++) {
    get(`http://127.0.0.1:8880/ci.song.${i * 1000}.json`).then(r => {
        result += r.map((item, idx) => {
            return `insert into json_ci (author, paragraphs, rhythmic, fileIdx, idx, tags) values ('${item.author}', '${item.paragraphs.join('\\n')}', '${item.rhythmic}', ${i}, ${idx}, '${item.tags ? item.tags.join() : ""}');`
        }).join('\n')
    })
 }
 console.log(result)

