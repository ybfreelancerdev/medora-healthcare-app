import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firebaseErrorHandler from '../utils/firebaseErrorHandler';
import _firebaseDb from '../constants/firebaseDb';

class FirebaseService {
  // INSERT DOCUMENT
  async insert(
    collectionName: string,
    data: any,
    documentId?: string,
  ) {
    try {
      if (documentId) {
        await firestore()
          .collection(collectionName)
          .doc(documentId)
          .set({
            ...data,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

        return {
          success: true,
          id: documentId,
        };
      }

      const response = await firestore()
        .collection(collectionName)
        .add({
          ...data,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
        id: response.id,
      };
    } catch (error: any) {
      console.log('Insert Error:', error);

      return {
        success: false,
        message: firebaseErrorHandler(error),
      };
    }
  }

  // UPDATE DOCUMENT
  async update(
    collectionName: string,
    documentId: string,
    data: any,
  ) {
    try {
      await firestore()
        .collection(collectionName)
        .doc(documentId)
        .update({
          ...data,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return {
        success: true,
      };
    } catch (error: any) {
      console.log('Update Error:', error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  // DELETE DOCUMENT
  async delete(collectionName: string, documentId: string) {
    try {
      await firestore()
        .collection(collectionName)
        .doc(documentId)
        .delete();

      return {
        success: true,
      };
    } catch (error: any) {
      console.log('Delete Error:', error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET SINGLE DOCUMENT
  async get(collectionName: string, documentId: string) {
    try {
      const response = await firestore()
        .collection(collectionName)
        .doc(documentId)
        .get();

      if (!response.exists) {
        return {
          success: false,
          message: 'Record not found',
        };
      }

      return {
        success: true,
        data: {
          id: response.id,
          ...response.data(),
        },
      };
    } catch (error: any) {
      console.log('Get Error:', error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET LIST DOCUMENTS
  async getList(collectionName: string) {
    try {
      const response = await firestore()
        .collection(collectionName)
        .orderBy('createdAt', 'desc')
        .get();

      const list = response.docs.map(item => ({
        id: item.id,
        ...item.data(),
      }));

      return {
        success: true,
        data: list,
      };
    } catch (error: any) {
      console.log('Get List Error:', error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET COLLECTION WITHOUT ORDER 
  async getCollection(collectionName: string, limitCount?: number) {
    try {
      let query: any = firestore().collection(collectionName);

      if (limitCount) {
        query = query.limit(limitCount);
      }

      const response = await query.get();
      const list = response.docs.map((item: any) => ({ id: item.id, ...item.data(), }),);

      return {
        success: true,
        data: list,
      };
    }
    catch (error: any) {
      console.log('Get Collection Error:', error,);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getDoctors(collectionName: string, city: string, limitCount?: number) {
    try {
      let query: FirebaseFirestoreTypes.Query = firestore().collection(collectionName);

      // CITY FILTER
      if (city && city.trim() !== '') {
        query = query.where(
          'city',
          '==',
          city,
        );
      }
      const response = await query.get();

      let doctors = response.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🔥 sort by rating (highest first)
      doctors.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

      // 🔥 if limit passed
      if (limitCount) {
        doctors = doctors.slice(0, limitCount);
      }

      return {
        success: true,
        data: doctors,
      };
    } catch (error: any) {
      console.log("Get Doctors Error:", error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getDoctorAvailability(collectionName: string, doctorId: string) {
    try {
      const doc = await firestore()
        .collection(collectionName)
        .doc(doctorId)
        .get();

      if (!doc.exists) {
        return {
          success: false,
          message: "Availability not found",
        };
      }

      const data = doc.data() as any;

      const filtered = (data.availability || [])
        // .filter(
        //   (item: any) =>
        //     item.enabled === true
        // )
        .map((item: any) => ({
          day: item.day,
          time: `${item.startTime} - ${item.endTime}`,
          enabled: item.enabled
        }));

      return {
        success: true,
        data: filtered,
      };
    } catch (error: any) {
      console.log("Availability Error:", error);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  // GET APPOINTMENTS BY STATUS
  async getAppointmentsByStatus(collectionName: string, 
    status: string, 
    userId?: string,
    role?: 'doctor' | 'patient', 
    limitCount?: number, 
    selectedDate?:Date) {
    try {
      let query: FirebaseFirestoreTypes.Query = firestore().collection(collectionName);

      if (status && status !== '') {
        query = query.where(
          'status',
          '==',
          status.toLowerCase(),
        );
      }
      // User Filter
      if (userId && role) {

        query = query.where(
          role === 'doctor'
            ? 'doctorId'
            : 'patientId',
          '==',
          userId,
        );
      }

      // DATE FILTER
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const nextDay = new Date(startOfDay);
        nextDay.setDate(nextDay.getDate() + 1);

        query = query.where('appointmentDate', '>=', startOfDay).where('appointmentDate', '<=', nextDay);
      }

      // ORDER BY
      query = query.orderBy(
        'appointmentDate',
        'desc',
      );

      // LIMIT
      if (
        limitCount &&
        limitCount > 0
      ) {

        query = query.limit(
          limitCount,
        );
      }

      const appointmentsSnapshot = await query.get();
      
      const appointments = appointmentsSnapshot.docs.map(
        item => ({
          id: item.id,
          ...item.data(),
        }),
      );
      
      // EMPTY CHECK
      if (appointments.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // GET UNIQUE USERS
      const doctorIds = appointments
        .map((item: any) => item.doctorId)
        .filter(Boolean);

      const patientIds = appointments
        .map((item: any) => item.patientId)
        .filter(Boolean);

      // FETCH DOCTORS
      const doctorsPromises =
        doctorIds.map(
          async (id: string) => {

            const doc =
              await firestore()
                .collection(
                  _firebaseDb.doctors,
                )
                .doc(id)
                .get();

            return {
              id: doc.id,
              ...doc.data(),
            };
          },
        );

      // FETCH PATIENTS
      const patientsPromises =
        patientIds.map(
          async (id: string) => {

            const doc =
              await firestore()
                .collection(
                  _firebaseDb.patients,
                )
                .doc(id)
                .get();

            return {
              id: doc.id,
              ...doc.data(),
            };
          },
        );

      // PARALLEL FETCH
      const doctors =
        await Promise.all(
          doctorsPromises,
        );

      const patients =
        await Promise.all(
          patientsPromises,
        );

      // MAPS
      const doctorsMap: any = {};
      const patientsMap: any = {};

      doctors.forEach(
        (doctor: any) => {

          doctorsMap[
            doctor.id
          ] = doctor;
        },
      );

      patients.forEach(
        (patient: any) => {

          patientsMap[
            patient.id
          ] = patient;
        },
      );

      // Get transactions
      const transactionPromises = appointments.map(
        async (appointment) => {
          const snapshot =
            await firestore()
              .collection(
                _firebaseDb.transactions,
              )
              .where(
                'appointmentId',
                '==',
                appointment.id,
              )
              .limit(1)
              .get();

          if (
              snapshot.empty
            ) {
              return null;
            }

            const transactionDoc = snapshot.docs[0];

            return {
              appointmentId:
                appointment.id,
                transaction: {
                  id:
                    transactionDoc.id,
                  ...transactionDoc.data(),
                },
            };
        },
      );

      const transactionResults = await Promise.all(transactionPromises);
      const transactionsMap: any = {};

      transactionResults.forEach(
        (item: any) => {
          if (item) {
            transactionsMap[
              item.appointmentId
            ] = item.transaction;
          }
        },
      );

      const prescriptionPromises = appointments.map(
          async (appointment: any) => {
            const prescriptionSnapshot =
              await firestore()
                .collection(
                  _firebaseDb.prescriptions,
                )
                .where(
                  'appointmentId',
                  '==',
                  appointment.id,
                )
                .limit(1)
                .get();

            if (
              prescriptionSnapshot.empty
            ) {
              return null;
            }

            const prescriptionDoc = prescriptionSnapshot.docs[0];

            return {
              appointmentId:
                appointment.id,
                prescription: {
                  id:
                    prescriptionDoc.id,
                  ...prescriptionDoc.data(),
                },
            };
          },
        );

      const prescriptions = await Promise.all(prescriptionPromises);
      const prescriptionMap: any = {};

      prescriptions.forEach(
        (item: any) => {
          if (item) {
            prescriptionMap[
              item.appointmentId
            ] = item.prescription;
          }
        },
      );

      // MERGE DATA
      const finalData =
        appointments.map(
          (item: any) => ({
            ...item,
            doctor: doctorsMap[item.doctorId] || null,
            patient: patientsMap[item.patientId] || null,
            prescription: prescriptionMap[item.id] || null,
            transactions: transactionsMap[item.id] || null,
          }),
        );

      return {
        success: true,
        data: finalData,
      };

    } catch (error: any) {
      console.log(
        'Get Appointments Error:',
        error,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getDoctorDashboardStats(doctorId: string) {
    try {

      // APPOINTMENTS
      const appointmentsSnapshot = await firestore()
          .collection(
            _firebaseDb.appointments,
          )
          .where(
            'doctorId',
            '==',
            doctorId,
          )
          .get();

      const appointments = appointmentsSnapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data(),
          }),
        );

      // TOTAL APPOINTMENTS
      const appointmentCount = appointments.length;

      // UNIQUE PATIENTS
      const uniquePatients =
        [
          ...new Set(
            appointments
              .map(
                (item: any) =>
                  item.patientId,
              )
              .filter(Boolean),
          ),
        ];

      const patientCount = uniquePatients.length;

      // COMPLETED APPOINTMENTS
      const completedAppointments = appointments.filter(
          (item: any) =>
            item.status ===
            'completed',
        );

      // TOTAL EARNINGS
      const appointmentIds =
        completedAppointments.map(
          (item: any) => item.id,
        );

      let earnings = 0;
      if (appointmentIds.length > 0) {
        const transactionPromises =
          appointmentIds.map(
            async (
              appointmentId: string,
            ) => {

              const snapshot =
                await firestore()
                  .collection(
                    _firebaseDb.transactions,
                  )
                  .where(
                    'appointmentId',
                    '==',
                    appointmentId,
                  )
                  .get();

              return snapshot.docs.map(
                doc => ({
                  id: doc.id,
                  ...doc.data(),
                }),
              );
            },
          );

        const transactionResults =
          await Promise.all(
            transactionPromises,
          );

        const transactions =
          transactionResults.flat();

        earnings =
          transactions.reduce(
            (
              total: number,
              transaction: any,
            ) =>
              total +
              Number(
                transaction.doctorFee ||
                0,
              ),
            0,
          );
      }
      // const earnings = completedAppointments.reduce(
      //     (
      //       total: number,
      //       item: any,
      //     ) =>
      //       total +
      //       Number(
      //         item.fees || 0,
      //       ),
      //     0,
      //   );

      return {
        success: true,
        data: {
          patientCount,
          appointmentCount,
          earnings,
        },
      };

    } catch (error: any) {

      console.log(
        'Dashboard Stats Error:',
        error,
      );

      return {
        success: false,
        message:
          error.message,
      };
    }
  }

  async updateOnlineStatus(collectionName: string, userId: string, isOnline: boolean) {
    try {
      await firestore()
        .collection(collectionName)
        .doc(userId)
        .update({
          isOnline,
          lastSeen:
            firestore.FieldValue.serverTimestamp(),
        });

    } catch (error) {
      console.log(
        'Update Online Error:',
        error,
      );
    }
  }

  async getNotifications(userId: string) {
    try {
      const snapshot = await firestore()
        .collection(_firebaseDb.notifications)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const notifications = snapshot.docs.map(
        doc => ({
          id: doc.id,
          ...doc.data(),
        }),
      );

      return {
        success: true,
        data: notifications,
      };

    } catch (error: any) {

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getPrescriptionByAppointmentId(appointmentId: string) {
    try {
      const snapshot = await firestore()
        .collection(
          _firebaseDb.prescriptions,
        )
        .where(
          'appointmentId',
          '==',
          appointmentId,
        )
        .limit(1)
        .get();

      if (snapshot.empty) {
        return {
          success: true,
          data: null,
        };
      }

      const doc = snapshot.docs[0];

      return {
        success: true,
        data: {
          id: doc.id,
          ...doc.data(),
        },
      };

    } catch (error: any) {

      console.log(
        'Get Prescription Error:',
        error,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getPaymentHistory(userId: string, role: string, limitCount?: number,) {
    try {
      // Get appointments
      let query = await firestore().collection(_firebaseDb.appointments)
        .where(
          role === 'doctor'
            ? 'doctorId'
            : 'patientId',
          '==',
          userId,
        );

      if (limitCount && limitCount > 0) {
        query = query.limit(limitCount);
      }

      const appointmentsSnapshot = await query.get();

      const appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ---------------------------
      // ALL APPOINTMENTS
      // (FOR TOTAL AMOUNT)
      // ---------------------------
      const allAppointmentsSnapshot =
        await firestore()
          .collection(
            _firebaseDb.appointments,
          )
          .where(
            role === 'doctor'
              ? 'doctorId'
              : 'patientId',
            '==',
            userId,
          )
          .get();

      const allAppointments =
        allAppointmentsSnapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data(),
          }),
        );

      if (allAppointments.length === 0) {
        return {
          success: true,
          data: [],
          totalAmount: 0,
        };
      }

      // ---------------------------
      // DOCTOR / PATIENT DETAILS
      // ---------------------------
      const doctorIds = [
        ...new Set(
          allAppointments
            .map(
              (item: any) =>
                item.doctorId,
            )
            .filter(Boolean),
        ),
      ];

      const patientIds = [
        ...new Set(
          allAppointments
            .map(
              (item: any) =>
                item.patientId,
            )
            .filter(Boolean),
        ),
      ];

      const doctors =
        await Promise.all(
          doctorIds.map(
            async (
              id: string,
            ) => {

              const doc =
                await firestore()
                  .collection(
                    _firebaseDb.doctors,
                  )
                  .doc(id)
                  .get();

              return {
                id: doc.id,
                ...doc.data(),
              };
            },
          ),
        );

      const patients =
        await Promise.all(
          patientIds.map(
            async (
              id: string,
            ) => {

              const doc =
                await firestore()
                  .collection(
                    _firebaseDb.patients,
                  )
                  .doc(id)
                  .get();

              return {
                id: doc.id,
                ...doc.data(),
              };
            },
          ),
        );

      const doctorsMap: any = {};
      const patientsMap: any = {};

      doctors.forEach(
        (doctor: any) => {
          doctorsMap[
            doctor.id
          ] = doctor;
        },
      );

      patients.forEach(
        (patient: any) => {
          patientsMap[
            patient.id
          ] = patient;
        },
      );

      const appointmentsMap: any =
        {};

      allAppointments.forEach(
        (item: any) => {

          appointmentsMap[
            item.id
          ] = {
            ...item,

            doctor:
              doctorsMap[
              item.doctorId
              ] || null,

            patient:
              patientsMap[
              item.patientId
              ] || null,
          };
        },
      );

      // ---------------------------
      // LIMITED TRANSACTIONS
      // ---------------------------
      const appointmentIds =
        appointments.map(
          (item: any) =>
            item.id,
        );

      const transactionPromises =
        appointmentIds.map(
          async (
            appointmentId: string,
          ) => {

            const snapshot =
              await firestore()
                .collection(
                  _firebaseDb.transactions,
                )
                .where(
                  'appointmentId',
                  '==',
                  appointmentId,
                )
                .get();

            return snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data(),
              }),
            );
          },
        );

      const transactionResults =
        await Promise.all(
          transactionPromises,
        );

      const transactions =
        transactionResults.flat();

      const finalData =
        transactions.map(
          (
            transaction: any,
          ) => ({
            ...transaction,

            appointment:
              appointmentsMap[
              transaction
                .appointmentId
              ] || null,
          }),
        );

      finalData.sort(
        (
          a: any,
          b: any,
        ) =>
          (b.createdAt
            ?.seconds || 0) -
          (a.createdAt
            ?.seconds || 0),
      );

      // ---------------------------
      // TOTAL AMOUNT
      // ALL TRANSACTIONS
      // ---------------------------
      const allAppointmentIds =
        allAppointments.map(
          (item: any) =>
            item.id,
        );

      const allTransactionPromises =
        allAppointmentIds.map(
          async (
            appointmentId: string,
          ) => {

            const snapshot =
              await firestore()
                .collection(
                  _firebaseDb.transactions,
                )
                .where(
                  'appointmentId',
                  '==',
                  appointmentId,
                )
                .get();

            return snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data(),
              }),
            );
          },
        );

      const allTransactions =
        (
          await Promise.all(
            allTransactionPromises,
          )
        ).flat();

      const totalAmount = allTransactions.reduce(
          (sum: number, item: any) => {
            if (item.status !== 'paid') {
              return sum;
            }

            return (
              sum +
              Number(
                item.doctorFee || 0,
              )
            );
          },
          0,
        );

      return {
        success: true,

        // Limited list
        data: finalData,

        // All records total
        totalAmount,

        totalTransactions:
          allTransactions.length,
      };

    } catch (error: any) {
      console.log(
        'Payment History Error:',
        error,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getDoctorReviews(doctorId: string) {
    try {
      const snapshot = await firestore()
        .collection(_firebaseDb.reviews)
        .where('doctorId', '==', doctorId)
        .orderBy('createdAt', 'desc')
        //.limit(15)
        .get();

      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!reviews.length) {
        return {
          success: true,
          data: [],
        };
      }

      // Get Patient Details
      const patientIds = reviews.map(
        (item: any) => item.patientId,
      );

      const patientPromises =
        patientIds.map(async (id: string) => {
          const patientDoc =
            await firestore()
              .collection(_firebaseDb.patients)
              .doc(id)
              .get();

          return {
            id: patientDoc.id,
            ...patientDoc.data(),
          };
        });

      const patients =
        await Promise.all(patientPromises);

      const patientsMap: any = {};

      patients.forEach((patient: any) => {
        patientsMap[patient.id] = patient;
      });

      const finalData =
        reviews.map((review: any) => ({
          ...review,
          patient:
            patientsMap[review.patientId] || null,
        }));

      return {
        success: true,
        data: finalData,
      };

    } catch (error: any) {
      console.log(
        'Get Reviews Error:',
        error,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getPatientsByDoctorId(doctorId: string) {
    try {

      // Get appointments
      const appointmentsSnapshot =
        await firestore()
          .collection(
            _firebaseDb.appointments,
          )
          .where(
            'doctorId',
            '==',
            doctorId,
          )
          .get();

      const appointments =
        appointmentsSnapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data(),
          }),
        );

      if (
        appointments.length === 0
      ) {
        return {
          success: true,
          data: [],
        };
      }

      // Unique patient ids
      const patientIds =
        [
          ...new Set(
            appointments.map(
              (item: any) =>
                item.patientId,
            ),
          ),
        ];

      // Get patients
      const patientPromises =
        patientIds.map(
          async (
            patientId: string,
          ) => {

            const patientDoc =
              await firestore()
                .collection(
                  _firebaseDb.patients,
                )
                .doc(patientId)
                .get();

            return {
              id: patientDoc.id,
              ...patientDoc.data(),
            };
          },
        );

      const patients =
        await Promise.all(
          patientPromises,
        );

      return {
        success: true,
        data: patients,
      };

    } catch (error: any) {

      console.log(
        'Get Patients Error:',
        error,
      );

      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getDoctorAllStats(doctorId: string) {
    try {
      const appointmentsSnapshot = await firestore().collection(_firebaseDb.appointments)
          .where(
            'doctorId',
            '==',
            doctorId,
          )
          .where(
            'status',
            '==',
            'completed',
          )
          .get();

      const appointments =
        appointmentsSnapshot.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data(),
          }),
        );

      if (
        appointments.length === 0
      ) {
        return {
          success: true,
          data: {
            totalAmount: 0,
            currentMonthAmount: 0,
            currentWeekAmount: 0,
            totalCompletedAppointments: 0,
          },
        };
      }

      const appointmentIds =
        appointments.map(
          (item: any) =>
            item.id,
        );

      const transactionPromises =
        appointmentIds.map(
          async (
            appointmentId: string,
          ) => {

            const snapshot =
              await firestore()
                .collection(
                  _firebaseDb.transactions,
                )
                .where(
                  'appointmentId',
                  '==',
                  appointmentId,
                )
                .get();

            return snapshot.docs.map(
              doc => ({
                id: doc.id,
                ...doc.data(),
              }),
            );
          },
        );

      const transactionResults =
        await Promise.all(
          transactionPromises,
        );

      const transactions =
        transactionResults.flat();

      const now = new Date();

      // Current Month Start
      const monthStart =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
        );

      // Current Week Start (Monday)
      const weekStart =
        new Date(now);

      const day =
        weekStart.getDay();

      const diff =
        day === 0
          ? 6
          : day - 1;

      weekStart.setDate(
        weekStart.getDate() -
        diff,
      );

      weekStart.setHours(
        0,
        0,
        0,
        0,
      );

      let totalAmount = 0;
      let currentMonthAmount = 0;
      let currentWeekAmount = 0;

      transactions.forEach(
        (transaction: any) => {

          const amount =
            Number(
              transaction.doctorFee || 0,
            );

          totalAmount += amount;

          const createdAt =
            transaction.createdAt
              ?.toDate?.();

          if (
            !createdAt
          ) {
            return;
          }

          // Current Month
          if (
            createdAt >=
            monthStart
          ) {
            currentMonthAmount +=
              amount;
          }

          // Current Week
          if (
            createdAt >=
            weekStart
          ) {
            currentWeekAmount +=
              amount;
          }
        },
      );

      return {
        success: true,
        data: {
          totalAmount,
          currentMonthAmount,
          currentWeekAmount,

          totalCompletedAppointments:
            appointments.length,
        },
      };

    } catch (error: any) {

      console.log(
        'Doctor Dashboard Error:',
        error,
      );

      return {
        success: false,
        message:
          error.message,
      };
    }
  }
}

export default new FirebaseService();