const fs = require('fs');
const content = fs.readFileSync('C:/Users/user/.gemini/antigravity/brain/785c51a1-98b5-4377-9da0-96cf25ee9484/.system_generated/steps/370/content.md', 'utf8');
const regex = /https:\/\/avatars\.mds\.yandex\.net\/get-altay\/[^"'\s\\]+/g;
const matches = [...new Set(content.match(regex))].filter(u => !u.includes('favicon') && !u.includes('apple-touch-icon'));
console.log(JSON.stringify(matches, null, 2));
