import * as d3 from "d3";
export async function read_data(path) {
    let csv = await d3.csv(path);
    return csv
}
