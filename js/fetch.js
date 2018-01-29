/*
    let url = 'http://demo.com/api'
    例: 
        http(url).
            then( res => {
                console.log(res)
            }).catch( e => {
                console.log(e)
            })
        http(url, {
            method: 'POST',

        })
*/
// const http = (url, setting) => {
function http(url, setting) {
    //设置参数的初始值
    let opts={
        method: (setting.method || 'GET').toUpperCase(), //请求方式
        headers : setting.headers  || {}, // 请求头设置
        credentials : setting.credentials  || true, // 设置cookie是否一起发送
        body: setting.body || {},
        mode : setting.mode  || 'no-cors', // 可以设置 cors, no-cors, same-origin
        redirect : setting.redirect  || 'follow', // follow, error, manual
        cache : setting.cache  || 'default' // 设置 cache 模式 (default, reload, no-cache)
    }
    let dataType = setting.dataType || "json", // 解析方式  
        data = setting.data || "" // 参数

    // 参数格式化
    function params_format (obj) {
        var str = ''
        for (var i in obj) {
            str += `${i}=${obj[i]}&`
        }
        return str.split('').slice(0, -1).join('')
    }

    if (opts.method === 'GET') {
        url = url + (data?`?${params_format(data)}`:'')
    }else{
        setting.body = data || {}
    }

    return new Promise( (resolve, reject) => {
        fetch(url, opts).then( async res => {
            let data = dataType === 'text' ? await res.text() :
                dataType === 'blob' ? await res.blob() : await res.json() 
            resolve(data)
        }).catch( e => {
            reject(e)
        })
    })
    
}
