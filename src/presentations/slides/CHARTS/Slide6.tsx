import { getFields } from "../../slideHelper";
import styles from './chart.module.css';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from "react-chartjs-2";


ChartJS.register(ChartDataLabels);

export const Slide6 = ({ slide }: any) => {
    const f = getFields(slide.content);
    const chartData = f.chart?.value;

    const data = {
        labels: chartData?.data.map((item: any) => item.label) || [],
        datasets: [
            {
                label: chartData?.title,
                data: chartData?.data.map((item: any) => item.value) || [],
                borderWidth: 0,
                radius: '85%',
                backgroundColor: [
                    '#FFDD2D',
                    '#333333',
                    '#428BF9',
                    '#575B64',
                    '#787D86',
                    '#',
                ]
            },
        ],
    }

    const total = chartData?.data?.reduce((sum: number, item: any) => sum + item.value, 0) || 0;
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        events: [] as any,
        hover: { mode: null as any },
        animation: {
        duration: 0,
        },
        plugins: {
            title:{
                display: true,
                text: chartData?.title,
                color: '#ffffff',
                font: {
                    family: 'Tinkoff Sans',
                    size: 18,
                    weight: 'bold'
                },
                padding: {top: 64}
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    textAlign: 'left',
                    usePointStyle: true,
                    pointStyle: 'rect',
                    color: '#ffffff',
                    font: {
                        family: 'Tinkoff Sans',
                        size: 14
                    }
                }
            },
            datalabels: {
                formatter: (value: number) => {
                    const percent = ((value / total) * 100).toFixed();
                    return percent + '%';
                 },
                 color: '#ffffff',
                 font: {
                    family: 'Tinkoff Sans',
                    size: 18,
                    weight: 'bold'
                 },
                 align: 'center',
            }
        }
    }


    return (
        <div className={styles.slide}>
            <div className={styles.textContainer}>
                <h1>{f.title?.value}</h1>
                <p>{f.text?.value}</p>
            </div>
            <div className={styles.chartContainer}>
                <Pie data={data} options={options}/>
            </div>
            {slide.isNeedPageNumber && (
                <div className={styles.pageNumber}>{slide.orderNumber}</div>
            )}
        </div>
    );
};