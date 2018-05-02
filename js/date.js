class DateFn {
    /**
     * 格式化时间
     * 
     * @param  {time} 时间
     * @param  {cFormat} 格式
     * @return {String} 字符串
     *
     * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
     */
    formatTime(time, cFormat) {
        if (arguments.length === 0) return null
        if ((time + '').length === 10) {
            time = +time * 1000
        }

        var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', date
        if (typeof time === 'object') {
            date = time
        } else {
            date = new Date(time)
        }

        var formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            var value = formatObj[key]
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    }


    /**
     * 返回指定长度的月份集合
     * 
     * @param  {time} 时间
     * @param  {len} 长度
     * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
     * @return {Array} 数组
     * 
     * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
     */
    getMonths(time, len, direction) {
        var mm = new Date(time).getMonth()+1,
            yy = new Date(time).getFullYear(),
            direction = isNaN(direction) ? 3 : direction,
            index = mm;

        var cutMonth = function(index) {
            var arr 
            if (direction === 1) {
                arr = formatPre(index).reverse()
            }else if(direction === 2) {
                arr = formatNext(index)
            }else{
                arr = formatPre(index).reverse().slice(len/2).concat(formatNext(index).slice(1, len/2+1))
            }
            return arr.sort(function(t1, t2){
                return new Date(t1).getTime() - new Date(t2).getTime()
            })
        }

        var formatPre = function(index) {
            var currNum = index,
                preNum = 0,
                currArr = [],
                preArr = []
            if (index-len < 0) {
                preNum = len-currNum   
            }
            for (var i = 0; i < currNum; i++) {
                currArr.push([yy+'-'+(currNum-i)])
            }
            for (var i = 1; i <= preNum; i++) {
                preArr.push([(yy-Math.ceil(i/12))+'-'+(12-(i-1)%12)])
            }
            return currArr.concat(preArr)
        }

        var formatNext = function(index) {
            var currNum = 12-index,
                nextNum = 0,
                currArr = [],
                nextArr = []
            if (len-currNum > 0) {
                nextNum = len-currNum   
            }
            for (var i = 0; i <= currNum; i++) {
                currArr.push([yy+'-'+(index+i)])
            }
            for (var i = 1; i < nextNum; i++) {
                nextArr.push([(yy+Math.ceil(i/12))+'-'+(i%13 === 0 ? 1:i%13)])
            }
            return currArr.concat(nextArr)
        }
        return cutMonth(index)
    }



    /**
     * 返回指定长度的天数集合
     * 
     * @param  {time} 时间
     * @param  {len} 长度
     * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
     * @return {Array} 数组
     *
     * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
     */
    getDays(time, len, diretion) {
        var tt = new Date(time)
        var getDay = function(day) {
            var t = new Date(time)
            t.setDate(t.getDate() + day)
            var m = t.getMonth()+1
            return t.getFullYear()+'-'+m+'-'+t.getDate()
        }
        var arr = []
        if (diretion === 1) {
            for (var i = 1; i <= len; i++) {
                arr.unshift(getDay(-i))
            }
        }else if(diretion === 2) {
            for (var i = 1; i <= len; i++) {
                arr.push(getDay(i))
            }
        }else {
            for (var i = 1; i <= len; i++) {
                arr.unshift(getDay(-i))
            }
            arr.push(tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate())
            for (var i = 1; i <= len; i++) {
                arr.push(getDay(i))
            }
        }
        return diretion === 1 ? arr.concat([tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate()]) : 
            diretion === 2 ? [tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate()].concat(arr) : arr
    }


    /**
     * @param  {s} 秒数
     * @return {String} 字符串 
     *
     * @example formatHMS(3610) // -> 1h0m10s
     */
    formatHMS (s) {
        var str = ''
        if (s > 3600) {
            str = Math.floor(s/3600)+'h'+Math.floor(s%3600/60)+'m'+s%60+'s'
        }else if(s > 60) {
            str = Math.floor(s/60)+'m'+s%60+'s'
        }else{
            str = s%60+'s'
        }
        return str
    }

    /*获取某月有多少天*/
    getMonthOfDay (time) {
        var date = new Date(time)
        var year = date.getFullYear()
        var mouth = date.getMonth() + 1
        var days

        //当月份为二月时，根据闰年还是非闰年判断天数
        if (mouth == 2) {
            days = (year%4==0 && year%100==0 && year%400==0) || (year%4==0 && year%100!=0) ? 28 : 29
        } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
            //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
            days = 31
        } else {
            //其他月份，天数为：30.
            days = 30
        }
        return days
    }

    /*获取某年有多少天*/
    getYearOfDay (time) {
        var firstDayYear = this.getFirstDayOfYear(time);
        var lastDayYear = this.getLastDayOfYear(time);
        var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime())/1000;
        return Math.ceil(numSecond/(24*3600));
    }

    /*获取某年的第一天*/
    getFirstDayOfYear (time) {
        var year = new Date(time).getFullYear();
        return year + "-01-01 00:00:00";
    }

    /*获取某年最后一天*/
    getLastDayOfYear (time) {
        var year = new Date(time).getFullYear();
        var dateString = year + "-12-01 00:00:00";
        var endDay = this.getMonthOfDay(dateString);
        return year + "-12-" + endDay + " 23:59:59";
    }

    /*获取某个日期是当年中的第几天*/
    getDayOfYear (time) {
        var firstDayYear = this.getFirstDayOfYear(time);
        var numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime())/1000;
        return Math.ceil(numSecond/(24*3600));
    }

    /*获取某个日期在这一年的第几周*/
    getDayOfYearWeek (time) {
        var numdays = this.getDayOfYear(time);
        return Math.ceil(numdays / 7);
    }


    
}