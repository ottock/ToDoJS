// functions
export default function today_date() {
    return new Date().toISOString().slice(0, 10);
}