const groupByHour = reservations => {
    const grouped = new Map();
  
    reservations.forEach(reservation => {
        const reservationHour = reservation.hour;
    
        if (!grouped.has(reservationHour)) {
            grouped.set(reservationHour, []);
        }
    
        grouped.get(reservationHour).push(reservation);
    });
  
    const result = Array.from(grouped).map(([reservationHour, reservations]) => {
        return {
            hour: reservationHour,
            spacesAvailable: reservations.length
        };
    });
    
    return result;
}

module.exports = {
    groupByHour
}