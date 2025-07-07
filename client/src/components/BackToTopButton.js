"use client";
import { Fragment, useEffect, useState } from "react"

export default function BackToTopButton() {

    const [show, setShow] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                setShow(true);
            } else {
                setShow(false);
            }
        });
    });

    const jumpToTop = () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    return (
        <Fragment>
            {
                (show) ? (
                    <div className="fixed bottom-0 right-0 mb-6 mr-6 z-10">
                    <button onClick={jumpToTop} className="bg-gray-200 text-black rounded-full hover:bg-gray-100 transition">
                        <img src="image/up-arrow.gif" className="h-10 w-10 rounded-4xl " fill="none"  stroke="currentColor">
                        </img>
                         {/* <img src="image/turn-up.gif"/> */}
                    </button>
                </div>
                ) : (<Fragment/>)
            }
        </Fragment>
    )
}