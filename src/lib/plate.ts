export type PlateValue = { region: string; classNum: string; kana: string; serial: string }

export const EMPTY_PLATE: PlateValue = { region: '', classNum: '', kana: '', serial: '' }

export function plateQuery(value: PlateValue): string {
  return [value.region, value.classNum, value.kana, value.serial]
    .map((v) => v.trim())
    .join(' ')
    .trim()
}
