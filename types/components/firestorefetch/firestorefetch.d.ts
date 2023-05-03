/**
 * Data structure for properties needed for Firebase.
 */
export declare enum FETCH_PROPERTIES {
    PATH = "downloads",
    PATH_SEGMENT = "cr-downloads",
    LOCAL = "Local",
    SERVER = "Server"
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
export declare class FirestoreFetch extends EventTarget {
    private app;
    private analytics;
    private db;
    private auth;
    private docRef;
    private userAuthenticated;
    private userId;
    /**
     * subclassing EventTarget. Sets up the Firebase Config with the required
     * apikey.
     *
     * ! FirebaseConfig should be updated to reflect your own firebase project
     * ! instance.
     */
    constructor();
    /**
     * Authenticates the app with an anonymouse user since we're only using
     * Firebase for a download counter.
     */
    authenticate(): void;
    /**
     * Retrieves the downloads from the firestore. If the record is successfully
     * fetched, dispatched event FirebaseEvent lets the main app know and sends
     * along the download value.
     */
    getDownloads(): void;
    /**
     * Writes the download counter, an increment of 1, since this is fired
     * on click. Dispatched event FirebaseEvent.RECORD_UPDATED notifies the main
     * app that the value has been updated.
     */
    codebaseDownloaded(): Promise<void>;
    /**
     * Handler that sets up the firebase document reference once the user
     * has successfully authenticated. Dispatched event
     * FirebaseEvent.Authenticated notifies the main app that authentication
     * was successful.
     * @param user The Firebase User object assigned for anonymouse users.
     */
    private userAuthenticateHandler;
}
