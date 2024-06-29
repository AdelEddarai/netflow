'use client'
import React from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css';


const WhietboardPage = () => {
    return (

        <main>
            <div className='w-100 h-screen rounded-md'>
                <Tldraw />
            </div>
        </main>
    )
}

export default WhietboardPage