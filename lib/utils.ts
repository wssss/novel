import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日期格式化函数
export function dateFormat(format: string, date: Date | number = new Date()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  
  const formatMap: { [key: string]: string } = {
    'YYYY': d.getFullYear().toString(),
    'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
    'DD': d.getDate().toString().padStart(2, '0'),
    'HH': d.getHours().toString().padStart(2, '0'),
    'mm': d.getMinutes().toString().padStart(2, '0'),
    'ss': d.getSeconds().toString().padStart(2, '0'),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match]);
}

// 日期加减函数
export function addDay(days: number, date: Date = new Date()): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// 使用示例：
// dateFormat('YYYY-MM-DD') // 返回当前日期，如：'2024-03-14'
// dateFormat('YYYY-MM-DD HH:mm:ss') // 返回当前日期时间，如：'2024-03-14 15:30:45'
// dateFormat('YYYY-MM-DD', addDay(-7)) // 返回7天前的日期


export function wordCountFormat(wordCount: number) {
  if (wordCount >= 50000) {
    return (wordCount / 10000) + "万";
  }
  if (wordCount >= 4000) {
    return (wordCount / 1000) + "千";
  }
  return wordCount;
}
