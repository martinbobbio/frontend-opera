const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

exports.updateNames = functions.firestore.document('users/{uid}').onUpdate(async (change, context) => {
    const current = change.after.data()
    const last = change.before.data()

    if(current.firstname !== last.firstname || current.lastname !== last.lastname){
        let batch = db.batch()

        try{
            let result = await db.collection('users').doc(context.params.uid).collection('reservations').get()
            result.forEach(doc => {
                let reservation = doc.data()
                batch.update(db.collection('shows').doc(reservation.presentation.show.sid).collection('presentations').doc(reservation.presentation.pid)
                .collection('reservations').doc(reservation.rid), { 'user.firstname': current.firstname, 'user.lastname': current.lastname })
            })
            return batch.commit()
        }catch(error){
            console.log(error)
        }
    }
    return null
})