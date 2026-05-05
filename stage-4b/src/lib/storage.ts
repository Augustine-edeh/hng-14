import { StoredSession } from "./types";

const DB_NAME = "whisperbox-client";
const STORE_NAME = "session";
const SESSION_KEY = "active-session";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDatabase();

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = callback(transaction.objectStore(STORE_NAME));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

export function saveSession(session: StoredSession) {
  return withStore("readwrite", (store) => store.put(session, SESSION_KEY));
}

export function loadSession() {
  return withStore<StoredSession | undefined>("readonly", (store) =>
    store.get(SESSION_KEY),
  );
}

export function clearSession() {
  return withStore("readwrite", (store) => store.delete(SESSION_KEY));
}
