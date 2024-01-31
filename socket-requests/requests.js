module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('createdReservation', (_) => {
            io.emit('createdReservationInUserView', _);
        });
    });
}