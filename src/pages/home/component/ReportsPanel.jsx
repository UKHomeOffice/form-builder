import {Segment} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Sector, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";
import useReports from "../useReports";
import {EXECUTING} from "../../../core/api/actionTypes";

const ReportsPanel = () => {
    const {onPieEnter, reports} = useReports();


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
                      fill="#333">{`${value} ${value > 1 || value === 0 ? 'forms' : 'form'}`}</text>
            </g>
        );
    };


    return <Segment.Group horizontal>
        <Segment basic loading={reports.statusFormsPerEnvCount === EXECUTING}>
            <PieChart width={500} height={400}>
                <Pie
                    activeIndex={reports.activeIndex}
                    activeShape={renderActiveShape}
                    data={reports.formsPerEnvCount}
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
        <Segment basic loading={reports.statusTypeData === EXECUTING}>
            <BarChart
                width={500}
                height={400}
                data={reports.typeData}
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
