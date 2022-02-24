import './index.css'
// 可注释
// import React from "react";
// import axios from 'axios';
// import * as echarts from 'echarts/core';
// import {
//     TitleComponent,
//     TooltipComponent,
//     LegendComponent
// } from 'echarts/components';
// import {PieChart} from 'echarts/charts';
// import {LabelLayout} from 'echarts/features';
// import {CanvasRenderer} from 'echarts/renderers';
//
// echarts.use([
//     TitleComponent,
//     TooltipComponent,
//     LegendComponent,
//     PieChart,
//     CanvasRenderer,
//     LabelLayout
// ]);

// 可注释 end
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
            );
        }
    }
    return fmt;
}

const transformEchartsData = (item, color) => {
    const {
        name,
        firstTime,
        lastTime,
        threeTime,
        fourTime,
        fiveTime,
        sixTime,
    } = item;
    return {
        title: {
            top: "0%",
            text: name,
            subtext: `${dateFormat(
                "YYYY-mm-dd HH:MM:SS",
                new Date(firstTime * 1000)
            )} - ${dateFormat(
                "YYYY-mm-dd HH:MM:SS",
                new Date(lastTime * 1000)
            )}`,
            textStyle: {
                color: color.black
            },
            subtextStyle: {
                color: color.tip
            },
            left: "center",
        },
        tooltip: {
            trigger: "item",
        },
        itemStyle: {
            borderColor: color.white,
            borderWidth: 1
        },
        legend: {
            top: "14%",
            left: "center",
            textStyle: {
                color: color.tip
            }
        },
        label: {
            alignTo: 'edge',
            formatter: "{b}\n{c}个\n{d}%",
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            color: color.black
        },
        labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80
        },
        series: [
            {
                type: "pie",
                legendHoverLink: false,
                radius: ["15%", "45%"],
                center: ['50%', '60%'],
                data: [
                    {
                        value: sixTime || '--',
                        name: "6星干员",
                        itemStyle: {color: color['color6']},
                    },
                    {
                        value: fiveTime || '--',
                        name: "5星干员",
                        itemStyle: {color: color['color5']},
                    },
                    {
                        value: fourTime || '--',
                        name: "4星干员",
                        itemStyle: {color: color['color4']},
                    },
                    {
                        value: threeTime || '--',
                        name: "3星干员",
                        itemStyle: {color: color['color3']},
                    },
                ],
                emphasis: {
                    disabled: true
                },
            },
        ],
    };
}
const ListItem = ({data, color}) => {
    const {ts, pool, times, name, isNew} = data;
    return <>
        <small>
            <span style={{color}}>
                <sl-format-date lang="zh" month="long" day="numeric" year="numeric" hour-format='24' hour="numeric"
                                minute="numeric" second="numeric" date={new Date(ts * 1000)}/> [{times}]
                {name}{isNew ? <sup className={'new-tag'}>NEW</sup> : ''}
            </span>
            <small className={'tip'}> ({pool})
            </small>
        </small>
        <br/>
    </>
}
const GridItem = ({item, color}) => {
    const ref = React.useRef(null);
    const echartRef = React.useRef(null);
    const {total, sixTag, fiveTag, avgSix, avgFive, name, sixItem, fiveItem} = item;

    React.useEffect(() => {
        if (ref.current) {
            echartRef.current = echarts.init(ref.current);
            echartRef.current?.setOption(transformEchartsData(item, color));
            echartRef.current?.resize()
            return () => {
                echartRef.current?.clear();
            };
        }
    }, [])
    React.useEffect(() => {
        echartRef.current?.setOption(transformEchartsData(item, color));
        echartRef.current?.resize()
    }, [color])
    return <div className="detail-data">
        <div className='echart-c' style={{height: 400}}>
            <div
                ref={ref}
                style={{
                    height: 400,
                    width: 400,
                    userSelect: 'none',
                    position: 'relative',
                }}
            />
        </div>
        <div>
            <div>一共 <a className={'pBlue'}>{total}</a> 抽，已累计 <a
                style={{color: 'var(--sl-color-success-600)'}}>{sixTag}</a> 抽未出6星
            </div>
            <div className={'pt10'}>平均出货次数：</div>
            <div className={'clean-float'}>
                <div style={{float: 'left'}}>
                    <strong>6星：<a style={{color: color['color6']}}>{avgSix}</a> 抽</strong>
                </div>
                <div style={{float: 'right'}}>
                    <strong>5星：<a style={{color: color['color5']}}>{avgFive}</a> 抽</strong>
                </div>
            </div>
            <sl-details summary={'6星历史记录'} open style={{marginTop: 10}}>
                <div style={{maxHeight: 300, overflow: 'auto'}}>
                    {sixItem.map((item, i) => <ListItem data={item} key={i} color={color['color6']}/>)}
                </div>
            </sl-details>
            <sl-details summary={'5星历史记录'} style={{marginTop: 10}}>
                <div style={{maxHeight: 300, overflow: 'auto'}}>
                    {fiveItem.map((item, i) => <ListItem data={item} key={i} color={color['color5']}/>)}
                </div>
            </sl-details>
        </div>
    </div>
}
const DataGrid = ({res, color}) => {
    const {data, uid, nickName} = res;
    return <div key={uid}>
        <div className={'dataGrid clean-float pt10'}>
            <div className="title">UID: {uid}</div>
            <div className="title">{nickName}</div>
            {data.map((item, i) => <GridItem key={i} color={color} item={item}/>)}
        </div>
        <div className={'avatar-me'} onClick={() => window.open('https://github.com/lie5860/hypergryph-gacha')}>
            <sl-avatar
                image="https://avatars.githubusercontent.com/u/30894657?v=4"
                label="Avatar of a gray tabby kitten looking down"
            />
            本站由FC与WebComponent驱动
        </div>
    </div>
}

export default function Home() {
    const [token, setToken] = React.useState('')
    const [res, setRes] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [darkMode, setDarkMode] = React.useState(false)
    const [color, setColor] = React.useState({})
    const ref = React.useRef()
    React.useEffect(() => {
        // 绑定媒体查询变更时间
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', sql => {
            setDarkMode(sql.matches)
        });
        //初始化业务数据
        const token = localStorage.getItem('token');
        token && setToken(token)
        const uid = localStorage.getItem("lastUid");
        uid && setRes(JSON.parse(localStorage.getItem("dealData" + uid) || "{}"))
        ref.current.addEventListener('sl-input', (e) => {
            setToken(e.target.value)
        });
    }, [])
    React.useEffect(() => {
        // 初始化颜色
        const obj = {}
        const dict = {
            '--three-color': 'color3',
            '--four-color': 'color4',
            '--five-color': 'color5',
            '--six-color': 'color6',
            '--tip': 'tip',
            '--black': 'black',
            '--white': 'white',
        }
        const style = getComputedStyle(document.documentElement);
        Object.keys(dict).forEach(k => {
            obj[dict[k]] = style.getPropertyValue(k)?.trim()
        })
        setColor(obj)
    }, [darkMode])
    const clear = () => {
        localStorage.setItem("lastUid", "");
        setRes(null)
    }
    const init = (e) => {
        e.preventDefault();
        localStorage.setItem('token', token)
        let dealValue = token;
        try {
            dealValue = /"token":"(.*?)"/.exec(dealValue)[1]
            // dealValue = JSON.parse(token).data.token;
        } catch (e) {
        }
        setLoading(true)
        const url = `https://1683720436570405.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/hypergryph.LATEST/hypergryph_test/?token=${encodeURIComponent(
            dealValue
        )}`;
        axios
            .get(url, {responseType: "json"})
            .then(function (response) {
                const {uid, msg, data, nickName} = response.data;
                if (msg) {
                    alert(msg);
                    clear();
                } else {
                    localStorage.setItem("lastUid", uid);
                    localStorage.setItem(
                        "dealData" + uid,
                        JSON.stringify({data, uid, nickName})
                    );
                    setRes(response.data)
                }
            })
            .catch(function (error) {
                if (error.message === 'Network Error') {
                    alert('请连接网络后重试。')
                } else {
                    clear();
                }
            }).finally(() => {
            setLoading(false)
        });
        return true
    }
    return (
        <div className={'main-container clean-float'}>
            <sl-alert variant="primary" open>
                请首先在 <a href="https://ak.hypergryph.com/user">官网</a> 登录，随后访问 <a
                href="https://as.hypergryph.com/user/info/v1/token_by_cookie">此处</a> 复制全部内容（如了解JSON也可仅复制data中的token），然后在此填入。（请使用同一浏览器
            </sl-alert>
            <br/>
            <form onSubmit={init}>
                <div className={'token'}>
                    <sl-input
                        required
                        clearable
                        ref={ref}
                        value={token}
                        name={'token'}
                        placeholder="请粘贴token"
                        sl-input={e => setToken(e.target.value)}
                    />
                </div>
                <sl-button variant="primary" type="submit" style={{width: 84}}>生成</sl-button>
            </form>
            {loading && <>
                <div className={'spinner-bg'}/>
                <div className={'spinner-icon'}>
                    <sl-spinner style={{fontSize: 70, '--track-width': '10px'}}/>
                </div>
            </>}
            {!loading && res && <DataGrid res={res} color={color}/>}
        </div>
    )
}
