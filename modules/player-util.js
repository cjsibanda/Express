var players = [
    {
        name: "Xholani",
        age: 30,
        position: "Forward",
        team: 'Kaizer Chiefs',
        visible: true,
        imageUrl: "img1.jpg"
    },
    {
        name: "Thamsanqa",
        age: 27,
        position: "Goal Keeper",
        team: 'Orlando Pirates',
        visible: false,
        imageUrl: "img2.jpg"
    },
    {
        name: 'Mwaruwari',
        age: 25,
        position: "Left wing",
        team: 'Bafana Bafana',
        visible: true,
        imageUrl: "img3.jpg"

    }
];

module.exports.getAllPlayers = function () {
    return employees;
}

module.exports.getVisiblePlayers = function (emp) {
    let filtered = [];

    for ( let i = 0; emp.length; i++) {
        if (emp[i].visible) {
            filtered.push(emp[i]);
        }
    }

    return filtered;
}