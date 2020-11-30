import db from '../db'

db.collection("auctions").create({displayName: "Used Car Auction", start: new Date(), finish: new Date(), status: "Ongoing"})
db.collection("auctions").doc().collection("items").create({catId: "X54I5YSOuNkcWuimFrzc", 
description: "Goes vroom vroom best car 2015 has like 4 wheels and automatic transmission but not fully automatic like you still gotta put it in park or reverse and stuff but other than that it's automatic oh and great a/c",
name: "Kia Picanto 2015",
picture: "uploadedimage_12873.png",
sellerUserId: "eQkwmjX87ZOUXSNL55XBxoPvMxc2"
})

db.collection("auctions").doc().collection("items").doc().collection('bids').create({amount: 22500, bidderUserId: "EgXLy41fwYPp5mpbnnI4ZqwWNH33", timestamp: new Date()})
db.collection("auctions").doc().collection("items").doc().collection('comments').create({comment: "how many miles?", timestamp: new Date(), userId: "EgXLy41fwYPp5mpbnnI4ZqwWNH33"})
db.collection("auctions").doc().collection("items").doc().collection('comments').create({comment: "how many miles?", timestamp: new Date(), userId: "EgXLy41fwYPp5mpbnnI4ZqwWNH33"})
db.collection("auctions").doc().collection("items").doc().collection("comments").doc().collection("replies").create({reply: "approximately 40,000km", timestamp: new Date()})