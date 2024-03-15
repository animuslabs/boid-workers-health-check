export function toObject(data:Record<string, any>):Record<string, any> {
    return JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value // return everything else unchanged
    ))
  }