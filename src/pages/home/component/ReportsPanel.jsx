import {Segment} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Sector, Tooltip, XAxis, YAxis} from "recharts";
import React, {useState} from "react";

const ReportsPanel = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (data, index) => {
        setActiveIndex(index);
    };
    const data = [
        {name: 'dev', value: 400},
        {name: 'demo', value: 300},
        {name: 'staging', value: 300},
        {name: 'prod', value: 200},
    ];


    const formTypes = [
        {
            name: 'dev', wizard: 10, form: 10
        },
        {
            name: 'demo', wizard: 110, form: 10
        },
        {
            name: 'staging', wizard: 140, form: 10
        },
        {
            name: 'prod', wizard: 10, form: 100
        },

    ];

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
                      fill="#333">{`${value} forms`}</text>
            </g>
        );
    };

    return  <Segment.Group horizontal basic>
        <Segment basic>
            <PieChart width={500} height={400}>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx={200}
                    cy={200}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                />
            </PieChart>
        </Segment>
        <Segment basic>
            <BarChart
                width={500}
                height={400}
                data={formTypes}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="wizard" stackId="a" fill="#8884d8"/>
                <Bar dataKey="form" stackId="a" fill="#82ca9d"/>
            </BarChart>
        </Segment>
    </Segment.Group>
}

export default ReportsPanel;
