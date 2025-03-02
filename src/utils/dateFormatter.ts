
const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthNamesLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

export const formatDate = (isoDate: string, format: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
    const monthShort = monthNamesShort[monthIndex];
    const monthLong = monthNamesLong[monthIndex];

    switch (format) {
        case 'DD MMM YYYY':
            return `${dayWithSuffix} ${monthShort} ${year}`;
        case 'DD MMMM YYYY':
            return `${dayWithSuffix} ${monthLong} ${year}`;
        case 'DD MMM':
            return `${dayWithSuffix} ${monthShort}`;
        default:
            return isoDate;
    }
};
