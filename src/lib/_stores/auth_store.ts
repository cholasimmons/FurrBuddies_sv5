import { ID, type Models, Permission, Role, Query, ImageGravity } from 'appwrite';
import { get, writable } from 'svelte/store';
import { sdk, server } from '../appwrite';
import type { Gender, IPet, Type } from '../_models/pet-model';
import type { Account } from '../_models/appwrite-model';
import type { IClinic } from '../_models/clinic-model';
import { removePrefix, getFirstName } from '../_utilities/split-names';
import type { IAd } from '../_models/ad-model';
import type { IMail } from '../_models/mail-model';

// PETS

const createPets = () => {
  const { subscribe, update, set } = writable({
    pets: [] as IPet[]
  });

  return {
    subscribe,
    fetch: async () => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID,'verified');
      if(!role)return;
  
      const response = await sdk.database.listDocuments(server.database, server.collection_pets, [
        Query.orderDesc("")
        ]
      );
      return set({ pets: response.documents as IPet[]});
    },
    viewPet: async (id: string) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID,'verified');
      if(!role)return;
  
      const pet = await sdk.database.getDocument(server.database, server.collection_pets, id);

      update((appstate) => ({
        pets: appstate.pets.map((p) => {
          if (p.$id === pet.$id){
            return { ...p, ...pet };
          }
          
          return p;
        })
      }))
      return pet;
    },
    addPet: async (name:string, breed: string, gender: Gender, type: Type, dob: string, color: string, specialRemarks: string) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID, 'verified');
      if(!role)return;

      const petDoc = await sdk.database.createDocument<IPet>(
        server.database,
        server.collection_pets,
        ID.unique(),
        {
          name,
          breed,
          gender,
          type,
          dob,          
          ownerID: [userID],
          color,
          specialRemarks
        },
        [
          Permission.read(role), Permission.update(role), Permission.delete(role),
        ]
      );
      // const petphoto = await sdk.storage.createFile(server.bucket_buddies,ID.unique(),photofile)
      // document.getElementById('uploader').files[0]

      return petDoc;
    },

    removePet: async (pet: IPet) => {
      await sdk.database.deleteDocument(server.database, server.collection_pets, pet.$id);
      
      update((appstate) => ({
        pets: appstate.pets.filter((t) => t.$id !== pet.$id),
      }));
    },
  
    updatePet: async (pet: IPet, body: {[key:string]:any}) => { // Partial<Pet>
      const userID = get(appstate).account?.$id;
      if(!userID) return;

      const role = Role.user(userID);
      if(!role) return;

      await sdk.database.updateDocument(
        server.database,
        server.collection_pets,
        pet.$id,
        body,
        [
          Permission.read(role), Permission.update(role), Permission.delete(role),
        ]
      );
      
      update((appstate) => {
        const updatedPets:any = appstate.pets.map((mapPet) => {
          if (mapPet.$id === pet.$id){
            return { ...mapPet, ...pet };
          }
          
          return updatedPets;
      });

      return { pets: updatedPets };
    });
    },
    init: async (pets: IPet[] = []) => {
      return set({ pets:[] });
    }
  };
};

// VETS

const createClinics = () => {
  const { subscribe, update, set } = writable<IClinic[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.collection_clinics);
      return set(response.documents);
    },
    addClinic: async (name: string, city: string) => {
      const userId = get(appstate).account!.$id;
      const role = Role.user(userId);
      
      const application = await sdk.database.createDocument<IClinic>(
        server.database,
        server.collection_clinics,
        ID.unique(),
        {
          name,
          city,
          userId
        },
        [
          Permission.read('any'),
          Permission.update(role),
          Permission.delete(role),
        ]
      );
      return update((n) => [application, ...n]);
    },

    removeClinic: async (clinic: IClinic) => {
      await sdk.database.deleteDocument(server.database, server.collection_clinics, clinic.$id);
      return update((n) => n.filter((t) => t.$id !== clinic.$id));
    },
    updateClinic: async (clinic: IClinic) => { // Partial<Clinic>
      const user = Role.user(get(appstate).account!.$id);
      await sdk.database.updateDocument(
        server.database,
        server.collection_clinics,
        clinic.$id,
        clinic,
        [
          Permission.read('any'),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => {
        const index = n.findIndex((c) => c.$id === clinic.$id);
        n[index] = {
          ...n[index],
          ...(<IClinic>clinic),
        };
        return n;
      });
    },
  };
};

// PET PHOTO STORAGE

const createPetPhoto = () => {
  const { subscribe, update, set } = writable({
    files: null as File[]|null,
    photos: null as URL|null
  });

  return {
    subscribe,
    fetch: async () => {
      const userId = get(appstate).account?.$id;
      if(!userId){console.warn('User not logged in');throw new Error("Cannot fetch photos. User not available");}

      const role = Role.user(userId, 'verified');
      if(!role){console.warn('User not verified');throw new Error("Cannot fetch photos. User not verified");}
  
      try {
        const response: any = await sdk.storage.listFiles(server.bucket_buddies);
        console.log('Bucket File: ', response);
        
        // set(response.files);
        update(petbucketstate => ({...petbucketstate, files: response.files}))
      } catch (error) {
        console.error('Failed to fetch pet photos:', error);
      }
    },
    addPetPhoto: async (file: File) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID);
      if(!role)return;

      try {
        const photoBucket = await sdk.storage.createFile(
          server.bucket_buddies,
          ID.unique(),
          file,
          [
            Permission.read(role),
            Permission.update(role),
            Permission.delete(role),
          ]
        );
        // update((petbucketstate) => ({...petbucketstate, files: [...photoBucket]}));
        return photoBucket;
      } catch (error) {
        console.error('Failed to add pet photo:', error);
        return null;
      }
    },
    getPreview: async (id: string, size:number = 256) => {
      const userID = get(appstate).account?.$id;
      if(!userID) return;

      const role = Role.user(userID);
      if(!role)return;

      try {
        const photoPreview = sdk.storage.getFilePreview(
          server.bucket_buddies,
          id, size, size, ImageGravity.Center, 75
        );
        console.log('Photo preview: ',photoPreview.toString());
        update(petbucketstate => ({...petbucketstate, photos: URL.parse(photoPreview)}));

        return photoPreview;
      } catch (error) {
        console.error('Failed to retrieve preview photo:', error);
      }
    },
    getFile: async (id: string) => {
      const userID = get(appstate).account!.$id;
      const role = Role.user(userID);
      if(!role)return;

      try {
        const photo = await sdk.storage.getFileView(
          server.bucket_buddies, id
        );
        // console.log('Bucket "getFile" response: ',photo);
        return photo;
      } catch (error) {
        console.error('Failed to retrieve preview photo:', error);
      }
    }
  }
}

// USER PHOTO STORAGE

const createUserPhoto = () => {
  const { subscribe, update, set } = writable({
    userPhoto: null as URL|null
  });

  return {
    subscribe,
    addUserPhoto: async (file: File) => {
      const userID = get(appstate).account!.$id;
      const role = Role.user(userID);
      const ministryRole = Role.team('646a5196a6a52ef2256d');
      const anyRole = Role.any();
      if(!role)return;

      try {
        const photoBucket = await sdk.storage.createFile(
          server.bucket_users,
          ID.unique(),
          file,
          [
            Permission.read('any'),
            Permission.update(role),
            Permission.delete(role)
          ]
        );
        await userbucketstate.getPreview(photoBucket.$id);
        return photoBucket;
      } catch (error) {
        console.info('Failed to add user photo:', error);
      }
    },
    getPreview: async (id: string) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID);
      if(!role)return;

      try {
        const userPhoto:any = sdk.storage.getFilePreview(
          server.bucket_users, id, 256, 256, ImageGravity.Center, 80
        );
        // console.log('Bucket response: ',photoPreview);
        set({ userPhoto });
        // return photoPreview;
      } catch (error) {
        console.info('Failed to retrieve preview photo:', error);
      }
    },
    clearPhoto: () => {
      set({ userPhoto: null })
    }
  }
}

// USER Account state

const createState = () => {
  const { subscribe, set, update } = writable({
    account: null as Account|null,
    initials: null as string|null,
    _loading: false,
    isSignedIn: false
  });

  const setLoading = (isLoading: boolean)=>{
    update(appstate => ({...appstate, _loading: isLoading}));
  }
  return {
    subscribe,
    checkLoggedIn: async () => {
      setLoading(true);
      try {
        const account = await sdk.account.get();
        const initials = sdk.avatars.getInitials();
        appstate.init(account,initials);
        if(account && get(appstate).account?.prefs.photoID){
          await userbucketstate.getPreview(account.prefs.photoID)
        }
        update(state => ({ ...state, isSignedIn: true }));
      } catch (error) {
        update(state => ({ ...state, isSignedIn: false }));
      } finally {
        setLoading(false);
      }
    },
    checkVerificationStatus: () =>{
      return get(appstate).account?.emailVerification;
    },
    signup: async (email: string, password: string, name: string) => {
      setLoading(true);
      petstate.init();
      mail.clear();
      await sdk.account.create('unique()', email, password, name);
      const account = await appstate.login(email, password)
      const initials = sdk.avatars.getInitials();
      await appstate.init(account, initials)
      await appstate.sendVerificationEmail();
      setLoading(false);
      // return account;
    },
    sendVerificationEmail: async () => {
      const host = 'https://buddies.simmons.studio/auth/verify';
      return await sdk.account.createVerification(host)
    },
    login: async (email: string, password: string) => {
      setLoading(true);
      appstate.init();
      petstate.init();
      mail.clear();
      userbucketstate.clearPhoto();
      const session = await sdk.account.createEmailPasswordSession(email, password);
      // await sdk.account.get();
      const initials = sdk.avatars.getInitials();
      userbucketstate.getPreview(session.userId);
      appstate.init(session, initials);
      // setPrefs(await ...sdk.account.getPrefs());
      update(state => ({ ...state, isSignedIn: true }));
      setLoading(false);
    },
    logout: async () => {
      setLoading(true);
      await sdk.account.deleteSession('current');
      appstate.init();
      petstate.init();
      mail.clear();
      userbucketstate.clearPhoto();
      update(state => ({ ...state, isSignedIn: false }));
      setLoading(false);
    },
    updateUserPrefs: async (prefs: Models.Preferences) => {
      if(!get(appstate).account) {
        console.info('No user logged in');
        return;
      }
      
      setLoading(true);
      const prfs = await sdk.account.getPrefs();
      // console.log('Current User Prefs: ',prfs);
      // console.log('New User Prefs: ',prefs);
      const result = await sdk.account.updatePrefs({...prfs, ...prefs});
      appstate.init(result),
      setLoading(false);
    },
    getUserPrefs: async ()=> {
      if(!get(appstate).account) {
        console.info('No user logged in');
        return;
      }
      const result = await sdk.account.getPrefs();
      appstate.init(result);
    },
    init: async (account: any = null, initials: string|null = null ) => {
      return set({ account, initials, _loading: false, isSignedIn:!!account });
    },
  };
};

// Ads

const createAdsState = () => {
  const { subscribe, update, set } = writable<IAd[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const verifiedUser = get(appstate).account?.emailVerification || false;

      try {
        const response: any = await sdk.database.listDocuments(server.database, server.collection_ads, [
          Query.limit(10)
        ]);
        // console.log('Ads: ',response.documents);
        
        set(response.documents);
      } catch (error) {
        console.info('Error querying ads.',error)
      }
    },
  }
}

// MAIL

const createMailState = () => {
  const { subscribe, update, set } = writable<IMail[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;
      const role = Role.user(userID,'verified');
      if(!role)return;
  
      const response = await sdk.database.listDocuments(server.database, server.collection_mail, [
        Query.orderDesc(""), // implement way to fetch only titles and body, for performance, then full fetch per individual message
        ]
      );
      set(response.documents as any);
    },
    openMessage: async (id: string) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID,'verified');
      if(!role)return;
  
      const response: any = await sdk.database.getDocument(server.database, server.collection_mail, id);
        // this dance might need to be swapped
      update((m) => ([response.documents, ...m]));
      await mail.isRead(id);
    },
    sendMessage: async (title:string|undefined = undefined, message: string, toId: string, isRead: boolean = false) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID);
      if(!role)return;

      const msg = await sdk.database.createDocument<IMail>(
        server.database,
        server.collection_mail,
        ID.unique(),
        {
          title,
          message,
          toId,
          fromId: userID,
          ownerID: [userID],
          isRead
        },
        [
          Permission.read(role),
          Permission.read(toId),
          Permission.update(role),
          Permission.update(toId),
        ]
      );
      update((m) => ([msg, ...m]
      ));
    },

    isRead: async (messageId: string) => {
      const userID = get(appstate).account?.$id;
      if(!userID)return;

      const role = Role.user(userID);
      if(!role)return;

      const msg:any = await sdk.database.updateDocument(
        server.database,
        server.collection_mail,
        messageId,
        {isRead: true},
        [
          Permission.read(role), Permission.update(role)
        ]
      );
      
      update((m) => ([msg, ...m]));
    },
    clear: async () => {
      set([]);
    }
  };
};

export const petstate = createPets();
export const petbucketstate = createPetPhoto();
export const userbucketstate = createUserPhoto();
export const clinicstate = createClinics();
export const appstate = createState();
export const ads = createAdsState();
export const mail = createMailState();
