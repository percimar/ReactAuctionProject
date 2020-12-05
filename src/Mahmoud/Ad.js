import React, { useState, useEffect } from "react";
import db from '../db'

export default function Ad({ auctionId, id }) {
    console.log("item id:", id)

    const [ade, setAd] = useState([]);
    useEffect(() => db.Auctions.Items.listenSubOne(setAd, auctionId, 'items', id), [])
    console.log("Item ad:", ade)

    return (

        <div>
            {/* <img
                src={ad.picture}
                alt="First slide"
                className="slick-image"
            />
            <div className="slick-caption">
                <h4>
                    {ad.name}
                </h4>
            </div> */}
        </div>

    )
}



