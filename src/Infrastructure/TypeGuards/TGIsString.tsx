export const TGIsString = (arg:unknown): string  => {
    return typeof arg === "string" ? arg : ""
}