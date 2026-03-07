// functions
export function today_date() {
    return new Date().toISOString().slice(0,10)
}

export function format_date(date) {
    if (date instanceof Date) {
        return date.toISOString().slice(0, 10);
    }
    if (typeof date === "string") {
        return date.slice(0, 10);
    }
    return date;
}