import * as fs from 'fs';

interface FlattenedObject {
  [key: string]: string | number | boolean;
}

export default class CsvConverter {
  private flattenedObjects: FlattenedObject[] = [];

  constructor(private readonly objects: object[]) {}

  private flattenObject(obj: object, prefix = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        this.flattenObject(value, newKey);
      } else {
        this.flattenedObjects[this.flattenedObjects.length - 1][newKey] = value;
      }
    }
  }

  private flattenObjects(): void {
    for (const obj of this.objects) {
      this.flattenedObjects.push({});
      this.flattenObject(obj);
    }
  }

  public toCsv(filePath: string): void {
    this.flattenObjects();
    const headers = Array.from(new Set(this.flattenedObjects.flatMap(obj => Object.keys(obj))));
    const csv = [headers.join(',')];
    for (const obj of this.flattenedObjects) {
      const row = headers.map(header => obj[header] ?? '').join(',');
      csv.push(row);
    }
    fs.writeFileSync(filePath, csv.join('\n'));
  }
}
