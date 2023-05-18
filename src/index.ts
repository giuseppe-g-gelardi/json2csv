import CsvConverter from "./Converter";
// import { Data } from './data.json' 

const converter = new CsvConverter([ /* Data */ ])
converter.toCsv('output.csv')
