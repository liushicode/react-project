/**
 * 封装localStorage工具函数
 */
const localStorage = window.localStorage
export function getItem(key) {
  const value = localStorage.getItem(key)
  try {
    return JSON.parse(value)
  } catch (error) {
    return value;
  }
  
}

export function setItem(key,value) {
  value = JSON.stringify(value);
  localStorage.setItem(key,value)
}

export function removeItem(key) {
  localStorage.removeItem(key)
}