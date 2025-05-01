import moment from 'moment';

export const getTimeLeft = (deadline) => {
    const now = moment();
    const end = moment(deadline);

    if (!end.isValid()) return "Không xác định";
    if (end.isBefore(now)) return "Đã hết hạn";

    const totalMinutes = end.diff(now, 'minutes');
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} ngày ${hours} giờ `;
};
