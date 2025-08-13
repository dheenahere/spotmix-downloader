import React from 'react'
import { motion } from "motion/react";

const GridCard = ({ number, title, description, className }) => {
    return (
        <motion.div initial={{ opacity: 0, backdropFilter: "blur(5px)" }}
            whileInView={{ opacity: 1, backdropFilter: "blur(0px)" }}
            transition={{
                delay: 0.3,
                duration: 2,
                ease: "easeInOut",
            }} className={`border-gray-400 border-[0.5px] w-full  p-8 text-white  min-w-80 min-h-80 bg-transparent relative ${className}`}>
            <div className="absolute -top-5 text-4xl font-para -left-2.5 ">+</div>
            <div className="absolute -bottom-5 text-4xl font-para -left-2.5 ">+</div>
            <div className="absolute -bottom-5 text-4xl font-para -right-2.5 ">+</div>
            <div className="absolute -top-5 text-4xl font-para -right-2.5 ">+</div>
            <div className='font-number text-6xl text-right'>{number}</div>
            <div className='font-title text-3xl mt-3 text-left'>{title}</div>
            <div className='font-para tracking-wider mt-2 text-gray-400 text-xl text-left'>{description}</div>
        </motion.div>
    )
}

export default GridCard