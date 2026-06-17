import firestore from '@react-native-firebase/firestore';
import _firebaseDb from '../constants/firebaseDb';

const categories = [
  {
    id: '1',
    title: 'Cardiologist',
    icon: 'heart-pulse',
  },

  {
    id: '2',
    title: 'Dentist',
    icon: 'tooth-outline',
  },

  {
    id: '3',
    title: 'Neurologist',
    icon: 'brain',
  },

  {
    id: '4',
    title: 'Pediatrician',
    icon: 'baby-face-outline',
  },

  {
    id: '5',
    title: 'Orthopedic',
    icon: 'bone',
  },

  {
    id: '6',
    title: 'Dermatologist',
    icon: 'hand-heart',
  },

  {
    id: '7',
    title: 'Psychiatrist',
    icon: 'meditation',
  },

  {
    id: '8',
    title: 'ENT Specialist',
    icon: 'ear-hearing',
  },

  {
    id: '9',
    title: 'Gynecologist',
    icon: 'human-pregnant',
  },

  {
    id: '10',
    title: 'Ophthalmologist',
    icon: 'eye-outline',
  },

  {
    id: '11',
    title: 'Urologist',
    icon: 'kidney',
  },

  {
    id: '12',
    title: 'Pulmonologist',
    icon: 'lungs',
  },

  {
    id: '13',
    title: 'General Physician',
    icon: 'stethoscope',
  },

  {
    id: '14',
    title: 'Nutritionist',
    icon: 'food-apple-outline',
  },

  {
    id: '15',
    title: 'Oncologist',
    icon: 'dna',
  },
];

export const uploadCategories =
  async () => {

    try {

      const batch =
        firestore().batch();

      categories.forEach(
        item => {

          const ref =
            firestore()
              .collection(
                _firebaseDb.categories,
              )
              .doc(item.id);

          batch.set(ref, item);
        },
      );

      await batch.commit();

      console.log(
        'Categories Uploaded Successfully',
      );

    } catch (error) {

      console.log(
        'Upload Categories Error:',
        error,
      );
    }
  };