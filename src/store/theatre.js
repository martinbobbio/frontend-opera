export default {
    namespaced: true,
    state: {
        shows: [
            {
                id: 'hamilton', title: 'Hamilton', photo: require('@/assets/shows/hamilton.png'), presentations: [{
                    id: 'hamilton-theatre-super-opera-2019-02-20-18-00',
                    show: { id: 'hamilton', title: 'Hamilton' },
                    theatre: { id: 'theatre-super-opera', title: 'Teatro de la Súper Ópera' },
                    date: '2019-02-20-18-00'
                }
                ]
            },
            {
                id: 'el-rey-leon', title: 'El Rey León', photo: require('@/assets/shows/el-rey-leon.png'), presentations: [{
                    id: 'el-rey-leon-theatre-super-opera-2019-02-20-18-00',
                    show: { id: 'el-rey-leon', title: 'El Rey León' },
                    theatre: { id: 'theatre-super-opera', title: 'Teatro de la Súper Ópera' },
                    date: '2019-02-20-18-00'
                }
                ]
            },
            {
                id: 'frozen', title: 'Frozen', photo: require('@/assets/shows/frozen.png'), presentations: [{
                    id: 'frozen-theatre-super-opera-2019-02-20-18-00',
                    show: { id: 'frozen', title: 'Frozen' },
                    theatre: { id: 'theatre-super-opera', title: 'Teatro de la Súper Ópera' },
                    date: '2019-02-20-18-00'
                }
                ]
            },
            {
                id: 'anastasia', title: 'Anastasia', photo: require('@/assets/shows/anastasia.png'), presentations: [{
                    id: 'anastasia-theatre-super-opera-2019-02-20-18-00',
                    show: { id: 'anastasia', title: 'Anastasia' },
                    theatre: { id: 'theatre-super-opera', title: 'Teatro de la Súper Ópera' },
                    date: '2019-02-20-18-00'
                }
                ]
            },
        ]
    }
}