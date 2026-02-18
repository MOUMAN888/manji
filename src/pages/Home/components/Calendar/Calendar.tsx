import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Calendar, ConfigProvider, Select, Row, Col, theme } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { getActiveNoteDays } from '../../../../api/noteApi';

// 设置 dayjs 语言
dayjs.locale('zh-cn');

const THEME_COLOR = '#668687';

//定义子组件接受的Props类型
interface CalendarComponentProps {
    userId: number; // 用户ID
    onDateSelect: (date: string) => void;
}

const CustomCalendar: React.FC<CalendarComponentProps> = ({  onDateSelect }) => {
    const { token } = theme.useToken();
    const [value, setValue] = useState<Dayjs>(dayjs());
    const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
    const handleSelect = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    onDateSelect(dateStr);
    };

    // 获取活跃笔记天数
    useEffect(() => {
        const fetchActiveDays = async () => {
            try {
                const userId = Number(5);
                const yearMonth = value.format('YYYY-MM');
                const days = await getActiveNoteDays({ userId, yearMonth });
                console.log('活跃笔记天数：', days);
                setActiveDays(new Set(days));
            } catch (error) {
                console.error('获取活跃笔记天数失败：', error);
            }
        };

        fetchActiveDays();
    }, [value]);

    // --- 自定义头部渲染 (完全重写) ---
    const headerRender: CalendarProps<Dayjs>['headerRender'] = ({ value, onChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        // 修复月份生成逻辑：直接生成静态的中文月份，避免 dayjs 动态计算时的引用问题
        for (let i = start; i < end; i++) {
            monthOptions.push({
                label: `${i + 1}月`,
                value: i,
            });
        }

        const year = value.year();
        const month = value.month();
        const yearOptions = [];
        for (let i = year - 10; i < year + 10; i += 1) {
            yearOptions.push({
                label: `${i}年`,
                value: i,
            });
        }

        return (
            <div style={{ padding: '8px 12px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                <Row justify="space-between" align="middle">
                    {/* 左侧：显示当前完整的 年-月 (可选，作为标题) */}
                    <Col>
                        <div style={{ fontWeight: 'bold', color: THEME_COLOR, fontSize: 16 }}>
                            {value.format('YYYY年 MM月')}
                        </div>
                    </Col>

                    <Col>
                        <Row gutter={4}>
                            <Col>
                                <Select
                                    size="small"
                                    bordered={false} // 关键：去除选择器边框
                                    className="clean-select"
                                    dropdownMatchSelectWidth={false}
                                    value={year}
                                    options={yearOptions}
                                    onChange={(newYear) => {
                                        const now = value.clone().year(newYear);
                                        onChange(now);
                                    }}
                                />
                            </Col>
                            <Col>
                                <Select
                                    size="small"
                                    bordered={false} // 关键：去除选择器边框
                                    className="clean-select"
                                    dropdownMatchSelectWidth={false}
                                    value={month}
                                    options={monthOptions}
                                    onChange={(newMonth) => {
                                        const now = value.clone().month(newMonth);
                                        onChange(now);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    };
    const dateCellRender = (value: Dayjs) => {
        const isActive = activeDays.has(value.format('YYYY-MM-DD'));
        return (
            <div style={{ position: 'relative', height: '100%' }}>

                {isActive && (
                    <div
                        className="dot"
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: THEME_COLOR,
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    />
                )}
            </div>
        );
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') {
            return dateCellRender(current);
        }
        return info.originNode;
    };


    const wrapperStyle: React.CSSProperties = {
        width: "100%",
        // borderRadius: token.borderRadiusLG,
        backgroundColor: '#fff',
        overflow: 'hidden',
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: THEME_COLOR,
                        colorText: '#333',
                        marginXS: 4,
                    },
                    components: {
                        Calendar: {
                            fullBg: '#fff',
                        }
                    }
                }}
            >
                <div style={wrapperStyle}>
                    <Calendar
                        className="compact-calendar"
                        fullscreen={false}
                        headerRender={headerRender}
                        cellRender={cellRender}
                        value={value}
                        onChange={setValue}
                        onSelect={(date) => {
                        handleSelect(date);
                        }}
                    />
                    
                </div>
            </ConfigProvider>
        </>
    );
};

export default CustomCalendar;