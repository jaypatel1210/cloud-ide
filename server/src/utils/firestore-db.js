import admin from 'firebase-admin';

const db = admin.firestore();

async function addRecord(collectionName, data, docId = null) {
  try {
    const docRef = docId
      ? db.collection(collectionName).doc(docId)
      : db.collection(collectionName).doc();

    await docRef.set(data);

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error adding or updating record:', error);
    throw error;
  }
}

async function readRecord(collectionName, docId) {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  } catch (error) {
    console.error('Error reading record:', error);
    throw error;
  }
}

async function updateRecord(collectionName, docId, data) {
  try {
    const docRef = db.collection(collectionName).doc(docId);

    await docRef.update(data);

    return docRef.id;
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
}

async function deleteRecord(collectionName, docId) {
  try {
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.delete();
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
}

const createCurriedQuery =
  collectionName =>
  (conditions = []) =>
  (orderByField = null) =>
  (orderDirection = 'asc') =>
  async (limit = 20) => {
    let documents = [];
    try {
      let query = db.collection(collectionName);

      // Apply conditions dynamically
      conditions.forEach(([field, operator, value]) => {
        query = query.where(field, operator, value);
      });

      if (orderByField) {
        query = query.orderBy(orderByField, orderDirection);
      }

      query = query.limit(limit);

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        return documents;
      }

      documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return documents;
    } catch (error) {
      console.error(`Error querying collection "${collectionName}":`, error);
      throw error;
    }
  };

export {
  addRecord,
  readRecord,
  updateRecord,
  deleteRecord,
  createCurriedQuery,
};
