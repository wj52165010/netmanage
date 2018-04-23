//伪造数据

export let site_data={
    "Code": 1002,
    "Data": {
        "regions": [
            {
                "code": "500000",
                "note": "重庆市"
            },
            {
                "code": "500100",
                "note": "多级测试"
            },
            {
                "code": "500101",
                "note": "万州区"
            },
            {
                "code": "500102",
                "note": "涪陵区"
            },
            {
                "code": "500103",
                "note": "渝中区"
            }
        ],
        "polices": [
            {
                "code": "50032653",
                "note": "北部新区派出所"
            }
        ],
        "sites": [
            {
                "code": "50010110000042",
                "note": "万州区火鸟网吧(三峡网城A城)"
            },
            {
                "code": "50010110000043",
                "note": "万州区新文化网吧"
            },
            {
                "code": "50010110000044",
                "note": "万州区布莱迪网吧（龙都休闲）"
            },
            {
                "code": "50010110000045",
                "note": "万州区网行天下网吧"
            },
            {
                "code": "50010110000046",
                "note": "万州区嘉利网吧"
            }
        ]
    },
    "Msg": "",
    "ServiceTime": 1476327664
};


export let place_data={
    "Code": 1002,
    "Data": [
        {
            "type": 1,
            "code": "500000",
            "name": "重庆市",
            "child": [
                {
                    "type": 1,
                    "code": "500100",
                    "name": "市级",
                    "child": [
                        {
                            "type": 1,
                            "code": "500120",
                            "name": "测试县",
                            "child": [
                                {
                                    "code": "5002325",
                                    "name": "测试",
                                    "type": 2,
                                    "child": []
                                },
                                {
                                    "code": "5002365",
                                    "name": "测试派出所",
                                    "type": 2,
                                    "child": []
                                }
                            ]
                        },
                        {
                            "type": 2,
                            "code": "412356",
                            "name": "市直属派出所",
                            "child": []
                        },
                        {
                            "code": "50010110000044",
                            "name": "万州区布莱迪网吧（龙都休闲）",
                            "type": 3
                        },
                        {
                            "code": "50010110000046",
                            "name": "万州区嘉利网吧",
                            "type": 3
                        }
                    ]
                },
                {
                    "type": 1,
                    "code": "500101",
                    "name": "万州区",
                    "child": []
                },
                {
                    "type": 1,
                    "code": "500102",
                    "name": "涪陵区",
                    "child": []
                },
                {
                    "type": 1,
                    "code": "500103",
                    "name": "渝中区",
                    "child": []
                },
                {
                    "type": 1,
                    "code": "500999",
                    "name": "测试区",
                    "child": [
                        {
                            "type": 2,
                            "code": "1001",
                            "name": "沙坪坝派出所",
                            "child": []
                        },
                        {
                            "type": 2,
                            "code": "1011",
                            "name": "光电园",
                            "child": []
                        },
                        {
                            "type": 2,
                            "code": "1111",
                            "name": "智多测试",
                            "child": []
                        },
                        {
                            "type": 2,
                            "code": "50032653",
                            "name": "北部新区派出所",
                            "child": []
                        }
                    ]
                },
                {
                    "type": 2,
                    "code": "5002145",
                    "name": "省直属派出所",
                    "child": []
                }
            ]
        }
    ],
    "Msg": "",
    "ServiceTime": 1476436078
};