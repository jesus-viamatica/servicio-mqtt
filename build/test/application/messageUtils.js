"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMessageToArray = convertMessageToArray;
function convertMessageToArray(message) {
    let trimmedMessage = message.trim().replace(/^\{\s*/, '').replace(/\s*\}$/, '');
    let values = trimmedMessage.split(',').map(value => {
        if (!isNaN(parseFloat(value)) || value.trim().toLowerCase() === 'nan') {
            return value.trim();
        }
        else {
            return `"${value.trim()}"`;
        }
    });
    return `[${values.join(',')}]`;
}
