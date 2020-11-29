//Carlos: Added Categories, modified auctions and items to query with category 

import fb from './fb'

const db = fb.firestore()

// all database functionality here
class DB {

    constructor(collection) {
        this.collection = collection
    }

    reformat(doc) {
        return { id: doc.id, ...doc.data() }
    }

    findAll = async () => {
        const data = await db.collection(this.collection).get()
        return data.docs.map(this.reformat)
    }

    findByField = async (field, value) => {
        const data = await db.collection(this.collection).where(field, '==', value).get()
        return data.docs.map(this.reformat)
    }

    findSubAll = async (id, sub) => {
        const data = await db.collection(this.collection).doc(id).collection(sub).get()
        return data.docs.map(this.reformat)
    }

    // listen to entire collection,
    // on any change, loop over snapshot (all the data) and reformat
    // use set fn to change the state
    // return the unsubscribe which is returned from onSnapshot
    listenAll = set =>
        db.collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))

    listenSubAll = (set, id, sub) => {
        return db.collection(this.collection).doc(id).collection(sub).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenSubOne = (set, id, sub, subId) =>
        db.collection(this.collection).doc(id).collection(sub).doc(subId).onSnapshot(snap => set(this.reformat(snap)))

    findOne = async id => {
        const doc = await db.collection(this.collection).doc(id).get()
        return doc.exists ? this.reformat(doc) : undefined
    }

    findSubOne = async (id, sub, subId) => {
        const doc = await db.collection(this.collection).doc(id).collection(sub).doc(subId).get()
        return doc.exists ? this.reformat(doc) : undefined
    }

    listenOne = (set, id) => {
        return db.collection(this.collection).doc(id).onSnapshot(snap => set(this.reformat(snap)))
    }


    // item has no id
    create = ({ id, ...rest }) =>
        db.collection(this.collection).add(rest)

    // item has id
    update = ({ id, ...rest }) =>
        db.collection(this.collection).doc(id).set(rest)

    remove = id => {
        db.collection(this.collection).doc(id).delete()
    }
}

const Bids = 'bids'
// const Items = 'items'

class Auctions extends DB {

    constructor() {
        super('auctions')
        this.Items = new Items(this.collection)
    }

    reformat(doc) {
        // return { ...super.reformat(doc)}
        return { ...super.reformat(doc), start: doc.data().start.toDate(), finish: doc.data().finish.toDate() }
    }

    findAuctionBids = auctionId =>
        this.findSubAll(auctionId, Bids)

    listenToAuctionItems = (set, auctionId) => {
        return this.listenSubAll(set, auctionId, Items)
    }

    listenToAuctionBids = (set, auctionId) =>
        this.listenSubAll(set, auctionId, Bids)

    removeAuctionBid = (auctionId, bidId) =>
        db.collection(this.collection).doc(auctionId).collection(Bids).doc(bidId).delete()

    listenToAuctionsByUser = (set, userId) =>
        db.collection(this.collection).where("sellerId", "==", userId).onSnapshot(snap => set(snap.docs.map(this.reformat)))

    listenToUnfinished = set => {
        return db.collection(this.collection).where("status", '==', "Ongoing").onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }
    createAuctionBid = (auctionId, { id, ...rest }) =>
        db.collection(this.collection).doc(auctionId).collection(Bids).add(rest)

    // listenByCategory = (set, array) => {
    //     return db.collection(this.collection).where('id', 'in', array).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    // }

    listenByCategory = (set, array) => {
        return db.collection(this.collection).where(fb.firestore.FieldPath.documentId(), 'in', array).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }
}

class Categories extends DB {
    constructor() {
        super('categories')
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

    listenOne = async (set, catId) => {
        return db.collection(this.collection).doc(catId).onSnapshot(snap => set(categories => [...categories, this.reformat(snap)]))
    }
}

class Items extends DB {

    constructor(containing) {
        super('items')
        this.containing = containing
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

    findOneAuctionAllItems = async auctionId => {
        const data = await db.collection(this.containing).doc(auctionId).collection.get()
        return data.docs.map(this.reformat)
    }

    listenToOneAuctionAllItems = (set, auctionId) => {
        return db.collection(this.containing).doc(auctionId).collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    // findCategories = async (auctionId, itemId) => {
    //     const cat = await db.collection(this.containing).doc(auctionId).collection(this.collection).doc(itemId).get()
    //     console.log(this.reformat(cat).catId)
    // }

    removeOneItem = (auctionId, itemId) => {
        return db.collection(this.containing).doc(auctionId).collection(this.collection).doc(itemId).delete()
    }

    addItem = (auctionId, { id, ...rest }) => {
        return db.collection(this.containing).doc(auctionId).collection(this.collection).add(rest)
    }

    listenWithCategory = (set, array, catId, auctionId) => {
        return db.collection(this.containing).doc(auctionId).collection(this.collection).where('catId', '==', catId).onSnapshot(snap => snap.size > 0 ? set(array => [...array, auctionId]) : '')
    }

    // listenWithCategory = (set, array, catId, auctionId) => {
    //     const ref = db.collection('auctions').doc(auctionId).collection('items').where('catId', '==', 'X54I5YSOuNkcWuimFrzc')
    //     return ref.get().then((docSnapshot) => {
    //         if(docSnapshot.size > 0) {
    //             console.log('it do be existing tho')
    //         } else {
    //             console.log('eyo where it at tho')
    //         }   
    //     })
    // }

    getItemsWithCategory = async (auctionId, categoryId, set, array) => {
       
    }



    // listenToCategory = (set, auctionId, itemId) => {
    //     return db.collection(this.containing).doc(auctionId).collection(this.collection).doc(itemId)
    // }
}



class Users extends DB {

    constructor() {
        super('users')
    }

    findByRole = role =>
        this.findByField('role', role)

    findUserItems = (userId) =>
        this.findSubAll(userId, Items)

    removeUserItem = (userId, itemId) =>
        db.collection(this.collection).doc(userId).collection(Items).doc(itemId).delete()

    listenToUserItem = (set, userId, itemId) =>
        this.listenSubOne(set, userId, Items, itemId)

    listenToUserItems = (set, userId) =>
        this.listenSubAll(set, userId, Items)

    listenToCount = set =>
        db.collection(this.collection).onSnapshot(snap => set(snap.docs.length))

    createUserItem = (userId, { id, ...rest }) =>
        db.collection(this.collection).doc(userId).collection(Items).add(rest)

}



class FAQs extends DB {

    constructor() {
        super('faqs')
    }

    reformat(doc) {
        return {...super.reformat(doc)}
    }


}


export default {
    Auctions: new Auctions(),
    Bids,
    Users: new Users(),
    FAQs: new FAQs()
    Categories: new Categories(),
    Items: new Items()
}