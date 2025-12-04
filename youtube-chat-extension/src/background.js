// Background service worker
console.log('YouTube Chat Extension: Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});