module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('createdReservation', (arg) => {
            io.emit('updateReservationInUserView', arg);
        });

        socket.on('updatedReservation', (arg) => {
            io.emit('updatedReservationInAdminView', arg);
        });

        socket.on('deletedReservation', (arg) => {
            io.emit('updatedReservationInAdminView', arg);
        });

        socket.on('createdClassPackage', (arg) => {
            io.emit('createdClassPackageInUserView', arg);
        });

        socket.on('updatedClassPackage', (arg) => {
            io.emit('updatedClassPackageInAdminView', arg);
        });

        socket.on('deletedClassPackage', (arg) => {
            io.emit('updatedClassPackageInAdminView', arg);
        });

        socket.on('deletedReservationInUserView', (arg) => {
            io.emit('updateReservationInUserView', arg);
        });
    });
}