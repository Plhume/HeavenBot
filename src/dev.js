const fs = require('fs');
const filePath = './src/devmode.json';

function toggleDevmode() {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf8');
        
        const jsonObject = JSON.parse(jsonString);
        
        if ("devmode" in jsonObject) {
            jsonObject.devmode = !jsonObject.devmode;
            
            const modifiedJsonString = JSON.stringify(jsonObject, null, 2);
            
            fs.writeFileSync(filePath, modifiedJsonString, 'utf8');
            console.log('Devmode status toggled successfully.');
        } else {
            throw new Error('"devmode" property not found in JSON object');
        }
    } catch (error) {
        console.error('Error toggling devmode:', error.message);
    }
}

function getDevmodeStatus() {
    try {
        const jsonString = fs.readFileSync(filePath, 'utf8');
        
        const jsonObject = JSON.parse(jsonString);
        
        if ("devmode" in jsonObject) {
            return jsonObject.devmode;
        } else {
            throw new Error('"devmode" property not found in JSON object');
        }
    } catch (error) {
        console.error('Error getting devmode status:', error.message);
        return null;
    }
}

//const devmodeStatus = getDevmodeStatus();
//console.log('Devmode status:', devmodeStatus);

module.exports = {
    toggleDevmode,
    getDevmodeStatus
};