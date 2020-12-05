//Carlos: Added items functions and auctions

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
        console.log("value", value)
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

// const Bids = 'bids'   
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
        return db.collection(this.collection).where('status', '==', 'Ongoing').onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenToUnfinishedFiltered = (set, searchText) => {
        return db.collection(this.collection).where('status', '==', 'Ongoing').onSnapshot(snap => set(snap.docs.filter(doc => doc.data().displayName.toLowerCase().includes(searchText.toLowerCase())).map(this.reformat)))
    }

    listenToFinished = set => {
        return db.collection(this.collection).where('status', '==', 'Closed').onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenToFinishedFiltered = (set, searchText) => {
        return db.collection(this.collection).where('status', '==', 'Closed').onSnapshot(snap => set(snap.docs.filter(doc => doc.data().displayName.toLowerCase().includes(searchText.toLowerCase())).map(this.reformat)))
    }

    createAuctionBid = (auctionId, { id, ...rest }) =>
        db.collection(this.collection).doc(auctionId).collection(Bids).add(rest)


    listenByCategory = (set, array) => {
        return db.collection(this.collection).where(fb.firestore.FieldPath.documentId(), 'in', array).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }
    // findByCategory = async (array) => {
    //     let data = await db.collection(this.collection).where(fb.firestore.FieldPath.documentId(), 'in', array).get()
    //     return data.docs.map(this.reformat)
    // }
}

class Categories extends DB {
    constructor() {
        super('categories')
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

    reformatOnlyId(doc) {
        return {id: doc.id}
    }

    collectOne = async (set, catId) => {
        //use forEach function ?
        return db.collection(this.collection).doc(catId).onSnapshot(snap => set(categories =>
            [...categories, this.reformat(snap)]))
    }

    listenOne = (set, catId) =>
        db.collection(this.collection).doc(catId).onSnapshot(snap => set(this.reformat(snap)))

    listenWithArray = (set, array) => {
        return db.collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformatOnlyId.id)))
    }
    // listenNoCategory = (set) => {
    //     db.collection(this.collection).onSnapshot(snap=>set(this.reformat(snap)))
    // }
}

class Items extends DB {

    constructor(containing) {
        super('items')
        this.containing = containing
        this.Bids = new Bids(this.containing, this.collection)
        this.Comments = new Comments(this.containing, this.collection)
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

    // reformatCat(doc) {
    //     return { doc }
    // }

    findOneAuctionAllItems = async auctionId => {
        const data = await db.collection(this.containing).doc(auctionId).collection(this.collection).get()
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
        if (!auctionId) { throw new ReferenceError("pass auctionId to addItem") }
        return db.collection(this.containing).doc(auctionId).collection(this.collection).add(rest)
    }

    updateItem = (auctionId, { id, ...rest }) => {
        console.log("auctionId", auctionId, "this id", id, rest)
        return db.collection(this.containing).doc(auctionId).collection(this.collection).doc(id).set(rest)
    }

    listenByCategory = (set, auctionId, catId) => {
        return db.collection(this.containing).doc(auctionId).collection(this.collection).where('catId', '==', catId).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    findByCategory = async (auctionId, catId) => {
        let data = await db.collection(this.containing).doc(auctionId).collection(this.collection).where('catId', '==', catId).get()
        return data.docs.map(this.reformat)
    }

    listenWithCategory = (set, array, catId, auctionId) => {
        //find items with category id. If item is found, add auctionId to
        return db.collection(this.containing).doc(auctionId).collection(this.collection).where('catId', '==', catId).onSnapshot(snap => snap.size > 0 ? set(array => [...array, auctionId]) : '')
    }



    // listenOnlyCategories = (set, auctionId) => {
    //     return db.collection(this.containing).doc(auctionId).collection(this.collection).onSnapshot(snap => set(array => set(snap.docs.map(this.reformatCat))))
    // }

    // setWithoutCategory = async (auctionId, {...item}) => {
    //     let doc = await db.collection('categories').where('name', '==', 'No Category').get()
    //     this.updateItem(auctionId, {...item, catId: doc.id})
    // }

    // findByCategory = async (array, catId, auctionId) => {
    //     let data = await db.collection(this.containing).doc(auctionId).collection(this.collection).where('catId', '==', catId).get()
    //     if (data.size > 0) {
    //         array.push(auctionId)
    //     }
    // }

    listenToAllItems = (set) => {
        return db.collectionGroup(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenToAllItemsByUser = (set, userId) => {
        return db.collectionGroup(this.collection).where("sellerUserId", "==", userId).onSnapshot(snap => set(snap.docs.map(this.reformat)))
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

    // listenToCategory = (set, auctionId, itemId) => {
    //     return db.collection(this.containing).doc(auctionId).collection(this.collection).doc(itemId)
    // }

}



class Bids extends DB {

    constructor(topContainer, containing) {
        super('bids')
        this.topContainer = topContainer
        this.containing = containing
    }

    createBid = (auctionId, itemId, bid) => {
        db.collection(this.topContainer).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).add(bid)
    }

    listenToOneItemAllBids = (auctionId, itemId, set) => {
        db.collection(this.topContainer).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    findAllBids = async (auctionId, itemId) => {
        const data = await db.collection(this.topContainer).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).get()
        return data.docs.map(this.reformat)
    }

    findByAmount = async (auctionId, itemId, amount) => {
        const data = await db.collection(this.topContainer).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).where('amount', '==', amount).get()
        return data.docs.map(this.reformat)
    }

    // findHighest = async (auctionId, itemId, set) => {
    //     // db.collection(this.topContainer).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).orderBy('amount').limit(1).onSnapshot(snap => set(this.reformat(snap)))
    //     db.collection(this.topContainer).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).orderBy('amount').limit(1).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    // }

}

class Users extends DB {

    constructor() {
        super('users')
        this.Following = new Following(this.collection)
        this.Notifications = new Notifications(this.collection)
    }

    findByRole = role =>
        this.findByField('role', role)
    
    listenByRole = role => {
        db.collection(this.collection).where('role', '==', role).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenAllNotAdmin = (set) => {
        db.collection(this.collection).where('role', '!=', 'admin').onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    findAllUsersNotAdmin = () => {
        let data = db.collection(this.collection).where('role', '!=', 'admin').get()
        return data.docs.map(this.reformat)
    }

    removeUserItem = (userId, itemId) =>
        db.collection(this.collection).doc(userId).collection(Items).doc(itemId).delete()

    listenToCount = set =>
        db.collection(this.collection).onSnapshot(snap => set(snap.docs.length))

}

class Notifications extends DB {
    constructor(containing) {
        super('notifications')
        this.containing = containing
    }

    reformat(doc) {
        return { ...super.reformat(doc), timestamp: doc.data().timestamp.toDate() }
    }

    listenToNotifications = (set, userId) => {
        return db.collection(this.containing).doc(userId).collection(this.collection).orderBy('timestamp', 'desc').onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenToUnseenNotificationsCount = (set, userId) => {
        return db.collection(this.containing).doc(userId).collection(this.collection).where('viewed', '==', false).onSnapshot(snap => set(snap.docs.length))
    }

    sendNotification = (userId, { ...notification }) => {
        db.collection(this.containing).doc(userId).collection(this.collection).add({ ...notification, viewed: false, timestamp: new Date() })
    }

    clearNotification = (userId, notifId) => {
        db.collection(this.containing).doc(userId).collection(this.collection).doc(notifId).delete()
    }

    markSeen = (userId, { id, viewed, ...rest }) => {
        db.collection(this.containing).doc(userId).collection(this.collection).doc(id).update({ ...rest, viewed: true })
    }

}


class Following extends DB {

    constructor(containing) {
        super('following')
        this.containing = containing
    }
    reformat(doc) {
        return { ...super.reformat(doc) }
    }

    listenToOneUserAllFollowing = (set, userId) => {
        return db.collection(this.containing).doc(userId).collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenToFollowingByAuction = (set, userId, auctionId) => {
        return db.collection(this.containing).doc(userId).collection(this.collection).where("auctionId", "==", auctionId).onSnapshot(snap => set(snap.docs.map(this.reformat)))
        // db.collection(this.containing).doc(userId).
    }
    removeOneFollowing = (userId, followingId) => {
        return db.collection(this.containing).doc(userId).collection(this.collection).doc(followingId).delete()
    }

    addFollowing = (userId, { id, ...rest }) => {
        return db.collection(this.containing).doc(userId).collection(this.collection).add(rest)
    }

}

class FAQs extends DB {

    constructor() {
        super('faqs')
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

}

class Bugs extends DB {

    constructor() {
        super('bugs')
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

}

class Adverts extends DB {

    constructor() {
        super('adverts')
    }

    listenToAdsByItem = (set, itemId) => {
        return db.collection(this.collection).where("itemId", "==", itemId).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    reformat(doc) {
        return { ...super.reformat(doc) }
    }

}

class Comments extends DB {

    constructor(topContaining, containing) {
        super('comments');
        this.topContaining = topContaining;
        this.containing = containing;
        this.Replies = new Replies(topContaining, containing, this.collection)
    }

    reformat(doc) {
        return { ...super.reformat(doc), timestamp: doc.data().timestamp.toDate() }
    }

    addComment = (auctionId, itemId, comment) => {
        db.collection(this.topContaining).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).add(comment)
    }

    removeComment = (auctionId, itemId, commentId) => {
        db.collection(this.topContaining).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).doc(commentId).delete()
    }

    listenToOneItemAllComments = (set, auctionId, itemId) => {
        db.collection(this.topContaining).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    findOneItemAllComments = async(auctionId, itemId) => {
        let data = await db.collection(this.topContaining).doc(auctionId).collection(this.containing).doc(itemId).collection(this.collection).get()
        return data.docs.map(this.reformat)
    }

}

class Replies extends DB {

    constructor(topContaining, subContaining, containing) {
        super('replies')
        this.topContaining = topContaining
        this.subContaining = subContaining
        this.containing = containing
    }

    reformat(doc) {
        return { ...super.reformat(doc), timestamp: doc.data().timestamp.toDate() }
    }

    findOneCommentAllReplies = async (auctionId, itemId, commentId) => {
        const data = await db.collection(this.topContaining).doc(auctionId).collection(this.subContaining).doc(itemId).collection(this.containing).doc(commentId).collection(this.collection).get()
        return data.docs.map(this.reformat)
    }

    listenToOneCommentAllReplies = (set, auctionId, itemId, commentId) => {
        return db.collection(this.topContaining).doc(auctionId).collection(this.subContaining).doc(itemId).collection(this.containing).doc(commentId).collection(this.collection).onSnapshot(snap => set(snap.docs.map(this.reformat)))
    }

    listenToOneCommentOneReply = (set, auctionId, itemId, commentId, replyId) => {
        return db.collection(this.topContaining).doc(auctionId).collection(this.subContaining).doc(itemId).collection(this.containing).doc(commentId).collection(this.collection).doc(replyId).onSnapshot(snap => set(this.reformat(snap)))
    }

    removeReply = (auctionId, itemId, commentId, replyId) => {
        return db.collection(this.topContaining).doc(auctionId).collection(this.subContaining).doc(itemId).collection(this.containing).doc(commentId).collection(this.collection).doc(replyId).delete()
    }

    addReply = (auctionId, itemId, commentId, { ...rest }) => {
        return db.collection(this.topContaining).doc(auctionId).collection(this.subContaining).doc(itemId).collection(this.containing).doc(commentId).collection(this.collection).add(rest)
    }

}

class Logs extends DB {

    constructor() {
        super('logs')
    }

    reformat(doc) {
        return { ...super.reformat(doc), timestamp: doc.data().timestamp.toDate() }
    }

}

export default {
    Auctions: new Auctions(),
    Users: new Users(),
    FAQs: new FAQs(),
    Categories: new Categories(),
    Bugs: new Bugs(),
    Adverts: new Adverts(),
    Logs: new Logs()
}