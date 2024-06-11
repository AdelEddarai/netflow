'use client'
import React from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css';


const WhietboardPage = () => {
    return (

        <main>
            <div className='w-70vw h-screen rounded-md'>
                <Tldraw />
            </div>
        </main>
    )
}

export default WhietboardPage