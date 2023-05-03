import {FirebaseApp, initializeApp} from 'firebase/app';
import {
  Firestore,
  getFirestore,
  onSnapshot,
  doc,
  increment,
  updateDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  Auth,
  User,
  signInAnonymously,
} from 'firebase/auth';
import {Analytics, getAnalytics} from 'firebase/analytics';
import {FirebaseEvent} from '@components/firestorefetch/events/firebaseevent';
import {TypeGuard} from '@abstract/typeguard';

/**
 * Data structure for properties needed for Firebase.
 */
export enum FETCH_PROPERTIES {
  PATH = 'downloads',
  PATH_SEGMENT = 'cr-downloads',
  LOCAL = 'Local',
  SERVER = 'Server',
}

/**
 * FirestoreFetch writes and reads the download counter from firebase
 * for the # of times the codebase has been downloaded.
 *
 * ! FirestoreFetch modularizes the firebase libraries and the component is
 * ! broken out as a chunk and loaded indepdently. Please view the main app
 * ! for how FirestoreFetch is loaded and webpack.config for how the splits
 * ! are determined.
 */
export class FirestoreFetch extends EventTarget {
  private app: FirebaseApp;
  private analytics: Analytics;
  private db: Firestore;
  private auth: Auth;
  private docRef: DocumentReference<DocumentData>;
  private userAuthenticated = false;
  private userId: string;

  /**
   * subclassing EventTarget. Sets up the Firebase Config with the required
   * apikey.
   *
   * ! FirebaseConfig should be updated to reflect your own firebase project
   * ! instance.
   */
  constructor() {
    super();

    const firebaseConfig = {
      apiKey: 'AIzaSyDQ7sbhwPjbVGIzC6gDcsihpWMjsECaPlk',
      authDomain: 'code-responsibly.firebaseapp.com',
      databaseURL: 'https://code-responsibly-default-rtdb.firebaseio.com',
      projectId: 'code-responsibly',
      storageBucket: 'code-responsibly.appspot.com',
      messagingSenderId: '776885952034',
      appId: '1:776885952034:web:1f5f604c15eddd1610f47b',
      measurementId: 'G-SZPH86Q47T',
    };

    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.db = getFirestore(this.app);
  }

  /**
   * Authenticates the app with an anonymouse user since we're only using
   * Firebase for a download counter.
   */
  public authenticate() {
    this.auth = getAuth(this.app);

    signInAnonymously(this.auth)
    .then(() => {
      // Signed in..
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw Error(
        'Code Responsibly Firebase Error:' + errorCode + ' - ' + errorMessage
      );
    });

    onAuthStateChanged(this.auth, (user: unknown) =>
      this.userAuthenticateHandler(TypeGuard.cast(user))
    );
  }

  /**
   * Retrieves the downloads from the firestore. If the record is successfully
   * fetched, dispatched event FirebaseEvent lets the main app know and sends
   * along the download value.
   */
  public getDownloads(): void {
    if (!this.userAuthenticated) {
      return;
    }

    try {
      onSnapshot(this.docRef, doc => {
        const source = doc.metadata.hasPendingWrites
          ? FETCH_PROPERTIES.LOCAL
          : FETCH_PROPERTIES.SERVER;

        const docData: DocumentData = TypeGuard.guardForNull(doc.data())!;

        this.dispatchEvent(
          new FirebaseEvent(FirebaseEvent.RECORD_FETCHED, {
            detail: {
              record: docData.counter,
            },
          })
        );
      });
    } catch (error) {
      throw 'Code Responsibly -> Could Not Fetch Download Counter.';
    }
  }

  /**
   * Writes the download counter, an increment of 1, since this is fired
   * on click. Dispatched event FirebaseEvent.RECORD_UPDATED notifies the main
   * app that the value has been updated.
   */
  public async codebaseDownloaded() {
    try {
      await updateDoc(this.docRef, {
        counter: increment(1),
      });

      this.dispatchEvent(new FirebaseEvent(FirebaseEvent.RECORD_UPDATED));
    } catch (error) {
      throw 'Code Responsibly -> Could Not write the counter to Firebase';
    }
  }

  /**
   * Handler that sets up the firebase document reference once the user
   * has successfully authenticated. Dispatched event
   * FirebaseEvent.Authenticated notifies the main app that authentication
   * was successful.
   * @param user The Firebase User object assigned for anonymouse users.
   */
  private userAuthenticateHandler(user: User): void {
    if (user) {
      this.userId = user.uid;
      this.userAuthenticated = true;

      this.docRef = doc(
        this.db,
        FETCH_PROPERTIES.PATH,
        FETCH_PROPERTIES.PATH_SEGMENT
      );

      this.dispatchEvent(new FirebaseEvent(FirebaseEvent.AUTHENTICATED));
    } else {
      this.userAuthenticated = false;
    }
  }
}
