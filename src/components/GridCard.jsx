import React from 'react'
import { motion } from "motion/react";

const GridCard = ({ number, title, description, className }) => {
    return (
        <motion.div initial={{ opacity: 0, backdropFilter: "blur(5px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(0px)" }}
            transition={{
                delay: 0.3,
                duration: 2,
                ease: "easeInOut",
            }} className={`border-gray-400 border-[0.5px] w-full p-4 md:p-8 text-white  md:min-w-80 md:min-h-80 bg-transparent relative ${className}`}>
            <div className="absolute -top-5 text-4xl font-para -left-2.5 ">+</div>
            <div className="absolute -bottom-5 text-4xl font-para -left-2.5 ">+</div>
            <div className="absolute -bottom-5 text-4xl font-para -right-2.5 ">+</div>
            <div className="absolute -top-5 text-4xl font-para -right-2.5 ">+</div>
            <div className='font-number text-3xl md:text-6xl text-right'>{number}</div>
            <div className='font-title text-xl md:text-3xl mt-2 md:mt-3 text-left'>{title}</div>
            <div className='font-para tracking-wider mt-1 md:mt-2 text-gray-400 md:text-xl text-left'>{description}</div>
        </motion.div>
    )
}

export default GridCard