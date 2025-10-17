const fs = require('fs')
const path = require('path')

// Path ya monay.json ndani ya lib
const monayFile = path.join(__dirname, 'monay.json')

// Hakikisha monay.json ipo, kama haipo tengeneza empty array
if (!fs.existsSync(monayFile)) fs.writeFileSync(monayFile, '[]')

// Read JSON data
let _monayOrg = JSON.parse(fs.readFileSync(monayFile))

// Kiasi cha awali cha monay (change if needed)
let monayAwal = 100

// Function ya kuongeza user mpya
const addInventoriMonay = (sender) => {
    if (!cekDuluJoinAdaApaKagaMonaynyaDiJson(sender)) {
        const obj = { id: sender, monay: monayAwal }
        _monayOrg.push(obj)
        fs.writeFileSync(monayFile, JSON.stringify(_monayOrg, null, 2))
    }
}

// Check kama user tayari ana monay
const cekDuluJoinAdaApaKagaMonaynyaDiJson = (sender) => {
    return _monayOrg.some(user => user.id === sender)
}

// Function ya kuongeza monay
const addMonay = (sender, amount) => {
    let user = _monayOrg.find(user => user.id === sender)
    if (user) {
        user.monay += amount
        fs.writeFileSync(monayFile, JSON.stringify(_monayOrg, null, 2))
    }
}

// Function ya kupunguza monay
const kurangMonay = (sender, amount) => {
    let user = _monayOrg.find(user => user.id === sender)
    if (user) {
        user.monay -= amount
        if (user.monay < 0) user.monay = 0
        fs.writeFileSync(monayFile, JSON.stringify(_monayOrg, null, 2))
    }
}

// Function ya kupata monay ya user
const getMonay = (sender) => {
    let user = _monayOrg.find(user => user.id === sender)
    if (user) return user.monay
    return 0
}

module.exports = {
    addInventoriMonay,
    cekDuluJoinAdaApaKagaMonaynyaDiJson,
    addMonay,
    kurangMonay,
    getMonay
}
