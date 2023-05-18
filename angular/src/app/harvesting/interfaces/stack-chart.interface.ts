export interface Datasets{
    type: string;
    label: string;
    backgroundColor: string;
    data: number[]
}
export interface ChartData {
    labels: string[],
    datasets: Datasets[]
}
