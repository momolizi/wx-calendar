// components/date/date.js
const Util = require('../../utils/util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isRank: {
      type: Boolean,
      value: false
    },
    minDate: {
      type: String,
    },
    maxDate: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    week: [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ],
    dates: [],
    selectedDate: '',    //单个日期
    startDate: '',
    endDate: '',
    // minDate: '2019-01-01',
    // maxDate: '',
    // isRank: true
  },

  ready () {
    let date = new Date()
    //记录当前页面时间
    this.setData({
      date: date,
      year: date.getFullYear(),
      month: date.getMonth(),
      selectedDate: this.data.isRank ? '' : Util.formatTime(date),
      // maxDate: date
    })
    this.renderDate();
  },

  /**
   * 组件的方法列表
   */
  methods: {
      /**
     * 渲染页面日期
     */
    renderDate () {
      let day = this.getDays(this.data.date);
      let propDay = this.getDays(this.data.date, true);
      let nextDay = this.getDays(this.data.date, false, true);
      this.setData({
        dates: this.setPageDate(day, propDay, nextDay, this.getOneWeek(this.data.date))
      })
    },

    /**
     * 获取月份天数
     */
    getDays (date, prop, next) {
      let days = new Date(date);
      let day;
      let month = days.getMonth();
      let year = days.getFullYear();
      //判断是否是闰年
      let isSpecYear = (year%4 === 0 && year%100 != 0 || year%400 === 0) ? true : false;
      let currentMonth = prop ? month - 1 < 0 ? 11 : month - 1 : month;
      currentMonth = next ? currentMonth + 1 > 11 ? 0 : currentMonth + 1 : currentMonth;
      switch(currentMonth) {
        case 0:
          day = 31;
          break;
        case 1:
          day = isSpecYear ? 29 : 28;
          break;
        case 2:
          day = 31;
          break;
        case 3:
          day = 30;
          break;
        case 4:
          day = 31;
          break;
        case 5:
          day = 30;
          break;
        case 6:
          day = 31;
          break;
        case 7:
          day = 31;
          break;
        case 8:
          day = 30;
          break;
        case 9:
          day = 31;
          break;
        case 10:
          day = 30;
          break;
        case 11:
          day = 31;
          break;
      }
      return day
    },

    /**
     * 获取某月1号是星期几
     */
    getOneWeek (date) {
      let time = new Date(date);
      time.setDate(1);
      return time.getDay()
    },

    /**
     * 将每一页的日期放到一个数组里面
     */
    setPageDate (currentDay, prop, next, week) {
      let date = new Date(this.data.date);
      let arr = [];
      let selectedDate = this.data.selectedDate ? new Date(this.data.selectedDate): undefined;
      let startDate = this.data.startDate ? new Date(this.data.startDate): undefined;
      let endDate = this.data.endDate ? new Date(this.data.endDate): undefined;
      for(let i = 1; i <= week; i++) {
        arr.push({
          date: '',
          disabled: true
        })
      }
      for(let i = 1; i <= 42 - week; i++) {
        if(i <= currentDay) {
          arr.push({
            date: i
          })
        }
       
      }

      arr.forEach((ele, index) => {
        //判断周六周日
        if((index +1) % 7 === 0 || (index + 1) % 7 === 1) {
          ele.isWeekday = true
        }

        //判断日期是否大于最小日期和是否大于最大日期
        if(this.data.minDate && !ele.disabled) {
          let minTime = new Date(this.data.minDate).getTime();
          let maxTime = new Date(this.data.maxDate).getTime();
          date.setDate(ele.date)
          let currentTime =  new Date(date).getTime();
          if(currentTime < minTime || currentTime > maxTime) {
            ele.isOver = true
          }
        }

        //判断是否是已选择的日期
        
        if((selectedDate && ele.date === selectedDate.getDate() && this.data.month === selectedDate.getMonth() && this.data.year === selectedDate.getFullYear()) 
        || (startDate && ele.date === startDate.getDate() && this.data.month === startDate.getMonth() && this.data.year === startDate.getFullYear()) 
        || (endDate && ele.date === endDate.getDate() && this.data.month === endDate.getMonth() && this.data.year === endDate.getFullYear())) {
          ele.isActive = true
        }
      })
      return arr
    },

    /**
     * 上个月
     */
    propMonth () {
      let date = new Date(this.data.date);
      let currentDate = new Date(date.setDate(-1));
      //判断是否到达最小日期
      if(this.data.minDate) {
        let minTime = new Date(this.data.minDate).getTime();
        let newTime = currentDate.getTime();
        if(newTime <= minTime) {
          return false
        }
      }
      
      this.setData({
        date: currentDate,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
      })
      this.renderDate()
    },

    /**
     * 下个月
     */
    nextMonth () {
      let date = new Date(this.data.date);
      let days = this.getDays(date);
      let currentDate = new Date(date.setDate(days + 1));
      this.setData({
        date: currentDate,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
      })
      this.renderDate()
    },

    /**
     * 选择日期
     */
    selectDate (e) {
      let index = e.currentTarget.dataset.index;
      let day = this.data.dates[index];
      if(day.disabled || day.isOver) {
        return false
      }

      let date = new Date(this.data.date);
      date.setDate(day.date);
      
      if(day.isActive) {
        if(this.data.selectedDate) {
          this.setData({
            selectDate: ''
          })
        }else {
          let startDate = this.data.startDate ? new Date(this.data.startDate) : undefined;
          let endDate = this.data.endDate ? new Date(this.data.endDate) : undefined;
          if(startDate && startDate.getDate() === date.getDate() && startDate.getMonth() === date.getMonth() && startDate.getFullYear() === date.getFullYear()) {
            this.setData({
              startDate: ''
            })
          }
          if(endDate && endDate.getDate() === date.getDate() && endDate.getMonth() === date.getMonth() && endDate.getFullYear() === date.getFullYear()) {
            this.setData({
              endDate: ''
            })
          }
        }
      }else {
        if(this.data.isRank) {
          let startDate = this.data.startDate ? new Date(this.data.startDate) : undefined;
          let endDate = this.data.endDate ? new Date(this.data.endDate) : undefined;
          if(!startDate) {
            this.setData({
              startDate: endDate ?  date.getTime() < endDate.getTime() ? Util.formatTime(date) : Util.formatTime(endDate) : Util.formatTime(date),
              endDate: endDate ? date.getTime() < endDate.getTime() ? Util.formatTime(endDate) : Util.formatTime(date) : ''
            })
          }
  
          if(startDate && !endDate) {
            this.setData({
              endDate: date.getTime() > startDate.getTime() ? Util.formatTime(date) : Util.formatTime(startDate),
              startDate: date.getTime() > startDate.getTime() ? Util.formatTime(startDate) : Util.formatTime(date)
            })
          }
        }else {
          this.setData({
            selectedDate: Util.formatTime(date),
            // minDate: Util.formatTime(date)
          })
        }
      }
      this.renderDate()
    }
  }
})
