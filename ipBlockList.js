const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'blockedIPs.json'); // 文件路径

function loadBlockedIPs() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading the blocked IPs file:", error);
        return []; // 如果文件读取失败，则返回空数组
    }
}

function saveBlockedIPs(blockedIPs) {
    try {
        const data = JSON.stringify(blockedIPs, null, 2);
        fs.writeFileSync(filePath, data, 'utf8');
    } catch (error) {
        console.error("Error writing to the blocked IPs file:", error);
    }
}

function addIP(ip) {
    const blockedIPs = loadBlockedIPs();
    if (!blockedIPs.includes(ip)) {
        blockedIPs.push(ip);
        saveBlockedIPs(blockedIPs);
    }
}

function removeIP(ip) {
    const blockedIPs = loadBlockedIPs();
    const index = blockedIPs.indexOf(ip);
    if (index !== -1) {
        blockedIPs.splice(index, 1);
        saveBlockedIPs(blockedIPs);
    }
}

function getBlockedIPs() {
    return loadBlockedIPs();
}

module.exports = { addIP, removeIP, getBlockedIPs };