import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DatePicker = ({ selected, onChange, placeholder, minDate, isClearable = false, className = '', error }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const [popupPosition, setPopupPosition] = useState('bottom'); // 'top' or 'bottom'
  const containerRef = useRef(null);

  // 点击外部关闭和智能定位
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen && containerRef.current) {
      // 计算是否应该向上弹出
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const calendarHeight = 350; // 日历组件的大概高度
      
      // 如果下方空间不足且上方空间足够，则向上弹出
      if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
        setPopupPosition('top');
      } else {
        setPopupPosition('bottom');
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // 填充上个月的日期
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }
    // 当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    // 填充下个月的日期（填满6行）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    return days;
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isDisabled = (date) => {
    if (!minDate) return false;
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    const check = new Date(date);
    check.setHours(0, 0, 0, 0);
    return check < min;
  };

  const handleDateClick = (date) => {
    if (!isDisabled(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // 多语言月份名称
  const monthNames = i18n.language === 'zh' 
    ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const weekDays = i18n.language === 'zh'
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const days = getDaysInMonth(currentMonth);

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 border ${error ? 'border-rose-500' : 'border-white/5'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer flex items-center justify-between hover:bg-white/10 ${
          className
        }`}
      >
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className={selected ? 'text-white' : 'text-slate-400'}>
            {selected ? formatDate(selected) : placeholder}
          </span>
        </div>
        {isClearable && selected && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            type="button"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: popupPosition === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: popupPosition === 'top' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${popupPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 z-50 bg-slate-800 border border-white/10 rounded-xl shadow-2xl p-4 min-w-[320px]`}
          >
            {/* 月份导航 */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                type="button"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </button>
              <h3 className="text-white font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                type="button"
              >
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                const isSelected = selected && isSameDay(day.date, selected);
                const isCurrentDay = isToday(day.date);
                const disabled = isDisabled(day.date);

                return (
                  <button
                    key={idx}
                    onClick={() => handleDateClick(day.date)}
                    disabled={disabled}
                    className={`
                      aspect-square rounded-lg text-sm font-medium transition-all
                      ${!day.isCurrentMonth ? 'text-slate-600' : 'text-slate-200'}
                      ${isSelected
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                        : 'hover:bg-white/10'
                      }
                      ${isCurrentDay && !isSelected
                        ? 'ring-2 ring-primary-500/50 bg-primary-500/20'
                        : ''
                      }
                      ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    type="button"
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;

