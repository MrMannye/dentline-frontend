'use client'

import React, { useState } from 'react'
import Dates from '../../src/modules/dates/Dates'
import TabService from '../../src/modules/dates/components/TabService';
import TabSummary from '../../src/modules/dates/components/TabSummary';

export default function Index() {

	const [section, setSection] = useState("Date");
	const handleSetNavigation = (path: string) => {
		setSection(path)
	}

	return (
		<div className='w-full flex-1 flex flex-col'>
			<div className='flex items-center justify-between h-[48px] w-full bg-secundary-color text-white'>
				<h3 onClick={() => handleSetNavigation("Date")} className={` w-full h-full flex items-center justify-center ${section === "Date" && "bg-primary-500"}`}>HORARIO</h3>
				<h3 onClick={() => handleSetNavigation("Service")} className={`w-full h-full flex items-center justify-center ${section === "Service" && "bg-primary-500"}`}>SERVICIOS</h3>
				<h3 onClick={() => handleSetNavigation("Summary")} className={`w-full h-full flex items-center justify-center ${section === "Summary" && "bg-primary-500"}`}>RESUMEN</h3>
			</div>
			{section === "Date" && <Dates setSection={setSection} />}
			{section === "Service" && <TabService setSection={setSection} />}
			{section === "Summary" && <TabSummary />}
		</div>

	)
}
