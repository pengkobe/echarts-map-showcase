/**
 * Created by chenzh on 2017/8/29.
 */
/*echarts*/
var geoCoordMap = {
    "A":[113.896203,22.500561],
    "B":[113.930123,22.551305],
    "C":[114.065444,22.536405]
};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};
$.get('json/area.json', function (mapJson) {
    echarts.registerMap('area', mapJson);
    var chart = echarts.init(document.getElementById('china_map'));//在id为mainMap的dom元素中显示地图
    chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function (result) {//回调函数，参数params具体格式参加官方API
                return result.name + '<br />数据:' + result.value;
            }
        },
        title: {
            text: '全国数据总览',
            //subtext:'',
            x: 'center',
            y: 'top',
            textAlign: 'left'
        },
        series: [{
            type: 'map',
            map: 'area',//要和echarts.registerMap（）中第一个参数一致
            //scaleLimit: { min: 0.8, max: 1.9 },//缩放
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#AAD9F7',
                    borderColor: 'white'
                }
            },
            label: {
                normal: {
                    show: true,
                    formatter: function (params) {
                        var icon;
                        var valueType = 'up';
                        if (!params.data.value) {
                            return '{NohasPrj|' + params.name + '} ';
                        }
                        if (params.data.value[0] > 0 && params.data.value[0] != 9999) {
                            icon = 'alarm';
                        } else if (params.data.value[0] == 0) {
                            icon = 'normal1';
                            return '{' + icon + '|}{hasPrj|' + params.name + '}\n{' + valueType + '|}' + params.data.value[1];
                        }
                        if (params.data.value[1] == 0) {
                            icon = 'nothing';
                            return '{' + icon + '|}{hasPrj|' + params.name + '}';
                        }
                        return '{' + icon + '|} {hasPrj|' + params.name + '}\n        {' + valueType + '|} {alarmfont|' + params.data.value[0] + '}/' + params.data.value[1];
                    },
                    rich: {
                        normal1: {
                            //color: '#019D2D',
                            //fontSize: 14,
                            width: 20,
                            height: 26,
                            backgroundColor: {
                                image: 'img/map1.png'
                            }
                        },
                        null: {
                            color: 'rgba(0,23,11,0.5)',
                            backgroundColor: 'rgba(0,23,11,0)'
                        },
                        NohasPrj: {
                            color: 'rgba(58,85,128,0.5)',
                            fontSize: 15,
                        },
                        hasPrj: {
                            color: '#3A5580',
                            fontSize: 15,
                            fontWeight: '500',
                            fontFamily: 'Microsoft YaHei'
                        },
                        alarmfont: {
                            fontSize: 14,
                            color: 'red',
                            fontWeight: '700'
                        },
                        nothing: {
                            width: 20,
                            height: 26,
                            backgroundColor: {
                                image: 'img/map3.png'
                            }
                        },
                        alarm: {
                            //color: 'red',
                            width: 20,
                            height: 26,
                            backgroundColor: {
                                image: 'img/map2.png'
                            }
                        },
                        up: {
                            height: 14,
                            //align: 'center',
                            backgroundColor: {
                                image: 'img/prj.png'
                            }
                        }
                    }
                },
                emphasis: {
                    show: true
                }
            },
            data: [
                {name: '华南地区', value: [30, 200]},
                {name: '华中地区', value: [100, 200]},
                {name: '华东地区', value: [10, 47]},
                {name: '华北地区', value: [0, 198]},
                {name: '西南地区', value: [11, 0]},
                {name: '东北地区', value: [10, 198]},
            ]
        }]
    });
    chart.on('click', function (result) { //回调函数，点击时触发，参数params格式参加官方API
        setTimeout(function () {
                $('#china_map').css('display', 'none');
                $('#partition_map').css('display', 'block');
                $('#city_map').css('display', 'none');
                $('#proe_map').css('display', 'none');
            }, 100
        );

        var selectPartition = result.name;
        $('#typename').html(selectPartition)
        // 调取后台数据
        $.get('json/' + selectPartition + '.json', function (Citymap) {
            echarts.registerMap(selectPartition, Citymap);
            var myChartPartition = echarts.init(document.getElementById('partition_map'));
            myChartPartition.clear();
            myChartPartition.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: function
                        loadData(result) {
                        //回调函数，参数params具体格式参加官方API
                        return result.name + '<br />数据:' + result.value;
                    }
                },
                title: {
                    text: selectPartition + '数据总览',
                    //subtext:'',
                    x: 'center',
                    y: 'top',
                    textAlign: 'left'
                },
                series: [{
                    type: 'map',
                    roam: true,
                    map: selectPartition,//要和echarts.registerMap（）中第一个参数一致
                    itemStyle: {
                        normal: {
                            areaColor: '#AAD9F7',
                            label: {show: true},
                            borderColor: 'white'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                var icon1;
                                var valueType1 = 'up';
                                if (!params.data.value) {
                                    return '{NohasPrj|' + params.name + '} ';
                                }
                                //console.log(params.data.value)
                                if (params.data.value[0] > 1 && params.data.value[0] != 9999) {
                                    icon1 = 'alarm';
                                } else if (params.data.value[0] == 9999 || params.data.value[0] < 0) {
                                    return;
                                } else if (params.data.value[0] == 0) {
                                    icon1 = 'normal1';
                                    return '{' + icon1 + '|}{hasPrj|' + params.name + '}\n{' + valueType1 + '|}' + params.data.value[1];
                                }
                                if (params.data.value[1] == 0) {
                                    icon1 = 'nothing';
                                    return '{' + icon1 + '|}{hasPrj|' + params.name + '}';
                                }
                                return '{' + icon1 + '|}{hasPrj|' + params.name + '}\n        {' + valueType1 + '|}{alarmfont|' + params.data.value[0] + '}/' + params.data.value[1];
                            },
                            rich: {
                                normal1: {
                                    //color: '#019D2D',
                                    //fontSize: 14,
                                    width: 20,
                                    height: 26,
                                    backgroundColor: {
                                        image: 'img/map1.png'
                                    }
                                },
                                null: {
                                    backgroundColor: 'rgba(0,23,11,0)'
                                },
                                NohasPrj: {
                                    color: 'rgba(58,85,128,0.5)',
                                    fontSize: 15
                                },
                                hasPrj: {
                                    color: '#3A5580',
                                    fontSize: 15,
                                    fontWeight: '500',
                                    fontFamily: 'Microsoft YaHei'
                                },
                                alarmfont: {
                                    fontSize: 14,
                                    color: 'red',
                                    fontWeight: '700'
                                },
                                nothing: {
                                    width: 20,
                                    height: 26,
                                    backgroundColor: {
                                        image: 'img/map3.png'
                                    }
                                },
                                alarm: {
                                    color: 'red',
                                    width: 20,
                                    height: 26,
                                    backgroundColor: {
                                        image: 'img/map2.png'
                                    }
                                },
                                up: {
                                    height: 14,
                                    //align: 'center',
                                    backgroundColor: {
                                        image: 'img/prj.png'
                                    }
                                }
                            }
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        {name: '广州市', value: [20, 50]},
                        {name: '深圳市', value: [10, 50]},
                        {name: '南宁市', value: [0, 50]},
                        {name: '百色市', value: [0, 50]},
                        {name: '梧州市', value: [10, 0]}
                    ]
                }]
            })
            myChartPartition.on('click', function (rel) {
                setTimeout(function () {
                    $(' #china_map').css('display', 'none');
                    $('#partition_map').css('display', 'none');
                    $('#city_map').css('display', 'none');
                    $('#proe_map').css('display', 'block');
                }, 100); //选择省份的单击事件
                var selectProe = rel.name;
                $('#typename').html(selectProe)
                //    调取后台数据
                $.get('json/cityarea/' + selectProe + '.json', function (Citymap) {
                    echarts.registerMap(selectProe, Citymap);
                    var myChartProe = echarts.init(document.getElementById('proe_map'));
                    myChartProe.clear();
                    myChartProe.setOption({
                        tooltip: {
                            trigger: 'item',
                            formatter: function loadData(result) {
                                //回调函数，参数params具体格式参加官方API
                                return result.name + '<br />数据:' + result.value[2];
                            }
                        },
                        title: {
                            text: selectProe + '数据总览',
                            //subtext:'',
                            x: 'center',
                            y: 'top',
                            textAlign: 'left'
                        },
                        geo: {
                                show:true,
                                map: selectProe,//要和echarts.registerMap（）中第一个参数一致
                                roam: true,
                                //  scaleLimit: { min: 0.8, max: 1.9 },//缩放
                                itemStyle: {
                                    normal: {
                                        areaColor: '#AAD9F7',
                                        label: {show: true},
                                        borderColor: 'white',
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        textStyle: {
                                            color: 'rgba(58,85,128,0.5)'
                                        }
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                }
                                //dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                            },
                        series: [
                            {
                                name: 'prj',
                                type: 'scatter',
                                coordinateSystem: 'geo',
                                data: convertData([
                                    {name: "A", value: [9,10]},
                                    {name: "B", value: [0,12]},
                                    {name: "C", value: [1,0]}
                                ]),
                                symbol:'circle' ,
                                symbolSize: [0.1,0.1],
                                label: {
                                    normal: {
                                        show: true,
                                        offset:[10,0],
                                        color:'#3A5580',
                                        fontSize: 15,
                                        fontWeight: '600',
                                        formatter: function (params) {
                                            var icon1;
                                            if (!params.data.value) {
                                                return '{NohasPrj|' + params.name + '} ';
                                            }
                                            //console.log(params.data.value)
                                            if (params.data.value[2] > 1 && params.data.value[2] != 9999) {
                                                icon1 = 'alarm';
                                            } else if (params.data.value[2] == 9999 || params.data.value[2] < 0) {
                                                return;
                                            } else if (params.data.value[2] == 0) {
                                                icon1 = 'normal1';
                                                return '{' + icon1 + '|}{hasPrj|' + params.name + '}';
                                            }
                                            if (params.data.value[3] == 0) {
                                                icon1 = 'nothing';
                                                return '{' + icon1 + '|}{hasPrj|' + params.name + '}';
                                            }
                                            return '{' + icon1 + '|}{hasPrj|' + params.name + '}'
                                        },
                                        rich: {
                                            normal1: {
                                                //color: '#019D2D',
                                                //fontSize: 14,
                                                width: 20,
                                                height: 26,
                                                backgroundColor: {
                                                    image: 'img/map1.png'
                                                }
                                            },
                                            null: {
                                                backgroundColor: 'rgba(0,23,11,0)'
                                            },
                                            NohasPrj: {
                                                color: 'rgba(58,85,128,0.5)',
                                                fontSize: 15
                                            },
                                            hasPrj: {
                                                color: '#3A5580',
                                                fontSize: 15,
                                                fontWeight: '500',
                                                fontFamily: 'Microsoft YaHei'
                                            },
                                            alarmfont: {
                                                fontSize: 14,
                                                color: 'red',
                                                fontWeight: '700'
                                            },
                                            nothing: {
                                                width: 20,
                                                height: 26,
                                                backgroundColor: {
                                                    image: 'img/map3.png'
                                                }
                                            },
                                            alarm: {
                                                color: 'red',
                                                width: 20,
                                                height: 26,
                                                backgroundColor: {
                                                    image: 'img/map2.png'
                                                }
                                            },
                                        }
                                    },
                                    emphasis: {
                                        show: false
                                    }
                                },
                                itemStyle: {
                                    emphasis: {
                                        borderColor: '#fff',
                                        borderWidth: 1
                                    }
                                }
                            }
                        ]

                    })
                    myChartProe.on('click', function (rel) {
                        setTimeout(function () {
                            function contains(arr, obj) {
                                var i = arr.length;
                                while (i--) {
                                    if (arr[i] === obj) {
                                        return true;
                                    }
                                }
                                return false;
                            }

                            var arr = new Array('北京市', '上海市', '天津市', '台湾', '重庆市');
                            if (contains(arr, selectProe) == false) {
                                $('#china_map').css('display', 'none');
                                $('#proe_map').css('display', 'none');
                                $('#partition_map').css('display', 'none');
                                $('#city_map').css('display', 'block');
                            }
                            else {
                                $('#china_map').css('display', 'none');
                                $('#partition_map').css('display', 'none');
                                $('#proe_map').css('display', 'block');
                                $(' #city_map').css('display', 'none');
                            }

                        }, 500);
                        //选择城市的单击事件
                        var selectCity = rel.name;
                        $('#typename').html(selectCity)
                        //    调取后台数据
                        $.get('json/cityarea/' + selectProe + '/' + selectCity + '.json', function (Citymap) {
                            echarts.registerMap(selectCity, Citymap);
                            var myChartCity = echarts.init(document.getElementById('city_map'));
                            myChartCity.clear();
                            myChartCity.setOption({
                                tooltip: {
                                    trigger: 'item',
                                    formatter: function loadData(result) {
                                        //回调函数，参数params具体格式参加官方API
                                        return result.name + '<br />数据:' + result.value;
                                    }
                                },
                                title: {
                                    text: selectCity + '数据总览',
                                    //subtext:'',
                                    x: 'center',
                                    y: 'top',
                                    textAlign: 'left'
                                },
                                geo:{
                                    show:true,
                                    map: selectCity,//要和echarts.registerMap（）中第一个参数一致
                                    roam: true,
                                    //  scaleLimit: { min: 0.8, max: 1.9 },//缩放
                                    mapLocation: {
                                        y: 60
                                    },
                                    itemStyle: {
                                        normal: {
                                            areaColor: '#AAD9F7',
                                            label: {show: true},
                                            borderColor: 'white',
                                            lineStyle: {
                                                color: 'white',
                                            }
                                        }
                                    },
                                    label: {
                                        normal: {
                                            show: true, textStyle: {
                                                color: '#3A5580'
                                            }
                                        },
                                        emphasis: {
                                            show: true
                                        }
                                    }
                                    //dataParam//人口数据：例如[{name:'济南',value:'100万'},{name:'菏泽'，value:'100万'}......]
                                },
                                series: [
                                    {
                                        name: 'prj',
                                        type: 'scatter',
                                        coordinateSystem: 'geo',
                                        data: convertData([
                                            {name: "A", value: [9,10]},
                                            {name: "B", value: [0,12]},
                                            {name: "C", value: [1,0]}
                                        ]),
                                        symbol: 'circle',
                                        symbolSize: [0.1,0.1],
                                        label: {
                                            normal: {
                                                show: true,
                                                offset:[40,0],
                                                color:'#3A5580',
                                                fontSize: 15,
                                                fontWeight: '600',
                                                formatter: function (params) {
                                                    var icon1;
                                                    if (!params.data.value) {
                                                        return '{NohasPrj|' + params.name + '} ';
                                                    }
                                                    //console.log(params.data.value)
                                                    if (params.data.value[2] > 1 && params.data.value[2] != 9999) {
                                                        icon1 = 'alarm';
                                                    } else if (params.data.value[2] == 9999 || params.data.value[2] < 0) {
                                                        return;
                                                    } else if (params.data.value[2] == 0) {
                                                        icon1 = 'normal1';
                                                        return '{' + icon1 + '|}{hasPrj|' + params.name + '}';
                                                    }
                                                    if (params.data.value[3] == 0) {
                                                        icon1 = 'nothing';
                                                        return '{' + icon1 + '|}{hasPrj|' + params.name + '}';
                                                    }
                                                    return '{' + icon1 + '|}{hasPrj|' + params.name + '}'
                                                },
                                                rich: {
                                                    normal1: {
                                                        //color: '#019D2D',
                                                        //fontSize: 14,
                                                        width: 20,
                                                        height: 26,
                                                        backgroundColor: {
                                                            image: 'img/map1.png'
                                                        }
                                                    },
                                                    null: {
                                                        backgroundColor: 'rgba(0,23,11,0)'
                                                    },
                                                    NohasPrj: {
                                                        color: 'rgba(58,85,128,0.5)',
                                                        fontSize: 15
                                                    },
                                                    hasPrj: {
                                                        color: '#3A5580',
                                                        fontSize: 15,
                                                        fontWeight: '500',
                                                        fontFamily: 'Microsoft YaHei'
                                                    },
                                                    alarmfont: {
                                                        fontSize: 14,
                                                        color: 'red',
                                                        fontWeight: '700'
                                                    },
                                                    nothing: {
                                                        width: 20,
                                                        height: 26,
                                                        backgroundColor: {
                                                            image: 'img/map3.png'
                                                        }
                                                    },
                                                    alarm: {
                                                        color: 'red',
                                                        width: 20,
                                                        height: 26,
                                                        backgroundColor: {
                                                            image: 'img/map2.png'
                                                        }
                                                    },
                                                }
                                            },
                                            emphasis: {
                                                show: false
                                            }
                                        },
                                        itemStyle: {
                                            emphasis: {
                                                borderColor: '#fff',
                                                borderWidth: 1
                                            }
                                        }
                                    }
                                ]
                            })
                            myChartCity.on('click',function(rel){
                                
                            })
                        })
                    });
                })
            });

        })
    });
})